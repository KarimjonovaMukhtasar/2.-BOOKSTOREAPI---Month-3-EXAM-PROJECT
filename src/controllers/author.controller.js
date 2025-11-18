import { ApiError } from '../helpers/errorMessage.js';
import { AuthorService } from '../services/authors.service.js';
import logger from '../utils/logger.js';

const getAllAuthors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const searchQuery = req.query.query || '';
    const authors = await AuthorService.getAll({
      page,
      limit,
      query: searchQuery,
    });
    const totalAuthors = await AuthorService.countAll({ query: searchQuery });
    const totalPages = Math.ceil(totalAuthors / limit);
    const pagination = {
      currentPage: page,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      basePath: `/authors?query=${encodeURIComponent(searchQuery)}&`,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages
    };
    res.render('authors/getAllAuthors', {
      user: req.user || null,
      authors,
      message:
        authors.length > 0
          ? 'SUCCESSFULLY RETRIEVED ALL AUTHORS'
          : `NO AUTHORS FOUND ${searchQuery ? `for "${searchQuery}"` : ''}`,
      errors: null,
      pagination,
      searchQuery,
    });
  } catch (err) {
    logger.error('Error in getAllAuthors:', err); 
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/authors',
      searchQuery: req.query.query || '', 
    });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await AuthorService.getById(id);

    return res.render('authors/getOneAuthor', {
      message: 'SUCCESSFULLY RETRIEVED ONE AUTHOR FROM DATABASE',
      author,
      title: 'SEARCHED AUTHOR',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/authors/getAllAuthors',
    });
  }
};

const getCreateAuthorPage = async (req, res) => {
  return res.render('authors/createAuthor', {
    message: null,
    data: { name: '', bio: '', birth_date: '' },
    title: 'CREATE A NEW AUTHOR',
    user: req.user ,
    errors: null,
  });
};

const createAuthor = async (req, res) => {
  try {
    const newAuthor = await AuthorService.create(req.validatedData);
    return res.render('authors/createAuthor', {
      message: 'SUCCESSFULLY CREATED AN AUTHOR!',
      data: newAuthor,
      title: 'A NEW AUTHOR',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path ? e.path.join('.') : 'field',
        message: e.message,
      }));
      return res.render('authors/createAuthor', {
        title: 'CREATE A NEW AUTHOR',
        message: null,
        data: req.validatedData,
        user: req.user ,
        errors: formattedErrors,
      });
    }
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user ,
      redirect: '/authors/createAuthor',
    });
  }
};

const getEditAuthorPage = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await AuthorService.getById(id);

    return res.render('authors/createAuthor', {
      message: null,
      data: author,
      title: 'EDIT AUTHOR',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/authors',
    });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await AuthorService.update(id, req.validatedData);

    if (!updated) throw new ApiError(404, 'AUTHOR not found');

    return res.render('authors/createAuthor', {
      message: 'AUTHOR updated successfully!',
      data: updated,
      title: 'EDIT AUTHOR',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path ? e.path.join('.') : 'field',
        message: e.message,
      }));
      return res.render('authors/createAuthor', {
        message: null,
        data: req.validatedData,
        title: 'EDIT AUTHOR',
        user: req.user,
        errors: formattedErrors,
      });
    }
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/authors',
    });
  }
};
const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AuthorService.remove(id);

    if (!deleted) throw new ApiError(404, 'AUTHOR not found');

    return res.redirect('/authors');
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/authors',
    });
  }
};

export {
  getAllAuthors,
  getAuthorById,
  getCreateAuthorPage,
  getEditAuthorPage,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};

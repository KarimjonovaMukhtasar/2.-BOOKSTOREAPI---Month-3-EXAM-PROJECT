import { ApiError } from '../helpers/errorMessage.js';
import { BookService } from '../services/books.service.js';
import logger from '../utils/logger.js';

const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const searchQuery = req.query.query || '';
    const books = await BookService.getAll({
      page,
      limit,
      query: searchQuery,
    });
    const totalBooks = await BookService.countAll({ query: searchQuery });
    const totalPages = Math.ceil(totalBooks / limit);
    const pagination = {
      currentPage: page,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      basePath: `/books?query=${encodeURIComponent(searchQuery)}&`,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages
    };
    res.render('books/getAllBooks', {
      user: req.user ,
      books,
      message:
        books.length > 0
          ? 'SUCCESSFULLY RETRIEVED ALL BOOKS'
          : `NO BOOKS FOUND ${searchQuery ? `for "${searchQuery}"` : ''}`,
      errors: null,
      pagination,
      searchQuery,
    });
  } catch (err) {
    logger.error('Error in getAllBooks:', err); 
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/books',
      searchQuery: req.query.query || '', 
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookService.getById(id);
    if (!book) {
      throw new ApiError(404, `NOT FOUND SUCH A BOOK ID!`);
    }
    return res.render('books/getOneBook', {
      message: 'SUCCESSFULLY RETRIEVED ONE BOOK FROM DATABASE',
      book,
      title: 'SEARCHED BOOK',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/books/getAllBooks',
    });
  }
};

const getCreateBookPage = async (req, res) => {
  return res.render('books/createBook', {
    message: null,
    data: null,
    title: 'CREATE A NEW BOOK',
    user: req.user,
    errors: null,
  });
};

const createBook = async (req, res) => {
  try {
    const newBook = await BookService.create(req.validatedData);
    return res.render('books/createBook', {
      message: 'SUCCESSFULLY CREATED A BOOK!',
      data: newBook,
      title: 'A NEW BOOK',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path ? e.path.join('.') : 'field',
        message: e.message,
      }));
      return res.render('books/createBook', {
        title: 'CREATE A NEW BOOK',
        message: null,
        data: null,
        user: req.user,
        errors: formattedErrors,
      });
    }
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/books/createBook',
    });
  }
};

const getEditBookPage = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookService.getById(id);
    if (!book) {
      return res.status(404).render('errors', {
        message: 'Book not found',
        errors: null,
        user: req.user,
        redirect: '/books',
      });
    }
    return res.render('books/createBook', {
      message: null,
      data: book,
      title: 'EDIT BOOK',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    return res.status(500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/books',
    });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await BookService.update(id, req.validatedData);

    if (!updated) {
      return res.status(404).render('errors', {
        message: 'Book not found',
        errors: null,
        user: req.user,
        redirect: '/books',
      });
    }
    return res.render('books/createBook', {
      message: 'Book updated successfully!',
      data: updated,
      title: 'EDIT BOOK',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path ? e.path.join('.') : 'field',
        message: e.message,
      }));
      return res.render('books/createBook', {
        message: null,
        data: req.validatedData,
        title: 'EDIT BOOK',
        user: req.user,
        errors: formattedErrors,
      });
    }
    return res.status(500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: `/books`,
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BookService.remove(id);

    if (!deleted) {
      return res.status(404).render('errors', {
        message: 'Book not found',
        errors: null,
        user: req.user,
        redirect: '/books',
      });
    }
    return res.redirect('/books');
  } catch (err) {
    return res.status(500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/books',
    });
  }
};

export {
  getAllBooks,
  getBookById,
  getCreateBookPage,
  getEditBookPage,
  createBook,
  updateBook,
  deleteBook,
};

import { ApiError } from '../helpers/errorMessage.js';
import { GenreService } from '../services/genres.service.js';
import db from '../db/knex.js';

const getAllGenres = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const genres = await GenreService.getAll({ page, limit, query: req.query.query });

    const [countResult] = await db('genres').count('id as count');
    const totalGenres = parseInt(countResult.count);
    const totalPages = Math.ceil(totalGenres / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };

    res.render('genres/getAllGenres', {
      user: req.user,
      genres,
      message: genres.length > 0 ? 'SUCCESSFULLY RETRIEVED ALL GENRES' : 'NO GENRES FOUND',
      errors: null,
      pagination,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/genres/getAllGenres',
    });
  }
};

const getGenreById = async (req, res) => {
  try {
    const { id } = req.params;
    const genre = await GenreService.getById(id);

    return res.render('genres/getOneGenre', {
      message: 'SUCCESSFULLY RETRIEVED ONE GENRE FROM DATABASE',
      genre,
      title: 'SEARCHED GENRE',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user ,
      redirect: '/genres/getAllGenres',
    });
  }
};

const getCreateGenrePage = async (req, res) => {
  return res.render('genres/createGenre', {
    message: null,
    data: { name: '', description: ''},
    title: 'CREATE A NEW GENRE',
    user: req.user,
    errors: null,
  });
};

const createGenre = async (req, res) => {
  try {
    const newGenre = await GenreService.create(req.validatedData);
    return res.render('genres/createGenre', {
      message: 'SUCCESSFULLY CREATED A GENRE!',
      data: newGenre,
      title: 'A NEW GENRE',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path ? e.path.join('.') : 'field',
        message: e.message,
      }));
      return res.render('genres/createGenre', {
        title: 'CREATE A NEW GENRE',
        message: null,
        data: req.validatedData || null,
        user: req.user,
        errors: formattedErrors,
      });
    }
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/genres/getAllGenres',
    });
  }
};

const getEditGenrePage = async (req, res) => {
  try {
    const { id } = req.params;
    const genre = await GenreService.getById(id);

    return res.render('genres/createGenre', {
      message: null,
      data: genre,
      title: 'EDIT GENRE',
      user: req.user,
      errors: null,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/genres',
    });
  }
};

const updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await GenreService.update(id, req.validatedData);

    if (!updated) throw new ApiError(404, 'GENRE not found');

    return res.render('genres/createGenre', {
      message: 'GENRE updated successfully!',
      data: updated,
      title: 'EDIT GENRE',
      user: req.user ,
      errors: null,
    });
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path ? e.path.join('.') : 'field',
        message: e.message,
      }));
      return res.render('genres/createGenre', {
        message: null,
        data: req.validatedData,
        title: 'EDIT GENRE',
        user: req.user,
        errors: formattedErrors,
      });
    }
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/genres',
    });
  }
};
const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GenreService.remove(id);
    if (!deleted) throw new ApiError(404, 'Genre not found');
    return res.redirect('/genres');
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user,
      redirect: '/genres',
    });
  }
};

export {
  getAllGenres,
  getGenreById,
  getCreateGenrePage,
  getEditGenrePage,
  createGenre,
  updateGenre,
  deleteGenre,
};

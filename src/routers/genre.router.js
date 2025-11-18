import { Router } from 'express';
import { authGuard } from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import {
  createGenre,
  getAllGenres,
  getCreateGenrePage,
  getEditGenrePage,
  updateGenre,
  deleteGenre,
  getGenreById,
} from '../controllers/genre.controller.js';
import { validate } from '../middleware/validate.js';
import { genreValidate, genreUpdate } from '../validations/genre.validation.js';

export const GenreRouter = Router();
GenreRouter.get(
  '/',
  authGuard,
  roleGuard('user', 'admin', 'superadmin'),
  getAllGenres,
);
GenreRouter.get(
  '/new',
  authGuard,
  roleGuard('admin', 'superadmin'),
  getCreateGenrePage,
);
GenreRouter.post(
  '/new',
  authGuard,
  roleGuard('admin', 'superadmin'),
  validate(genreValidate),
  createGenre,
);
GenreRouter.get(
  '/:id',
  authGuard,
  roleGuard('user', 'admin', 'superadmin'),
  getGenreById,
);
GenreRouter.get(
  '/:id/edit',
  authGuard,
  roleGuard('admin', 'superadmin'),
  getEditGenrePage,
);
GenreRouter.post(
  '/:id/edit',
  authGuard,
  roleGuard('admin', 'superadmin'),
  validate(genreUpdate),
  updateGenre,
);

GenreRouter.post(
  '/:id/delete',
  authGuard,
  roleGuard('admin', 'superadmin'),
  deleteGenre,
);

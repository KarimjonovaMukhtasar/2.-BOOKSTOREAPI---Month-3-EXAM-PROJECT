import { Router } from 'express';
import { authGuard } from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import {
  authorValidate,
  authorUpdate,
} from '../validations/author.validation.js';
import {
  getAllAuthors,
  getAuthorById,
  getEditAuthorPage,
  getCreateAuthorPage,
  createAuthor,
  deleteAuthor,
  updateAuthor,
} from '../controllers/author.controller.js';

export const AuthorRouter = Router();
AuthorRouter.get(
  '/',
  authGuard,
  roleGuard('user', 'admin', 'superadmin'),
  getAllAuthors,
);
AuthorRouter.get(
  '/new',
  authGuard,
  roleGuard('admin', 'superadmin'),
  getCreateAuthorPage,
);
AuthorRouter.post(
  '/new',
  authGuard,
  roleGuard('admin', 'superadmin'),
  validate(authorValidate),
  createAuthor,
);
AuthorRouter.get(
  '/:id',
  authGuard,
  roleGuard('user', 'admin', 'superadmin'),
  getAuthorById,
);
AuthorRouter.get(
  '/:id/edit',
  authGuard,
  roleGuard('admin', 'superadmin'),
  getEditAuthorPage,
);
AuthorRouter.post(
  '/:id/edit',
  authGuard,
  roleGuard('admin', 'superadmin'),
  validate(authorUpdate),
  updateAuthor,
);

AuthorRouter.post(
  '/:id/delete',
  authGuard,
  roleGuard('admin', 'superadmin'),
  deleteAuthor,
);

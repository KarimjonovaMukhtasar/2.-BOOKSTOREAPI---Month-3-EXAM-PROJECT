import { Router } from 'express';
import {
  LoginRouter,
  ProfileRouter,
  RegisterRouter,
  VerifyOtpRouter,
  LogoutRouter,
  RefreshRouter,
} from './auth.router.js';
import { getHomePage } from '../controllers/auth.controller.js';
import { BookRouter } from './book.router.js';
import {AuthorRouter} from './author.router.js'
import { GenreRouter } from './genre.router.js';
import { UserRouter } from './user.router.js';
import { OrderRouter } from './order.router.js';

export const MainRouter = Router();
MainRouter.use('/auth/signin', LoginRouter);
MainRouter.use('/auth/signup', RegisterRouter);
MainRouter.use('/auth/me', ProfileRouter);
MainRouter.use('/auth/verify-otp', VerifyOtpRouter);
MainRouter.use('/auth/logout', LogoutRouter);
MainRouter.use('/auth/refresh-token', RefreshRouter);
MainRouter.use('/home', getHomePage);
MainRouter.use('/books', BookRouter)
MainRouter.use('/authors', AuthorRouter)
MainRouter.use('/genres', GenreRouter )
MainRouter.use('/users', UserRouter)
MainRouter.use('/orders', OrderRouter)

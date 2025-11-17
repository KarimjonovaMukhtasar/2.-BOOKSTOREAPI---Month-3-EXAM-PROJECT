import { Router } from 'express';
import { LoginRouter, ProfileRouter, RegisterRouter, VerifyOtpRouter, LogoutRouter, RefreshRouter } from './auth.router.js';
import { getHomePage } from '../controllers/auth.controller.js';

export const MainRouter = Router();
MainRouter.use('/auth/signin', LoginRouter);
MainRouter.use('/auth/signup', RegisterRouter);
MainRouter.use('/auth/me', ProfileRouter)
MainRouter.use('/auth/verify-otp', VerifyOtpRouter)
MainRouter.use('/auth/logout', LogoutRouter)
MainRouter.use('/auth/refresh-token', RefreshRouter)
MainRouter.use('/home', getHomePage)
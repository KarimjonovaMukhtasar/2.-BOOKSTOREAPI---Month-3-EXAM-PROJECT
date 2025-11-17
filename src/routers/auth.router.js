import { Router } from 'express';
import {authGuard} from '../middleware/authGuard.js'
import {
  signIn,
  signUp,
  getSignInPage,
  getSignUpPage,
  getMe,
  verifyOtp,
  getVerifyOtpPage,
  logOut,
  getRefreshTokenPage,
  refreshToken

} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import {
  userRegisterValidate,
  LoginValidate,
} from '../validations/auth.validation.js';

export const LoginRouter = Router();
LoginRouter.get('/', getSignInPage);
LoginRouter.post('/', validate(LoginValidate), signIn);

export const RegisterRouter = Router();
RegisterRouter.get('/', getSignUpPage);
RegisterRouter.post('/', validate(userRegisterValidate), signUp);


export const ProfileRouter = Router()
ProfileRouter.get('/', authGuard, getMe)

export const VerifyOtpRouter = Router()
VerifyOtpRouter.get('/', authGuard, getVerifyOtpPage)
VerifyOtpRouter.post('/', authGuard, verifyOtp)

export const LogoutRouter = Router()
LogoutRouter.get('/', authGuard, logOut)

export const RefreshRouter = Router();
RefreshRouter.get('/', authGuard, getRefreshTokenPage);
RefreshRouter.post('/', refreshToken);

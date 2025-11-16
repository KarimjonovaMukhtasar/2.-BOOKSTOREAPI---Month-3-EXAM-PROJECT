import {Router} from "express"
import { signIn, signUp, getSignInPage, getSignUpPage } from '../controllers/auth.controller.js';
import {validate} from "../middleware/validate.js"
import { userRegisterValidate, LoginValidate } from "../validations/auth.validation.js";


export const LoginRouter = Router()
LoginRouter.get('/', getSignInPage);
LoginRouter.post('/', validate(LoginValidate), signIn);

export const RegisterRouter = Router()
RegisterRouter.get('/', getSignUpPage)
RegisterRouter.post('/', validate(userRegisterValidate), signUp);

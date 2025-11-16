import { AuthService } from '../services/auth.service.js';
import { ApiError } from '../helpers/errorMessage.js';

const getSignInPage = (req, res) => {
  res.render('auth/signin', {
    message: null,
    data: null,
    title: 'SIGN IN',
    user: req.user || null,
    errors: null,
  });
};

const getSignUpPage = (req, res) => {
  res.render('auth/signup', {
    message: null,
    data: null,
    title: 'SIGN UP',
    user: req.user || null,
    errors: null,
  });
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.validatedData;
    const login = await AuthService.SignInService(email, password);
    res.cookie('accessToken', login.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', login.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 31 * 24 * 60 * 60 * 1000,
    });

    return res.render('auth/signin', {
      title: 'SIGN IN',
      message: `SUCCESSFULLY LOGGED IN CONGRATULATIONS!`,
      user: req.user || null,
      errors: null,
    });
  } catch (err) {
    if (err.errors) {
      return res.status(400).render('errors', {
        message: 'Validation failed',
        errors: err.errors,
        user: req.user || null,
        redirect: '/auth/signin',
      });
    }
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user || null,
      redirect: '/auth/signin',
    });
  }
};

const signUp = async (req, res) => {
  try {
    const data = req.validatedData;
    if (!data) {
      throw new ApiError(401, `FIELDS MUST BE FILLED CORRECTLY AND FULLY!`);
    }
    const signup = await AuthService.SignUpService(data);
    return res.render('auth/signup', {
      title: 'SIGN UP',
      message: `SUCCESSFULLY SIGNED UP CONGRATULATIONS!`,
      data: signup,
      user: req.user || null,
      errors: null,
    });
  } catch (err) {
    if (err.errors) {
      return res.status(400).render('errors', {
        message: 'Validation failed',
        errors: err.errors,
        user: req.user || null,
        redirect: '/auth/signup',
      });
    }
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user || null,
      redirect: '/auth/signup',
    });
  }
};

export { getSignInPage, getSignUpPage, signIn, signUp };

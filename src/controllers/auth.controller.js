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

const getVerifyOtpPage = (req, res) => {
  res.render('auth/verifyOtp', {
    message: null,
    data: null,
    title: 'Verify Otp',
    user: req.user,
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
    if (!login) {
      return res.status(404).render('errors', {
        message: 'INVALID PASSWORD OR EMAIL!',
        errors: null,
        user: req.user || null,
        redirect: '/auth/signin',
      });
    }
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
      message: `SUCCESSFULLY SIGNED UP, CONGRATULATIONS!`,
      data: signup,
      user: req.user || null,
      errors: null,
    });
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path ? e.path.join('.') : 'field',
        message: e.message,
      }));
      return res.render('auth/signup', {
        title: 'SIGN UP',
        message: null,
        data: null,
        user: req.user || null,
        errors: formattedErrors,
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

const getMe = async (req, res) => {
  try {
    const user = await AuthService.profileService(req.user.id);
    if (!user) {
      throw new ApiError(
        401,
        `NOT FOUND A USER PROFILE, PLEASE, REGISTER OR LOG IN FIRST`,
      );
    }
    return res.render('auth/profile', {
      title: 'GET ME',
      message: `SUCCESSFULLY RETRIEVED PROFILE DATA!`,
      data: null,
      user: user,
      errors: null,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user || null,
      redirect: '/auth/profile',
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const otp = req.body.otp;
    if (!otp) throw new ApiError(400, 'OTP is required');
    const result = await AuthService.verifyOtpService({
      user_id: req.user.id,
      otp: otp,
    });
    return res.render('auth/verifyOtp', {
      title: 'Verify OTP',
      message: 'SUCCESSFULLY VERIFIED THE OTP!',
      data: result,
      user: req.user,
      errors: null,
    });
  } catch (err) {
    return res.status(err.status || 400).render('auth/verifyOtp', {
      title: 'Verify OTP',
      message: null,
      data: null,
      user: req.user || null,
      errors: err.errors
        ? err.errors.map((e) => ({
            field: e.path ? e.path.join('.') : 'field',
            message: e.message,
          }))
        : [{ field: 'otp', message: err.message }],
    });
  }
};

const logOut = async (req, res) => {
  try {
    await AuthService.logoutService(req.user.id);
    res.clearCookie('refreshToken');
    return res.render('auth/logout', {
      title: 'Logout',
      message: 'You have been successfully logged out.',
      data: null,
      user: null,
      errors: null,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user || null,
      redirect: '/auth/signin',
    });
  }
};

const getRefreshTokenPage = (req, res) => {
  res.render('auth/refreshToken', {
    message: null,
    data: null,
    title: 'Refresh Token',
    user: req.user || null,
    errors: null,
  });
};

const refreshToken = async (req, res) => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;
    if (!tokenFromCookie) {
      throw new ApiError(401, 'No refresh token found in cookies');
    }

    const tokens = await AuthService.refreshTokenService(tokenFromCookie);
    if (tokens.message) {
      return res.render('auth/refreshToken', {
        title: 'Refresh Token',
        message: tokens.message,
        data: null,
        user: req.user || null,
        errors: null,
      });
    }
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.render('auth/refreshToken', {
      title: 'Refresh Token',
      message: 'Tokens refreshed successfully!',
      data: null,
      user: req.user || null,
      errors: null,
    });
  } catch (err) {
    return res.status(err.status || 500).render('errors', {
      message: err.message || 'Something went wrong',
      errors: null,
      user: req.user || null,
      redirect: '/auth/refresh-token',
    });
  }
};

const getHomePage = (req, res) => {
  res.render('home', {
    message: null,
    data: null,
    title: 'MAIN PAGE',
    user: req.user || null,
    errors: null,
  });
};

export {
  getSignInPage,
  getSignUpPage,
  getVerifyOtpPage,
  getRefreshTokenPage,
  signIn,
  signUp,
  getMe,
  verifyOtp,
  logOut,
  refreshToken,
  getHomePage,
};

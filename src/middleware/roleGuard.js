import { ApiError } from '../helpers/errorMessage.js';

export const roleGuard = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return next(
          new ApiError(
            401,
            `UNAUTHORIZED, PLEASE RESGISTER AND VERIY YOUR OTP!`,
          ),
        );
      }
      const userRole = req.user.role;
      if (!roles.includes(userRole)) {
        throw new ApiError(
            403,
            'FORBIDDEN, YOUR ROLE HAS BEEN DENIED FOR THIS ACCESS!',
          )
      }
      next();
    } catch (err) {
      return res.status(err.status || 500).render('errors', {
      message: err.message,
      errors: null,
      user: req.user,
      redirect: '/home'
    });
    }
  };
};

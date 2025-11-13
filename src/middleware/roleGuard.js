import { ApiError } from '../helper/errorMessage.js';

export const roleGuard = (...roles) => {
  return (req, res, next) => {
    try {
      if(!req.user || !req.user.role){ 
        return next(new ApiError(401, `UNAUTHORIZED, PLEASE RESGISTER AND VERIY YOUR OTP!`))
      }
      const userRole = req.user.role;
      if (!roles.includes(userRole)) {
        return next(new ApiError(403, 'FORBIDDEN, YOUR ROLE HAS BEEN DENIED FOR THIS ACCESS!'));
      }
      next();
    } catch (error) {
      return next(new ApiError(500, `ERROR WITH ROLE GUARD!`, error.message));
    }
  };
};
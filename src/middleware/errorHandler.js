import logger from '../utils/logger.js';

export const errorHandler = async (err, req, res, next) => {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.id,
    userId: req.user?.id,
  });
  next();
  return res.status(err.status || 500).render('errors', {
      message: err.message,
      errors: null,
      user: req.user,
      redirect: '/home'
    });
};

import logger from "../utils/logger.js"

export const errorHandler = async(err,req, res, next) => {
    console.log(err)
   logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.id,
    userId: req.user?.id,
  });
  next()
  return res
    .send({
      success: false, 
      message: err.message || `INTERNAL SERVER ERROR!`, });
};

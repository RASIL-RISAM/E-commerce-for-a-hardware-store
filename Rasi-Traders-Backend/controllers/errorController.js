import AppError from "../utils/appError.js";
import multer from "multer";

const MulterErrorHandler = (error) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return new AppError("File too Large", 400);
  }

  if (error.code === "LIMIT_FILE_COUNT") {
    return new AppError("File limit reached", 400);
  }

  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return new AppError("File must be an image", 400);
  }
};

const DefaultErrorHandler = (error) => {
  return new AppError(`${error.message}`, error.statusCode);
};

const errorHandler = (error, req, res, next) => {
  let handler;

  if (error instanceof multer.MulterError) 
  handler = MulterErrorHandler(error);

else handler = DefaultErrorHandler(error);

console.log(handler)
  return res.status(handler.statusCode).json({
    status: handler.status,
    message: handler.message,
  });
};

export default errorHandler;

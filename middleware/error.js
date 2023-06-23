const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //wrong mongodb id error

  if (err.name === "CastError") {
    const message = `Resource not found~ invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //wrong jwt token

  if (err.name === "jsonwebtoken") {
    const message = `json web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  //expire jwt token

  if (err.name === "TokenExpireError") {
    const message = `json web token is Expire, try again`;
    err = new ErrorHandler(message, 400);
  }

  //mongoose duplicatekey error

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};


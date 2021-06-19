import ErrorResponse from '../utils/ErrorResponse.js';

/**
 * Custom middleware to handle errors and return
 * meaningful error messages with error codes
 * that match the type of error.
 *
 * @param {*} err The error object.
 * @param {*} req The request object.
 * @param {*} res The response object.
 * @param {*} next Next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;

    error = new ErrorResponse(message, 404);
  }

  // mongoose duplicate key
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value and try again.`;

    error = new ErrorResponse(message, 400);
  }

  // mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')} and try again.`;

    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    data: error.message || 'Server Error',
  });
  next();
};

export default errorHandler;

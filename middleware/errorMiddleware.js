const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'Server error';

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
  next();
};

export default errorHandler;

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'Server error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
  next();
};

export default errorHandler;

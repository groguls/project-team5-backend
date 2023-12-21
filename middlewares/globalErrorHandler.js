const globalErrorHandler = (err, req, res, next) => {
  const { statusCode = 500, message = "Server error" } = err;
  res.status(statusCode).json({ message });
};

module.exports = globalErrorHandler;

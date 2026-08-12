function errorHandler(error, req, res, next) {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      method: req.method,
      path: req.originalUrl
    })
  );

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message:
        statusCode === 500
          ? "Internal server error"
          : error.message
    }
  });
}

module.exports = errorHandler;
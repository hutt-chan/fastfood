const logger = require('../utils/logger');

const notFound = (req, res) =>
  res.status(404).json({ message: `Route ${req.originalUrl} không tồn tại` });

const errorHandler = (err, req, res, _next) => {
  logger.error(`${err.status || 500} — ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };

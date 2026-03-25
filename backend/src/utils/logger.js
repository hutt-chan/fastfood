const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) =>
      `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log',  level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

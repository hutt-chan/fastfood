module.exports = {
  port:       process.env.PORT || 3000,
  jwtSecret:  process.env.JWT_SECRET || 'changeme_in_production',
  jwtExpires: process.env.JWT_EXPIRES || '7d',
  uploadDir:  process.env.UPLOAD_DIR  || 'uploads',
  bcryptRounds: 10,
};

require('dotenv').config();
const express    = require('express');
const path       = require('path');
const helmet     = require('helmet');
const cors       = require('cors');
const morgan     = require('morgan');
const compression = require('compression');

const { port } = require('./config/app');
const logger   = require('./utils/logger');
const routes   = require('./routes/v1');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Cron jobs (UC36 — cảnh báo tồn kho)
require('./jobs/stockAlertJob');

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(compression());
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/v1', routes);

// Fallback for SPA / direct page routes (navigating to /pages/...) 
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    return res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'index.html'));
  }
  next();
});

// ── Health check ────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ── Error handlers ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => logger.info(`Server running on port ${port}`));

module.exports = app;

const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

// Import configurations and middleware
const appConfig = require('./config/app');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();
const PORT = appConfig.port;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add Morgan HTTP request logging
app.use(morgan('combined'));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', appConfig.cors.origin);
  res.header('Access-Control-Allow-Methods', appConfig.cors.methods.join(', '));
  res.header('Access-Control-Allow-Headers', appConfig.cors.allowedHeaders.join(', '));
  next();
});

// Routes
app.use('/', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Multi-Client Webhook API Server started on port ${PORT}`);
  logger.info(`📧 Webhook endpoints: http://localhost:${PORT}/webhook/:clientId/shipment`);
  logger.info(`❤️  Health check: http://localhost:${PORT}/health`);
  logger.info(`📋 Available clients: http://localhost:${PORT}/health/clients`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
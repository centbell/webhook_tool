const express = require('express');
const webhookRoutes = require('./webhook');
const healthRoutes = require('./health');

const router = express.Router();

// Mount routes
router.use('/webhook', webhookRoutes);
router.use('/health', healthRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Multi-Client Webhook API Server',
    version: '2.0.0',
    endpoints: {
      webhook: 'POST /webhook/:clientId/shipment',
      webhookStatus: 'GET /webhook/:clientId/status',
      health: 'GET /health',
      clients: 'GET /health/clients'
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

module.exports = router;
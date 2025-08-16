const express = require('express');
const webhookController = require('../controllers/webhookController');
const validateWebhook = require('../middleware/validateWebhook');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting to webhook routes
router.use(rateLimiter);

// Webhook routes for different clients
router.post('/:clientId/shipment', validateWebhook, webhookController.handleShipmentWebhook);
router.get('/:clientId/status', webhookController.getWebhookStatus);

module.exports = router;
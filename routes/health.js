const express = require('express');
const healthController = require('../controllers/healthController');

const router = express.Router();

// Health check routes
router.get('/', healthController.getHealth);
router.get('/clients', healthController.getClients);

module.exports = router;
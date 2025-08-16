const logger = require('../utils/logger');

/**
 * Middleware to validate webhook payload
 */
const validateWebhook = (req, res, next) => {
  try {
    const webhookData = req.body;
    
    // Check if required fields exist
    const requiredFields = ['shipment_status', 'awb', 'order_id'];
    const missingFields = requiredFields.filter(field => !webhookData[field]);
    
    if (missingFields.length > 0) {
      logger.error('Webhook validation failed - missing fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook payload',
        missingFields
      });
    }
    
    // Validate client ID parameter
    const clientId = req.params.clientId;
    if (!clientId || isNaN(clientId)) {
      logger.error('Invalid client ID:', clientId);
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID. Must be a number.'
      });
    }
    
    // Add validation timestamp
    req.validatedAt = new Date().toISOString();
    
    logger.info('Webhook validation passed', {
      clientId,
      awb: webhookData.awb,
      status: webhookData.shipment_status
    });
    
    next();
  } catch (error) {
    logger.error('Webhook validation error:', error);
    return res.status(400).json({
      success: false,
      message: 'Webhook validation failed',
      error: error.message
    });
  }
};

module.exports = validateWebhook;
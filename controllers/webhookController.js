const emailService = require('../utils/emailService');
const logger = require('../utils/logger');
const clientConfig = require('../config/clients');

class WebhookController {
  /**
   * Handle shipment webhook for specific client
   */
  async handleShipmentWebhook(req, res) {
    try {
      const clientId = req.params.clientId;
      const webhookData = req.body;
      
      logger.info(`Webhook received for client ${clientId}:`, {
        clientId,
        awb: webhookData.awb,
        status: webhookData.shipment_status
      });
      
      // Validate client exists
      const client = clientConfig[clientId];
      if (!client) {
        logger.error(`Invalid client ID: ${clientId}`);
        return res.status(404).json({
          success: false,
          message: `Client ${clientId} not found`
        });
      }
      
      // Check if shipment status is DELIVERED
      if (webhookData.shipment_status === 'DELIVERED') {
        logger.info(`Shipment ${webhookData.awb} delivered for client ${clientId}. Sending notification...`);
        
        // Send email notification
        const emailResult = await emailService.sendDeliveryNotification(clientId, webhookData);
        
        if (emailResult.success) {
          logger.info('Email sent successfully:', {
            clientId,
            awb: webhookData.awb,
            emailId: emailResult.emailId
          });
          
          return res.status(200).json({
            success: true,
            message: 'Webhook processed and email sent successfully',
            client: client.name,
            emailId: emailResult.emailId
          });
        } else {
          logger.error('Failed to send email:', emailResult.error);
          
          return res.status(500).json({
            success: false,
            message: 'Webhook processed but email sending failed',
            error: emailResult.error
          });
        }
      } else {
        logger.info(`Shipment status: ${webhookData.shipment_status} for client ${clientId}. No email notification needed.`);
        
        return res.status(200).json({
          success: true,
          message: 'Webhook processed successfully. No email sent (status not DELIVERED)',
          client: client.name,
          status: webhookData.shipment_status
        });
      }
    } catch (error) {
      logger.error('Error processing webhook:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  /**
   * Get webhook status/health for specific client
   */
  async getWebhookStatus(req, res) {
    try {
      const clientId = req.params.clientId;
      const client = clientConfig[clientId];
      
      if (!client) {
        return res.status(404).json({
          success: false,
          message: `Client ${clientId} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        client: {
          id: clientId,
          name: client.name,
          emailTemplate: client.emailTemplate
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error getting webhook status:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new WebhookController();
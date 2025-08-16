const logger = require('../utils/logger');
const clientConfig = require('../config/clients');

class HealthController {
  /**
   * General health check
   */
  async getHealth(req, res) {
    try {
      const health = {
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        clients: Object.keys(clientConfig).length
      };
      
      logger.info('Health check requested');
      
      return res.status(200).json(health);
    } catch (error) {
      logger.error('Health check failed:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Health check failed',
        error: error.message
      });
    }
  }
  
  /**
   * Get all configured clients
   */
  async getClients(req, res) {
    try {
      const clients = Object.keys(clientConfig).map(id => ({
        id,
        name: clientConfig[id].name,
        emailTemplate: clientConfig[id].emailTemplate,
        webhookUrl: `/webhook/${id}/shipment`
      }));
      
      return res.status(200).json({
        success: true,
        clients,
        total: clients.length
      });
    } catch (error) {
      logger.error('Error getting clients:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new HealthController();
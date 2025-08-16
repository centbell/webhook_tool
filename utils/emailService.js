const { Resend } = require("resend");
const clientConfig = require("../config/clients");
const emailTemplates = require("./emailTemplates");
const logger = require("./logger");

class EmailService {
  /**
   * Get Resend client for specific client
   */
  getResendClient(clientId) {
    const client = clientConfig[clientId];
    if (!client || !client.resend.apiKey) {
      throw new Error(`Invalid client configuration for client ${clientId}`);
    }

    return new Resend(client.resend.apiKey);
  }

  /**
   * Send delivery notification email
   */
  async sendDeliveryNotification(clientId, webhookData) {
    try {
      const client = clientConfig[clientId];
      if (!client) {
        throw new Error(`Client ${clientId} not found`);
      }

      const resend = this.getResendClient(clientId);

      // Get email content using the appropriate template
      const emailContent = emailTemplates.generateContent(
        client.emailTemplate,
        webhookData
      );

      // Prepare email data
      const emailData = {
        from: client.resend.from,
        to: client.resend.to,
        subject: client.resend.template.subject
          .replace("{{awb}}", webhookData.awb)
          .replace("{{courier_name}}", webhookData.courier_name),
        text: emailContent,
        html: `${emailContent}`,
      };

      logger.info("Sending email:", {
        clientId,
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
      });

      // Send email
      const result = await resend.emails.send(emailData);

      return {
        success: true,
        emailId: result.data?.id,
        client: client.name,
      };
    } catch (error) {
      logger.error("Email sending failed:", {
        clientId,
        error: error.message,
        awb: webhookData.awb,
      });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Test email configuration for a client
   */
  async testEmailConfig(clientId) {
    try {
      const client = clientConfig[clientId];
      if (!client) {
        throw new Error(`Client ${clientId} not found`);
      }

      const resend = this.getResendClient(clientId);

      // Send test email
      const testData = {
        from: client.resend.from,
        to: client.resend.to,
        subject: `Test Email - ${client.name}`,
        text: `This is a test email for client ${client.name} (ID: ${clientId})\n\nConfiguration is working correctly.`,
        html: `<p>This is a test email for client <strong>${client.name}</strong> (ID: ${clientId})</p><p>Configuration is working correctly.</p>`,
      };

      const result = await resend.emails.send(testData);

      return {
        success: true,
        emailId: result.data?.id,
        message: "Test email sent successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new EmailService();

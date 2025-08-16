const logger = require("./logger");

class EmailTemplates {
  /**
   * Get the last scan location from scans object
   */
  getLastScanLocation(scans) {
    if (!scans || typeof scans !== "object") return "N/A";

    const scanKeys = Object.keys(scans)
      .map(Number)
      .sort((a, b) => b - a);
    if (scanKeys.length === 0) return "N/A";

    const lastScan = scans[scanKeys[0]];
    return lastScan?.location || "N/A";
  }

  /**
   * Client 1 email template
   */
  generateClient1Template(webhookData) {
    const lastLocation = this.getLastScanLocation(webhookData.scans);

    return `
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family: Arial, sans-serif; font-size: 12px; color: #333; border-collapse: collapse;">
    <tbody>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #dddddd;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
            <tr>
              <td width="120" style="font-weight: bold; color: #333; padding: 4px 10px 4px 0;">Status:</td>
              <td style="padding: 4px 0;">${webhookData.shipment_status}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #dddddd;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
            <tr>
              <td width="120" style="font-weight: bold; color: #333; padding: 4px 10px 4px 0;">Order ID:</td>
              <td style="padding: 4px 0;">${webhookData.order_id}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #dddddd;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
            <tr>
              <td width="120" style="font-weight: bold; color: #333; padding: 4px 10px 4px 0;">AWB:</td>
              <td style="padding: 4px 0;">${webhookData.awb}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #dddddd;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
            <tr>
              <td width="120" style="font-weight: bold; color: #333; padding: 4px 10px 4px 0;">Courier:</td>
              <td style="padding: 4px 0;">${
                webhookData.courier_name || "N/A"
              }</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #dddddd;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
            <tr>
              <td width="120" style="font-weight: bold; color: #333; padding: 4px 10px 4px 0;">AWB Assigned:</td>
              <td style="padding: 4px 0;">${
                webhookData.awb_assigned_date || "N/A"
              }</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #dddddd;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
            <tr>
              <td width="120" style="font-weight: bold; color: #333; padding: 4px 10px 4px 0;">Delivered:</td>
              <td style="padding: 4px 0;">${
                webhookData.delivered_date || "N/A"
              }</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
            <tr>
              <td width="120" style="font-weight: bold; color: #333; padding: 4px 10px 4px 0;">Last Location:</td>
              <td style="padding: 4px 0;">${lastLocation}</td>
            </tr>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
`.trim();
  }

  /**
   * Client 2 email template (different format)
   */
  generateClient2Template(webhookData) {
    const lastLocation = this.getLastScanLocation(webhookData.scans);

    return `
🚚 DELIVERY NOTIFICATION - CLIENT 2

═══════════════════════════════════════

📦 Package Details:
   • AWB Number: ${webhookData.awb}
   • Order ID: ${webhookData.order_id}
   • Status: ${webhookData.shipment_status}

🚛 Courier Information:
   • Courier: ${webhookData.courier_name || "N/A"}
   • Last Location: ${lastLocation}

📅 Timeline:
   • AWB Assigned: ${webhookData.awb_assigned_date || "N/A"}
   • Delivered: ${webhookData.delivered_date || "N/A"}

═══════════════════════════════════════

Thank you for using our delivery service!
    `.trim();
  }

  /**
   * Default email template
   */
  generateDefaultTemplate(webhookData) {
    const lastLocation = this.getLastScanLocation(webhookData.scans);

    return `
Shipment Delivery Notification

AWB: ${webhookData.awb}
Order ID: ${webhookData.order_id}
Status: ${webhookData.shipment_status}
Courier: ${webhookData.courier_name || "N/A"}
Delivered Date: ${webhookData.delivered_date || "N/A"}
Last Location: ${lastLocation}
    `.trim();
  }

  /**
   * Generate email content based on template type
   */
  generateContent(templateType, webhookData) {
    try {
      switch (templateType) {
        case "client1":
          return this.generateClient1Template(webhookData);
        case "client2":
          return this.generateClient2Template(webhookData);
        default:
          logger.warn(
            `Unknown template type: ${templateType}. Using default template.`
          );
          return this.generateDefaultTemplate(webhookData);
      }
    } catch (error) {
      logger.error("Error generating email template:", error);
      return this.generateDefaultTemplate(webhookData);
    }
  }
}

module.exports = new EmailTemplates();

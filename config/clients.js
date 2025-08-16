// Client configurations for different webhook endpoints
module.exports = {
  1: {
    name: "Client One",
    resend: {
      apiKey: process.env.CLIENT_1_RESEND_API_KEY,
      from: process.env.CLIENT_1_EMAIL_FROM || "noreply@client1.com",
      to: process.env.CLIENT_1_EMAIL_TO
        ? process.env.CLIENT_1_EMAIL_TO.split(",")
        : ["admin@client1.com"],
      template: {
        subject: "{{awb}} - {{courier_name}} - Shipment Delivered - ShippingDL",
        includeHtml: true,
      },
    },
    emailTemplate: "client1",
  },

  2: {
    name: "Client Two",
    resend: {
      apiKey: process.env.CLIENT_2_RESEND_API_KEY,
      from: process.env.CLIENT_2_EMAIL_FROM || "notifications@client2.com",
      to: process.env.CLIENT_2_EMAIL_TO
        ? process.env.CLIENT_2_EMAIL_TO.split(",")
        : ["support@client2.com"],
      template: {
        subject: "Delivery Notification - Client 2 - AWB: {{awb}}",
        includeHtml: true,
      },
    },
    emailTemplate: "client2",
  },
};

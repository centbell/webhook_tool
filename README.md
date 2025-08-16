# Multi-Client Shipment Webhook API

A modular Node.js Express API that handles incoming shipment webhooks for multiple clients and sends customized email notifications using Resend when shipments are delivered.

## Features

- **Multi-Client Support**: Handle webhooks for different clients with separate configurations
- **Modular Architecture**: Organized in folders (config, controllers, routes, middleware, utils)
- **Custom Email Templates**: Different email formats for each client
- **Rate Limiting**: Protection against abuse with configurable limits
- **Comprehensive Logging**: File and console logging with different levels
- **Input Validation**: Webhook payload validation middleware
- **Error Handling**: Global error handling with detailed logging
- **Health Monitoring**: Health check endpoints and client status

## Project Structure

```
├── config/           # Configuration files
│   ├── app.js       # Application settings
│   ├── clients.js   # Client-specific configurations
│   └── database.js  # Database configuration (future use)
├── controllers/      # Request handlers
│   ├── webhookController.js
│   └── healthController.js
├── middleware/       # Express middleware
│   ├── validateWebhook.js
│   ├── rateLimiter.js
│   └── errorHandler.js
├── routes/          # Route definitions
│   ├── index.js
│   ├── webhook.js
│   └── health.js
├── utils/           # Utility functions
│   ├── emailService.js
│   ├── emailTemplates.js
│   ├── logger.js
│   └── helpers.js
├── logs/            # Log files
├── data/            # Data storage (future use)
└── db/              # Database files (future use)
```

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your actual values:
   - `CLIENT_1_RESEND_API_KEY`: Resend API key for client 1
   - `CLIENT_1_EMAIL_FROM`: Sender email for client 1
   - `CLIENT_1_EMAIL_TO`: Recipient emails for client 1
   - `CLIENT_2_RESEND_API_KEY`: Resend API key for client 2
   - `CLIENT_2_EMAIL_FROM`: Sender email for client 2
   - `CLIENT_2_EMAIL_TO`: Recipient emails for client 2

3. **Start the Server**
   ```bash
   npm start
   ```

## API Endpoints

### POST /webhook/:clientId/shipment
Accepts shipment webhook data for a specific client and sends email if status is "DELIVERED".

**Supported Client IDs**: 1, 2 (configurable in `config/clients.js`)

**Example Request:**
```json
{
  "shipment_status": "DELIVERED",
  "awb": "EXPR1234567890",
  "courier_name": "Express Logistics Ground_Standard",
  "order_id": "ORD456789",
  "delivered_date": "2024-03-18T15:45:30Z",
  "awb_assigned_date": "2024-03-15T09:30:15Z",
  "scans": {
    "0": {
      "location": "NYC_USAInCity",
      "date": "2024-03-15 09:30:45"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed and email sent successfully",
  "emailId": "email-id-from-resend"
}
```

### GET /webhook/:clientId/status
Get webhook status for a specific client.

### GET /health
Health check endpoint.

### GET /health/clients
List all configured clients and their webhook URLs.

### GET /
Root endpoint with API information.

## Email Templates

### Client 1 Template (Standard Format)
```
Status : DELIVERED

AWB : EXPR1234567890

Courier : Express Logistics Ground_Standard

---------------------------------------

Order ID : ORD456789

Shipment Status : DELIVERED

---------------------------------------

AWB Assigned Date : 2024-03-15T09:30:15Z

Delivered Date : 2024-03-18T15:45:30Z

Last scans Location : LAXLogisticsCenterODH_LAX LOS ANGELES
```

### Client 2 Template (Enhanced Format)
```
🚚 DELIVERY NOTIFICATION - CLIENT 2

═══════════════════════════════════════

📦 Package Details:
   • AWB Number: EXPR1234567890
   • Order ID: ORD456789
   • Status: DELIVERED

🚛 Courier Information:
   • Courier: Express Logistics Ground_Standard
   • Last Location: LAXLogisticsCenterODH_LAX LOS ANGELES

📅 Timeline:
   • AWB Assigned: 2024-03-15T09:30:15Z
   • Delivered: 2024-03-18T15:45:30Z

═══════════════════════════════════════

Thank you for using our delivery service!
```

## Client Configuration

Add new clients in `config/clients.js`:

```javascript
module.exports = {
  3: {
    name: 'Client Three',
    resend: {
      apiKey: process.env.CLIENT_3_RESEND_API_KEY,
      from: process.env.CLIENT_3_EMAIL_FROM,
      to: process.env.CLIENT_3_EMAIL_TO.split(','),
      template: {
        subject: 'Custom Subject - AWB: {{awb}}',
        includeHtml: true
      }
    },
    emailTemplate: 'client3'
  }
};
```

Then create the corresponding email template in `utils/emailTemplates.js`.

## Logging

Logs are written to both console and file (`logs/app.log` by default). Log levels:
- `info`: General information
- `warn`: Warning messages
- `error`: Error messages
- `debug`: Debug information (only in debug mode)

## Rate Limiting

Default rate limiting: 100 requests per 15 minutes per IP address.
Configure in `config/app.js`:

```javascript
rateLimit: {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}
```

## Testing

### Test Client 1 Webhook
```bash
curl -X POST http://localhost:3000/webhook/1/shipment \
  -H "Content-Type: application/json" \
  -d '{
    "shipment_status": "DELIVERED",
    "awb": "TEST123456",
    "courier_name": "Test Courier",
    "order_id": "TEST-ORDER-1",
    "delivered_date": "2024-03-18T15:45:30Z",
    "awb_assigned_date": "2024-03-15T09:30:15Z",
    "scans": {
      "0": {
        "location": "Test Location",
        "date": "2024-03-15 09:30:45"
      }
    }
  }'
```

### Test Client 2 Webhook
```bash
curl -X POST http://localhost:3000/webhook/2/shipment \
  -H "Content-Type: application/json" \
  -d '{
    "shipment_status": "DELIVERED",
    "awb": "TEST789012",
    "courier_name": "Test Courier 2",
    "order_id": "TEST-ORDER-2",
    "delivered_date": "2024-03-18T15:45:30Z",
    "awb_assigned_date": "2024-03-15T09:30:15Z",
    "scans": {
      "0": {
        "location": "Test Location 2",
        "date": "2024-03-15 09:30:45"
      }
    }
  }'
```

### Get Client Status
```bash
curl http://localhost:3000/webhook/1/status
```

### List All Clients
```bash
curl http://localhost:3000/health/clients
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `CLIENT_1_RESEND_API_KEY` | Resend API key for client 1 | Yes | - |
| `CLIENT_1_EMAIL_FROM` | Sender email for client 1 | Yes | noreply@client1.com |
| `CLIENT_1_EMAIL_TO` | Recipient emails for client 1 | Yes | admin@client1.com |
| `CLIENT_2_RESEND_API_KEY` | Resend API key for client 2 | Yes | - |
| `CLIENT_2_EMAIL_FROM` | Sender email for client 2 | Yes | notifications@client2.com |
| `CLIENT_2_EMAIL_TO` | Recipient emails for client 2 | Yes | support@client2.com |
| `PORT` | Server port | No | 3000 |
| `LOG_LEVEL` | Logging level (info, warn, error, debug) | No | info |
| `LOG_FILE` | Log file path | No | logs/app.log |
| `NODE_ENV` | Environment mode | No | development |
| `CORS_ORIGIN` | CORS origin | No | * |

## Adding New Clients

1. **Add client configuration** in `config/clients.js`
2. **Add environment variables** for the new client in `.env`
3. **Create email template** in `utils/emailTemplates.js`
4. **Restart the server**

Example for Client 3:

```bash
# Add to .env
CLIENT_3_RESEND_API_KEY=your_client_3_api_key
CLIENT_3_EMAIL_FROM=noreply@client3.com
CLIENT_3_EMAIL_TO=admin@client3.com
```

## Error Handling

The API includes comprehensive error handling:

- **Validation Errors**: Invalid webhook payloads
- **Client Errors**: Invalid client IDs or configurations
- **Email Errors**: Resend API failures
- **Rate Limiting**: Too many requests
- **Server Errors**: Unexpected server issues

All errors are logged with detailed information and appropriate HTTP status codes are returned.

## Monitoring

- **Health Check**: `GET /health` - Server status and metrics
- **Client List**: `GET /health/clients` - All configured clients
- **Client Status**: `GET /webhook/:clientId/status` - Specific client status
- **Logs**: File-based logging with rotation support

## Future Enhancements

- Database integration for webhook history
- Email delivery status tracking
- Webhook retry mechanism
- Admin dashboard
- Metrics and analytics
- Email template editor

## Notes

- Only sends emails when `shipment_status` is exactly "DELIVERED"
- Each client can have different Resend API keys and email templates
- Rate limiting is applied per IP address across all clients
- All webhook payloads are validated before processing
- Comprehensive logging helps with debugging and monitoring
- Modular architecture makes it easy to add new features and clients


Email settings can be modified in `config/resend.config.js`:

- **from**: Sender email address
- **to**: Recipient email address(es)
- **template**: Email template settings
- **retry**: Retry configuration for failed emails

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `RESEND_API_KEY` | Your Resend API key | Yes | - |
| `EMAIL_FROM` | Sender email address | Yes | noreply@yourdomain.com |
| `EMAIL_TO` | Recipient email(s), comma-separated | Yes | admin@yourdomain.com |
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |

## Testing

You can test the webhook endpoint using curl:

```bash
curl -X POST http://localhost:3000/webhook/shipment \
  -H "Content-Type: application/json" \
  -d '{
    "shipment_status": "DELIVERED",
    "awb": "TEST123456",
    "courier_name": "Test Courier",
    "order_id": "TEST-ORDER",
    "delivered_date": "2024-03-18T15:45:30Z",
    "awb_assigned_date": "2024-03-15T09:30:15Z",
    "scans": {
      "0": {
        "location": "Test Location",
        "date": "2024-03-15 09:30:45"
      }
    }
  }'
```

## Notes

- Only sends emails when `shipment_status` is exactly "DELIVERED"
- Extracts the last scan location from the scans object
- Includes both plain text and HTML versions of the email
- Comprehensive error handling and logging
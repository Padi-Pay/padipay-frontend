# Setup Guide

This guide will walk you through setting up the WhatsApp Bot locally and testing webhooks.

## Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- ngrok (for local webhook testing)

## 1. Installation

Clone the repository and install the dependencies:
```bash
git clone https://github.com/Padi-Pay/padipay-frontend.git
cd padipay-frontend/whatsappbot
npm install
```

## 2. Environment Variables

Create a copy of the example environment file:
```bash
cp .env.example .env
```
Open `.env` and configure your variables. If you are just testing locally with a mock webhook, you can use placeholder values for the API keys.

## 3. Start the Development Server

Run the following command to start the Express server with nodemon (which will automatically restart the server on file changes):
```bash
npm run dev
```

## 4. Local Webhook Testing

To test your code, you need to simulate incoming POST requests that a WhatsApp provider would send.

**Using ngrok:**
1. Leave your Node server running.
2. Open a new terminal and expose your local port (assuming you are using port 3000):
   ```bash
   ngrok http 3000
   ```
3. Use a tool like Postman or `curl` to send a POST request to your ngrok URL. You can mock the exact JSON payload that Meta or Twilio sends to ensure your controller parses it correctly.

Example `curl` command (adjust payload based on the provider you are implementing):
```bash
curl -X POST https://<your-ngrok-id>.ngrok-free.app/ \
-H "Content-Type: application/json" \
-d '{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "changes": [
        {
          "value": {
            "messages": [
              {
                "from": "1234567890",
                "text": { "body": "Hello PadiPay" }
              }
            ]
          }
        }
      ]
    }
  ]
}'
```

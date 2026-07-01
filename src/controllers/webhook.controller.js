// TODO: Import the dialog service here to pass extracted messages to it
// const dialogService = require('../services/dialog.service');

/**
 * Handles the GET request for webhook verification.
 * 
 * TODO: 
 * 1. Extract the hub.mode, hub.verify_token, and hub.challenge from req.query.
 * 2. Check if the verify_token matches the one in your environment variables.
 * 3. If it matches, respond with 200 OK and the hub.challenge string.
 * 4. If it does not match, respond with 403 Forbidden.
 */
exports.verifyWebhook = async (req, res) => {
  // Implementation goes here
  res.status(200).send('Webhook verified');
};

/**
 * Handles the POST request when a new message or status update is received.
 * 
 * TODO:
 * 1. Validate the incoming request signature to ensure it's from the WhatsApp provider.
 * 2. Parse the req.body according to your provider's specific JSON payload structure (Meta or Twilio).
 * 3. Extract the sender's phone number and the raw text message.
 * 4. Pass the extracted phone number and message to dialogService.processUserInput().
 * 5. Return a 200 OK status immediately to acknowledge receipt and prevent the provider from retrying.
 */
exports.receiveMessage = async (req, res) => {
  // Implementation goes here
  res.status(200).send('EVENT_RECEIVED');
};

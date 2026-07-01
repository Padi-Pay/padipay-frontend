// TODO: Import the whatsapp service to send replies
// const whatsappService = require('./whatsapp.service');

// TODO: Import an HTTP client or SDK to communicate with the core Relayer API

/**
 * Processes incoming user messages, acts as the state machine, and triggers responses.
 * 
 * TODO:
 * 1. Check the user's conversational state (e.g., query Redis or the Relayer API to see if they are in an active flow like "Create Escrow").
 * 2. If they are in a flow, validate their input (e.g., parse the amount or recipient ID).
 * 3. If they are NOT in a flow, parse the message to determine their intent (e.g., "start", "help", "create").
 * 4. If the intent requires a business action (like creating an escrow or funding), make an HTTP request to the core Relayer API.
 * 5. Based on the outcome, construct the appropriate text response template.
 * 6. Finally, call whatsappService.sendMessage() to dispatch the response back to the user.
 * 
 * @param {string} phoneNumber - The user's phone number.
 * @param {string} incomingMessage - The raw text message sent by the user.
 */
exports.processUserInput = async (phoneNumber, incomingMessage) => {
  // Implementation goes here
};

const express = require('express');
const router = express.Router();

// TODO: Import the webhook controller (to be implemented in Phase 4)
// const webhookController = require('../controllers/webhook.controller');

/**
 * GET /
 * Used for webhook verification (e.g., Meta's hub challenge).
 */
router.get('/', (req, res) => {
  // TODO: Link this route to webhookController.verifyWebhook
  res.status(200).send('Webhook verification route scaffolded.');
});

/**
 * POST /
 * Entry point for all incoming WhatsApp messages and status updates.
 */
router.post('/', (req, res) => {
  // TODO: Link this route to webhookController.receiveMessage
  res.status(200).send('Webhook POST route scaffolded.');
});

module.exports = router;

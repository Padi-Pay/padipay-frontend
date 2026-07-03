require('dotenv').config();
const express = require('express');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/', webhookRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`WhatsApp Bot Gateway is running on port ${PORT}`);
});

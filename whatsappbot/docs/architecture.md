# PadiPay WhatsApp Bot Architecture

The PadiPay WhatsApp Bot provides the communication layer between WhatsApp users and the core PadiPay Relayer API. Its purpose is to receive incoming messages via webhooks, parse user intent, manage conversational state, communicate with the Relayer API to execute escrow actions, and dispatch appropriate text responses back to the user.

## System Overview

```text
+----------------------------------------------+
| WhatsApp Users                               |
| Wholesale pepper sellers, everyday traders   |
+----------------------+-----------------------+
                       |
+----------------------v-----------------------+
| Meta / Twilio WhatsApp API                   |
+----------------------+-----------------------+
                       |
+----------------------v-----------------------+
| WhatsApp Bot (This Directory)                |
| Webhook parsing, intent routing, state check |
+----------------------+-----------------------+
                       |
+----------------------v-----------------------+
| Relayer API (Core Business Logic)            |
| Escrow creation, funding, smart contracts    |
+----------------------------------------------+
```

## Technology Stack

- **Node.js** - Fast, asynchronous runtime ideal for I/O heavy webhook processing.
- **Express** - Lightweight web framework for handling incoming HTTP requests.
- **WhatsApp Business API (Meta/Twilio)** - The provider for dispatching and receiving WhatsApp messages.
- **dotenv** - Environment variable management.

## Public Webhook API

### `POST /`

Receives incoming messages and status updates from the WhatsApp provider.

Responsibilities:
- Validate the webhook payload signature.
- Extract the sender's phone number and message body.
- Pass the structured data to the Dialog Service.
- Acknowledge receipt to the provider (HTTP 200 OK) to prevent retries.

### `GET /`

Handles webhook verification during the initial setup with the WhatsApp provider (e.g., Meta's hub challenge).

Responsibilities:
- Verify the `hub.verify_token`.
- Return the `hub.challenge` string.

## Core Modules

### Webhook Controller: `src/controllers/webhook.controller.js`

The entry point for incoming data. It normalizes the payload across different providers (Meta vs. Twilio) so the rest of the application doesn't care where the message came from.

Key responsibilities:
- Extract `from` phone number and `text` content.
- Call the Dialog Service.

### Dialog Service: `src/services/dialog.service.js`

The "brain" of the chatbot interface. It acts as a state machine. 

Key responsibilities:
- Determine if the user is in an active flow (e.g., waiting to input an amount for an escrow).
- Parse the user's raw text to extract intents (e.g., "Create Escrow", "Check Balance").
- Construct the text template for the response.
- Coordinate with the Relayer API when a business action is required.

### WhatsApp Service: `src/services/whatsapp.service.js`

The outbound communication adapter.

Key responsibilities:
- Format the final HTTP payload required by Meta or Twilio.
- Dispatch the text message to the user's phone number.
- Handle rate limits and outbound message errors.

## Data Flow

### Receiving a Message

```text
User sends WhatsApp message
  |
  v
Provider POSTs to Webhook Controller
  |
  v
Controller extracts sender & text
  |
  v
Dialog Service parses intent
  |
  v
Dialog Service checks conversational state
  |
  v
Action requires core logic? --> Relayer API
  |
  v
Dialog Service templates the reply
  |
  v
WhatsApp Service dispatches HTTP request
  |
  v
User receives WhatsApp reply
```

## Design Patterns

- **Stateless Webhooks**: The gateway should avoid storing heavy state in-memory. Conversational state should ideally be fetched/persisted via a fast store (like Redis) or through the Relayer API.
- **Provider Agnosticism**: The controllers normalize the incoming payload so that switching from Twilio to Meta (or vice versa) only requires changes in the controller and the WhatsApp service, leaving the Dialog Service untouched.
- **Separation of Concerns**: Routing, parsing, business orchestration, and outbound dispatch are strictly isolated.

## Testing Strategy

- Unit tests for intent parsing and dialog state transitions.
- Mocking the WhatsApp API to ensure the `whatsapp.service.js` formats payloads correctly.
- Integration tests simulating incoming webhook payloads to verify the entire flow from Controller -> Dialog -> Service.

## Project Organization

```text
whatsappbot/
|-- src/
|   |-- app.js
|   |-- routes/
|   |   `-- webhook.routes.js
|   |-- controllers/
|   |   `-- webhook.controller.js
|   `-- services/
|       |-- dialog.service.js
|       `-- whatsapp.service.js
|-- docs/
|   |-- architecture.md
|   |-- contributing.md
|   `-- setup-guide.md
|-- .env.example
|-- .gitignore
|-- package.json
`-- README.md
```

## Future Architecture Considerations

- Integration with Redis for faster conversational state management.
- Multi-language support for dialog templates (e.g., English, Pidgin, Hausa, Yoruba).
- Rich media support (sending images/receipts).
- Rate limiting and abuse prevention at the gateway level.

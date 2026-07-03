# PadiPay WhatsApp Bot Gateway

Welcome to the **PadiPay WhatsApp Bot Gateway** repository! 

## About PadiPay
PadiPay is a decentralized, Web2.5 escrow service designed to empower everyday traders—like the hardworking wholesale pepper sellers at Mile 12 Market in Lagos—by providing them with secure, transparent, and easy-to-use escrow transactions directly from their mobile phones.

## Purpose of this Directory
This directory contains the Node.js/Express application that serves as the **WhatsApp Bot Gateway**.

```text
  [ User Messages ]
         |
         v
+-------------------+      (Parse Intent)       +-------------------+
|   Webhook Inbox   | ------------------------> |  Dialog Service   |
+-------------------+                           +-------------------+
         ^                                                |
         |                                         (Action Decided)
         |                                                |
         |                                                v
+-------------------+                           +-------------------+
| WhatsApp Service  | <------------------------ | Escrow Controller |
| (Send Reply Text) |     (Forward Status)      | (Calls Relayer)   |
+-------------------+                           +-------------------+
```

Its main responsibilities are:
- Receiving incoming webhooks (messages) from our WhatsApp provider (Meta/Twilio).
- Parsing user intents via the Dialog Service.
- Communicating with the core PadiPay Relayer API to process escrow actions.
- Dispatching text responses back to the user on WhatsApp.

> **Note:** This service acts as the communication layer and state machine for the chat interface. Core business logic and blockchain interactions are handled by the Relayer API.

## Documentation

For detailed information on how this gateway works, how to set it up, and how to contribute, please refer to our documentation hub:

- [Architecture & Data Flow](./docs/architecture.md) - Understand the system flow and components.
- [Setup Guide](./docs/setup-guide.md) - Learn how to set up the project locally and test webhooks.
- [Contributing Guidelines](./docs/contributing.md) - Rules and instructions for contributing to this specific repository.

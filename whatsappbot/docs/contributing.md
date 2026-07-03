# Contributing Guidelines

Thank you for your interest in contributing to PadiPay! 

## Scope of this Repository

**IMPORTANT:** This repository is strictly for the **WhatsApp Bot Gateway**. 
Do not attempt to implement core escrow logic, smart contract interactions, or blockchain state management here. All core business logic belongs in the main Relayer API repository. This gateway should only handle sending/receiving WhatsApp messages and managing conversational state.

## Rules for Contributors

1. **Clear Commit Messages**: Use conventional commits (e.g., `feat: added dialog parsing`, `fix: webhook validation issue`, `docs: update setup guide`).
2. **Descriptive PRs**: When opening a Pull Request, clearly describe what you have implemented and link to any relevant issues.
3. **Follow TODOs**: We have left descriptive `TODO:` comments in the codebase. Please read them carefully, as they explain exactly what needs to be implemented. Do not use tags like `#1 Trivial` or `#2 Medium` when resolving or adding TODOs. Just follow the instructions or write clear text.

## Running the Project Locally

Because this project relies on receiving webhooks from the internet, you will need a way to expose your local server. We recommend using **ngrok**.

1. Start your local server: `npm run dev` (runs on the port specified in `.env`, usually 3000).
2. Start ngrok in a new terminal: `ngrok http 3000`.
3. Copy the secure `https` URL provided by ngrok.
4. Use this URL in your WhatsApp API provider's webhook configuration settings.

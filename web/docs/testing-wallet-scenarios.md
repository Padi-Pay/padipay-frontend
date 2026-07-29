# Testing Wallet Scenarios & Mocking Workflows

This document serves as the guide for testing the embedded wallet client experience. It explains the testing tools, Mock Service Worker (MSW) setup, how components are rendered, and how to verify client validation rules locally.

---

## 1. Testing Framework Stack

The testing structure leverages:
1. **Vitest:** A fast, native Next.js/Vite testing tool.
2. **React Testing Library:** Renders components in a jsdom environment.
3. **user-event:** Simulates realistic browser interactions (clicks, keyboard inputs, focus states).
4. **Mock Service Worker (MSW):** Intercepts network queries at the fetch/axios layer, returning mock responses.

---

## 2. API Mocking with MSW

To avoid hitting real Horizon networks or local APIs during unit testing, all endpoints are mocked.

### Intercepting with MSW
In `tests/setup.ts`, a global mock server is initialized. Inside our test file `tests/wallet.test.tsx`, we override endpoints on a per-test basis using:
```typescript
import { server } from "./setup";
import { http, HttpResponse } from "msw";

// Mocking GET Wallet Details
server.use(
  http.get("*/api/wallets/me", () => {
    return HttpResponse.json({
      address: "GC3O2B2XUHRT5S3H6K3L4X4D2QW7O2M3E2J7X7O2R2T2A2B2V2W2Y2Q2",
      balance: 1450.75,
    });
  })
);
```

---

## 3. Test Scenarios Outline

We have implemented automatic checks covering four core areas:

### A. Data Fetching and Renders
* **Scenario:** The page is loaded by a user.
* **Expected Result:** A skeleton pulsing animation is visible while `isLoading` matches `true`. Once MSW intercepts and returns the payload, the balance formats as `$1,450.75` and the truncated address badge `GC3O2B...Y2Q2` is displayed.

### B. Network Failure Resilience
* **Scenario:** The backend calls return a 5xx error or offline state.
* **Expected Result:** The `useWallet` hook returns an error. The container rendering logic catches this, rendering a warning banner indicating degraded sync with the Stellar blockchain.

### C. Faucet Funding Simulation
* **Scenario:** User opens the deposit intent modal, clicking "Request Testnet USDC".
* **Expected Result:**
  1. Activates state spinner, showing "Communicating with Faucet...".
  2. Issues POST query `/api/wallets/fund`.
  3. Receives success response, closing the modal.
  4. Triggers SWR `mutate()` checking fresh balance immediately.

### D. Withdrawal Controls & Validators
* **Scenario:** A user initiates an external withdrawal.
* **Constraint Rules Checked:**
  - **No inputs:** Throws field requirement errors.
  - **Malformed address:** Any address not matching `^G[a-zA-Z0-9]{55}$` triggers length or character warnings.
  - **Overdraft check:** Entering a value greater than the available balance displays "Insufficient balance. Available is $X".
  - **Successful submit:** Triggers POST with destination and amount, toasts success, runs mutate, and resets form inputs.

---

## 4. Running the Tests Locally

Execute the test suites via:
```bash
# Run all tests
npm run test

# Run tests in watch mode
npx vitest

# Run a specific test file
npx vitest web/tests/wallet.test.tsx
```

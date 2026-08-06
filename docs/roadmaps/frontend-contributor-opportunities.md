# Frontend Contributor Opportunities

This document serves as the canonical backlog for future open-source contributors to the PadiPay frontend repository. It identifies meaningful, self-contained areas where contributors can add value without requiring sweeping architectural rewrites.

Each opportunity is designed to be converted directly into a GitHub Issue. 

---

## Wallet

### Implement Wallet Transaction History UI
**Category:** Feature
**Why it matters:** Users need visibility into their historical deposits, withdrawals, and escrow locks. The UI is currently constrained by the lack of a backend endpoint. Once the Relayer API exposes a canonical `/transactions` endpoint, the frontend needs a robust table to display this data.
**Suggested GitHub labels:** `good first issue`, `frontend`, `wallet`
**Estimated difficulty:** Medium
**Dependencies:** Relayer API must implement `GET /api/wallets/me/transactions`
**Expected files/modules:** `web/app/dashboard/wallet/page.tsx`, `web/components/TransactionTable.tsx`
**Acceptance criteria:**
- Fetch data from the new endpoint and display it in a paginated table.
- Filter transactions by type (deposit, withdrawal, escrow).
- Handle empty states and loading skeletons gracefully.
**Why this should remain future work:** We strictly avoid conflating escrow records with wallet transactions. This feature is blocked until the backend provides the correct domain data.

---

## Authentication

### Re-enable and Stabilize Google OAuth
**Category:** Authentication
**Why it matters:** Frictionless onboarding is critical for conversion. Google Auth was temporarily disabled in the UI to prioritize core email/password flow stability.
**Suggested GitHub labels:** `help wanted`, `auth`
**Estimated difficulty:** Medium
**Dependencies:** Validation of the backend OAuth provider flow.
**Expected files/modules:** `web/app/login/page.tsx`, `web/app/register/page.tsx`, `web/lib/api/auth.ts`
**Acceptance criteria:**
- Uncomment the `GoogleSignInButton` components.
- Ensure the OAuth redirect flow correctly captures the session token and updates the application state.
- Gracefully handle edge cases (e.g., user denies permission, network failure).
**Why this should remain future work:** Prioritizing the core wallet and escrow integrations was necessary for Phase 2. OAuth requires end-to-end testing across different environments.

---

## Escrow Workflow

### Real-Time Escrow Status Synchronization
**Category:** Feature / UX
**Why it matters:** Escrows involve multiple on-chain states (PENDING, LOCKED, RELEASED, REFUNDED). Currently, the user must manually refresh or rely on simple polling to see state changes.
**Suggested GitHub labels:** `frontend`, `websockets`, `ux`
**Estimated difficulty:** Hard
**Dependencies:** Backend support for WebSockets or Server-Sent Events (SSE).
**Expected files/modules:** `web/app/dashboard/escrows/page.tsx`, `web/hooks/useEscrowSync.ts`
**Acceptance criteria:**
- Implement a WebSocket or SSE listener to receive real-time updates for active escrows.
- Update the UI optimistically or immediately when a status change is broadcast by the relayer.
**Why this should remain future work:** Implementing reliable real-time infrastructure introduces significant complexity and requires backend architectural changes that were out of scope for Phase 2.

---

## Observability

### Integrate Frontend Error Tracking (Sentry)
**Category:** Observability
**Why it matters:** Silent client-side failures in a financial application degrade user trust. We need visibility into runtime errors, API timeouts, and render crashes in production.
**Suggested GitHub labels:** `infrastructure`, `observability`
**Estimated difficulty:** Easy
**Dependencies:** Sentry (or equivalent) project setup.
**Expected files/modules:** `web/app/layout.tsx`, `web/lib/monitoring.ts`
**Acceptance criteria:**
- Integrate the Sentry Next.js SDK.
- Configure boundary catchers to log uncaught exceptions and API failures.
- Ensure source maps are uploaded during the CI build process.
- Mask sensitive user data (PII) before transmission.
**Why this should remain future work:** Establishing the monitoring infrastructure requires operational overhead and third-party SaaS configuration that does not impact the immediate functional correctness of the application.

---

## Testing

### Implement End-to-End (E2E) Testing Suite with Playwright
**Category:** Testing
**Why it matters:** Unit tests verify components, but E2E tests verify user journeys. Critical paths like login, funding a wallet, and creating an escrow must be tested holistically against a staging environment.
**Suggested GitHub labels:** `testing`, `qa`
**Estimated difficulty:** Hard
**Dependencies:** None.
**Expected files/modules:** `web/tests/e2e/`, `playwright.config.ts`
**Acceptance criteria:**
- Set up Playwright in the frontend repository.
- Write a test covering the complete user registration and login flow.
- Write a test verifying the wallet funding and withdrawal UI interactions.
- Integrate the Playwright test suite into the GitHub Actions CI pipeline.
**Why this should remain future work:** E2E testing introduces substantial CI build time and requires a stable, predictable staging backend to avoid flaky tests. It is better suited as a dedicated post-integration effort.

---

## Accessibility (a11y)

### Complete Accessibility Audit and Remediation
**Category:** Accessibility
**Why it matters:** Financial tools must be accessible to all users. The current UI relies on Radix UI primitives which provide a good baseline, but custom components lack complete ARIA coverage and keyboard navigation support.
**Suggested GitHub labels:** `a11y`, `ux`
**Estimated difficulty:** Medium
**Dependencies:** None.
**Expected files/modules:** Various components in `web/components/ui/`
**Acceptance criteria:**
- Audit the application using Axe or Lighthouse a11y tools.
- Ensure all interactive elements are fully keyboard navigable.
- Add missing `aria-labels` and ensure appropriate contrast ratios across both light and dark modes.
**Why this should remain future work:** A11y remediation is a cross-cutting concern that is best tackled incrementally by contributors focusing specifically on UX and compliance.

---

## Developer Experience

### Consolidate API Client Types with Backend OpenAPI Spec
**Category:** DX / Typescript
**Why it matters:** Currently, the frontend manually defines TypeScript interfaces for API responses. If the backend schema changes, the frontend types can fall out of sync, leading to runtime errors.
**Suggested GitHub labels:** `typescript`, `dx`, `tooling`
**Estimated difficulty:** Medium
**Dependencies:** Relayer API must expose an OpenAPI v3 specification.
**Expected files/modules:** `web/lib/api/types.ts`, `package.json`
**Acceptance criteria:**
- Integrate a tool like `openapi-typescript` to auto-generate types from the backend spec.
- Replace manually defined API types (e.g., `WalletResponse`, `EscrowIntent`) with the generated types.
- Add a script to easily refresh the types locally.
**Why this should remain future work:** This requires the backend to finalize and publish its OpenAPI specification, which was defined as a separate, parallel effort.

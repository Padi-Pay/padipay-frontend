# Core Infrastructure Architecture

This document serves as the authoritative reference for the PadiPay frontend core infrastructure. It covers API communication, global state, error handling, and testing strategies.

## 1. Networking Rules

All future contributions must adhere to these rules to maintain consistency, security, and resilience:
- **Never create a new axios instance.** Always use the centralized `apiClient`.
- **Never call the backend directly from components using raw `fetch`** (unless inside Next.js Server Components that require specific caching behaviors).
- **Do not duplicate authentication logic.** Token injection and session management are handled globally by the `apiClient`.

## 2. API Client

**Location:** `src/lib/apiClient.ts`

The `apiClient` is a pre-configured Axios instance responsible for all client-to-server communication. It provides a robust networking layer that abstracts away authentication and resilience logic from individual UI components.

- **Timeout Configuration:** Requests timeout automatically after 15 seconds to prevent hanging UI states.
- **Request Flow & Authentication Injection:** An interceptor automatically reads the current authentication token from the Zustand global store (`useGlobalStore.getState().token`) and injects it as a `Bearer` token into the `Authorization` header of every outbound request.
- **Response Flow & 401 Handling:** A response interceptor watches for `401 Unauthorized` responses. If a 401 is detected, it marks the session as expired in the global store, clears the token and user profile, and lets the app-level session observer toast the user and redirect them to `/login` with a preserved return URL.
- **Retry Strategy:** Idempotent requests (`GET`) that fail due to network errors or `5xx` server errors are automatically retried up to 3 times. An exponential backoff strategy is applied between retries (500ms, 1000ms, 2000ms). `POST`, `PUT`, `PATCH`, and `DELETE` requests are never retried automatically to avoid unintended side effects.

## 3. Global State

**Location:** `src/store/globalStore.ts`

Global application state is managed using **Zustand**. The store is divided into logical slices for maintainability.

- **Store Structure:**
  - **Auth Slice:** Manages `token`, `isAuthenticated`, `login`, and `logout`.
  - **User Slice:** Manages the authenticated user's `profile`.
- **Persistence & Hydration:** The store leverages Zustand's `persist` middleware to save state to the browser's `localStorage` (`auth-storage`).
- **State Segregation:** The `partialize` configuration dictates exactly what state is persisted. Currently, only `token`, `isAuthenticated`, and `profile` are saved. Transient state (such as UI toggles or temporary loading indicators) should never be added to the `partialize` return object.
- **Logout Flow:** Invoking the `logout` action synchronously wipes the token, authentication status, session-expired flag, and user profile from memory, which immediately cascades to the persisted `localStorage` to ensure no stale authentication data remains.

## 4. Authentication Flow

The authentication lifecycle is managed through a combination of the global store and the API client:
- **Login Flow:** After a successful credential exchange, `login(token)` is called, storing the token and setting `isAuthenticated: true`. This immediately hydrates `localStorage`.
- **Token Persistence:** The token remains in `localStorage` across page reloads, ensuring the user remains logged in.
- **Automatic Logout:** If a token expires or is invalidated by the server, any subsequent API request will return a `401 Unauthorized`. The `apiClient` detects this, marks the session as expired, and the app shell handles the redirect and toast notification centrally.
- **Redirect Behavior:** Upon automatic logout, the user is redirected to `/login` and shown a toast explaining that the session expired.

## 5. `useApi` Hook

**Location:** `src/hooks/useApi.ts`

The `useApi` hook is the standard React abstraction for triggering API calls from Client Components.

- **Intended Usage:** Wraps the `apiClient` to provide React-friendly state for asynchronous operations.
- **Returned Values:** Returns `isLoading` (boolean), `data` (the typed payload), `error` (the error object), and the `request` function to trigger the call.
- **Loading Lifecycle:** `isLoading` is set to `true` when the request begins and `false` when it settles (either success or failure). 
- **Success Lifecycle:** On success, `data` is populated and `error` is cleared.
- **Error Lifecycle:** On failure, the error is caught. If it is a known Axios network error, a global toast notification (`sonner`) is displayed to the user automatically (unless `showToastOnError` is explicitly set to `false`). `401` responses are excluded from this generic toast path so the session-expiry UX can handle them once, centrally. The `error` state is then populated.
- **Best Practices:**
  - The hook internally utilizes an `isMounted` ref. If a component unmounts while a request is in-flight, it safely prevents state updates to avoid React memory leak warnings.
  - Unexpected runtime errors bypass the local `error` state and are intentionally thrown during the render cycle so they can be caught by Error Boundaries.
  - By passing `throwOnError: true` to the options, developers can force standard API errors to also trigger React Error Boundaries.

## 6. Error Handling

**Location:** `src/components/error/`

The frontend relies on two distinct React Error Boundaries. **Note:** React Error Boundaries inherently only catch errors thrown during the render phase or lifecycle methods. They *do not* catch asynchronous errors natively (hence the `throwOnError` integration in `useApi`).

- **GlobalErrorBoundary:** Wraps the entire application layout. It acts as the final safety net for any uncaught rendering or runtime errors, displaying a full-page fallback UI with a "Refresh Page" button.
- **ApiErrorBoundary:** Intended to wrap specific data-heavy sections of the UI. If a child component fails to render due to corrupted API data (or if `useApi` is configured with `throwOnError: true`), this boundary catches the error and displays a localized "Try Again" fallback UI, preventing the entire page from crashing.

## 7. Testing Strategy

**Location:** `tests/`

The core infrastructure is fully tested using **Vitest**, **Mock Service Worker (MSW)**, and **React Testing Library**.

- **API Testing:** MSW intercepts outgoing requests from the `apiClient`, allowing us to simulate 5xx errors (to test backoff/retries), 401 responses (to test logout), and success states.
- **State Tests:** Zustand tests verify that calling `login` correctly populates the state and that `partialize` correctly persists data to `localStorage`.
- **Error Boundary Tests:** Verify that throwing errors within children correctly triggers the fallback UI.
- **Extending the Suite:** Future contributors should mock endpoints in `tests/setup.ts` using MSW. New hooks should be tested using `@testing-library/react`'s `renderHook` and wrapped in `act()` when triggering state changes.

## 8. Contributor Guidance

- **How to add a new API endpoint:** Do not modify the `apiClient`. Simply import it and pass your endpoint (e.g., `apiClient.get('/users')`). 
- **How to create a new API hook:** Use the `useApi` hook inside your components. Do not write custom `fetch` or `axios` wrappers.
  ```typescript
  const { request, data, isLoading } = useApi<MyResponseType>();
  ```
- **How to add new state to the global store:** Update the `GlobalState` interface in `globalStore.ts`, add the default values to the store creation logic, and ensure the new state is added to the `partialize` function *only* if it needs to persist across reloads.
- **Where new infrastructure code belongs:** 
  - Global providers: `src/components/providers/`
  - Global error boundaries: `src/components/error/`
  - Custom hooks: `src/hooks/`
  - Core utilities (like axios): `src/lib/`

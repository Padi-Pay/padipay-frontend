/**
 * Content Security Policy (CSP) utilities.
 *
 * Centralises every CSP directive so the policy is auditable from a single
 * file.  The nonce generator uses the Web Crypto API which is available in
 * both Node ≥ 19 and Edge runtimes (Vercel, Cloudflare Workers).
 */

// ---------------------------------------------------------------------------
// Nonce generation
// ---------------------------------------------------------------------------

/**
 * Generate a cryptographically secure, base64-encoded nonce.
 *
 * The returned string is safe for embedding directly inside a
 * `'nonce-<value>'` CSP directive and the corresponding HTML attribute.
 */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Convert to base64 — `btoa` accepts a "binary string".
  const binaryString = Array.from(bytes, (b) => String.fromCharCode(b)).join(
    '',
  );
  return btoa(binaryString);
}

// ---------------------------------------------------------------------------
// CSP directive builder
// ---------------------------------------------------------------------------

/**
 * Build the full Content-Security-Policy header value for a given nonce.
 *
 * Whitelisted origins:
 *  - Google Identity Services  (script-src, frame-src)
 *  - Google Fonts              (style-src, font-src)
 *  - Google profile avatars    (img-src)
 *  - PadiPay Relayer API       (connect-src)
 *  - Stellar Horizon nodes     (connect-src)
 *  - Sentry telemetry ingest   (connect-src)
 */
export function buildCspHeader(nonce: string): string {
  const directives: Record<string, string> = {
    'default-src': "'self'",
    'script-src': `'self' 'unsafe-eval' 'nonce-${nonce}' https://accounts.google.com`,
    'connect-src': [
      "'self'",
      'https://api.padipay.com',
      'https://horizon.stellar.org',
      'https://horizon-testnet.stellar.org',
      'https://*.ingest.sentry.io',
    ].join(' '),
    'frame-src': "'self' https://accounts.google.com",
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
    'font-src': "'self' https://fonts.gstatic.com",
    'img-src': "'self' data: blob: https://lh3.googleusercontent.com",
    'object-src': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'",
    'frame-ancestors': "'none'",
    'upgrade-insecure-requests': '',
  };

  return Object.entries(directives)
    .map(([key, value]) => (value ? `${key} ${value}` : key))
    .join('; ');
}

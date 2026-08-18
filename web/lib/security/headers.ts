/**
 * Static HTTP security headers.
 *
 * These headers are applied to every response by the Next.js middleware.
 * They complement the dynamic Content-Security-Policy header which is
 * generated separately (see `csp.ts`).
 */

export const securityHeaders: Record<string, string> = {
  /**
   * Prevent the page from being rendered inside an <iframe> on any origin.
   * Mitigates clickjacking / UI-redressing attacks.
   * Note: `frame-ancestors 'none'` in CSP supersedes this for modern browsers,
   * but we keep X-Frame-Options for backwards compatibility with older clients.
   */
  'X-Frame-Options': 'DENY',

  /**
   * Prevent MIME-type sniffing — the browser must honour the declared
   * Content-Type and never guess.  Stops attackers from disguising
   * executable payloads as benign file types.
   */
  'X-Content-Type-Options': 'nosniff',

  /**
   * Enforce HTTPS-only connections for 2 years, including all subdomains.
   * The `preload` flag declares intent to be added to browser HSTS preload
   * lists (see https://hstspreload.org).
   */
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',

  /**
   * Control how much referrer information the browser sends on navigations.
   * `strict-origin-when-cross-origin` sends the full URL for same-origin
   * requests but only the origin (no path) for cross-origin requests,
   * and nothing at all when downgrading from HTTPS → HTTP.
   */
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  /**
   * Explicitly disable access to powerful browser APIs that PadiPay does
   * not use.  Reduces the attack surface if a third-party script is ever
   * compromised.
   */
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), usb=(), bluetooth=(), payment=()',

  /**
   * Allow the browser to pre-resolve DNS for linked origins, improving
   * perceived performance for external resources (Google Fonts, Sentry, etc.).
   */
  'X-DNS-Prefetch-Control': 'on',
};

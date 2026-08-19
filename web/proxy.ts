import { NextRequest, NextResponse } from 'next/server';
import { generateNonce, buildCspHeader } from '@/lib/security/csp';
import { securityHeaders } from '@/lib/security/headers';

/**
 * Next.js Edge Proxy — Security Headers & CSP.
 *
 * Runs on every matching request to:
 *  1. Generate a fresh cryptographic nonce.
 *  2. Build a strict Content-Security-Policy with the nonce.
 *  3. Forward the nonce to downstream Server Components via a request header.
 *  4. Attach all static security headers to the response.
 *
 * In development the CSP is applied as `Content-Security-Policy-Report-Only`
 * so that HMR, React Fast Refresh, and error overlays are not blocked.
 */
export function proxy(request: NextRequest): NextResponse {
  const nonce = generateNonce();
  const cspHeaderValue = buildCspHeader(nonce);

  // -------------------------------------------------------------------
  // Forward the nonce to Server Components via a custom request header.
  // -------------------------------------------------------------------
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // -------------------------------------------------------------------
  // Build the response, passing modified request headers downstream.
  // -------------------------------------------------------------------
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // -------------------------------------------------------------------
  // CSP header — enforced in production, report-only in development.
  // -------------------------------------------------------------------
  const cspHeaderName =
    process.env.NODE_ENV === 'production'
      ? 'Content-Security-Policy'
      : 'Content-Security-Policy-Report-Only';

  response.headers.set(cspHeaderName, cspHeaderValue);

  // -------------------------------------------------------------------
  // Static security headers.
  // -------------------------------------------------------------------
  for (const [header, value] of Object.entries(securityHeaders)) {
    response.headers.set(header, value);
  }

  return response;
}

// ---------------------------------------------------------------------------
// Route matcher — skip static assets and Next.js internals.
// ---------------------------------------------------------------------------
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

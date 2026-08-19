import { describe, it, expect } from 'vitest';
import { generateNonce, buildCspHeader } from '@/lib/security/csp';

describe('generateNonce', () => {
  it('returns a base64 string of expected length', () => {
    const nonce = generateNonce();

    // 16 random bytes → 24 base64 characters (with padding).
    expect(nonce).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(nonce.length).toBe(24);
  });

  it('returns unique values on consecutive calls', () => {
    const a = generateNonce();
    const b = generateNonce();
    expect(a).not.toBe(b);
  });
});

describe('buildCspHeader', () => {
  const nonce = 'dGVzdG5vbmNlMTIzNDU2'; // deterministic test value
  const csp = buildCspHeader(nonce);

  it('includes the nonce in script-src', () => {
    expect(csp).toContain(`'nonce-${nonce}'`);
  });

  it('does not include unsafe-inline in script-src', () => {
    // Extract the script-src directive value.
    const scriptSrc = csp
      .split(';')
      .map((d) => d.trim())
      .find((d) => d.startsWith('script-src'));

    expect(scriptSrc).toBeDefined();
    expect(scriptSrc).not.toContain("'unsafe-inline'");
  });

  it('whitelists Google Identity Services in script-src and frame-src', () => {
    expect(csp).toContain('https://accounts.google.com');

    const frameSrc = csp
      .split(';')
      .map((d) => d.trim())
      .find((d) => d.startsWith('frame-src'));
    expect(frameSrc).toContain('https://accounts.google.com');
  });

  it('whitelists PadiPay API in connect-src', () => {
    expect(csp).toContain('https://api.padipay.com');
  });

  it('whitelists Stellar Horizon nodes in connect-src', () => {
    expect(csp).toContain('https://horizon.stellar.org');
    expect(csp).toContain('https://horizon-testnet.stellar.org');
  });

  it('whitelists Sentry ingest in connect-src', () => {
    expect(csp).toContain('https://*.ingest.sentry.io');
  });

  it('includes all required directives', () => {
    const requiredDirectives = [
      'default-src',
      'script-src',
      'connect-src',
      'frame-src',
      'style-src',
      'font-src',
      'img-src',
      'object-src',
      'base-uri',
      'form-action',
      'frame-ancestors',
      'upgrade-insecure-requests',
    ];

    for (const directive of requiredDirectives) {
      expect(csp).toContain(directive);
    }
  });

  it('sets default-src to self', () => {
    const defaultSrc = csp
      .split(';')
      .map((d) => d.trim())
      .find((d) => d.startsWith('default-src'));
    expect(defaultSrc).toBe("default-src 'self'");
  });

  it('blocks object embeds', () => {
    const objectSrc = csp
      .split(';')
      .map((d) => d.trim())
      .find((d) => d.startsWith('object-src'));
    expect(objectSrc).toBe("object-src 'none'");
  });

  it('blocks all frame ancestors', () => {
    const frameAncestors = csp
      .split(';')
      .map((d) => d.trim())
      .find((d) => d.startsWith('frame-ancestors'));
    expect(frameAncestors).toBe("frame-ancestors 'none'");
  });
});

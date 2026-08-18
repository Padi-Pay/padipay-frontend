import { describe, it, expect } from 'vitest';
import { securityHeaders } from '@/lib/security/headers';

describe('securityHeaders', () => {
  it('contains all required security headers', () => {
    const requiredHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Strict-Transport-Security',
      'Referrer-Policy',
      'Permissions-Policy',
      'X-DNS-Prefetch-Control',
    ];

    for (const header of requiredHeaders) {
      expect(securityHeaders).toHaveProperty(header);
    }
  });

  it('sets X-Frame-Options to DENY', () => {
    expect(securityHeaders['X-Frame-Options']).toBe('DENY');
  });

  it('sets X-Content-Type-Options to nosniff', () => {
    expect(securityHeaders['X-Content-Type-Options']).toBe('nosniff');
  });

  it('configures HSTS with max-age, includeSubDomains, and preload', () => {
    const hsts = securityHeaders['Strict-Transport-Security'];
    expect(hsts).toContain('max-age=63072000');
    expect(hsts).toContain('includeSubDomains');
    expect(hsts).toContain('preload');
  });

  it('sets Referrer-Policy to strict-origin-when-cross-origin', () => {
    expect(securityHeaders['Referrer-Policy']).toBe(
      'strict-origin-when-cross-origin',
    );
  });

  it('disables all specified browser APIs in Permissions-Policy', () => {
    const policy = securityHeaders['Permissions-Policy'];
    const disabledApis = [
      'camera',
      'microphone',
      'geolocation',
      'usb',
      'bluetooth',
      'payment',
    ];

    for (const api of disabledApis) {
      expect(policy).toContain(`${api}=()`);
    }
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from './setup';
import { apiClient } from '../src/lib/apiClient';
import { useGlobalStore } from '../src/store/globalStore';

describe('apiClient', () => {
  beforeEach(() => {
    useGlobalStore.setState({ token: null, isAuthenticated: false, profile: null });
    window.location.href = 'http://localhost/';
  });

  it('injects Authorization header if token exists', async () => {
    useGlobalStore.setState({ token: 'test-token', isAuthenticated: true, profile: null });
    
    let receivedAuth = '';
    server.use(
      http.get('*/test-auth', ({ request }) => {
        receivedAuth = request.headers.get('Authorization') || '';
        return HttpResponse.json({ success: true });
      })
    );

    await apiClient.get('http://localhost/test-auth');
    expect(receivedAuth).toBe('Bearer test-token');
  });

  it('handles 401 by clearing auth state and redirecting', async () => {
    useGlobalStore.setState({ token: 'test-token', isAuthenticated: true, profile: null });
    
    server.use(
      http.get('*/test-401', () => {
        return new HttpResponse(null, { status: 401 });
      })
    );

    await expect(apiClient.get('http://localhost/test-401')).rejects.toThrow();
    
    expect(useGlobalStore.getState().token).toBeNull();
    expect(window.location.href).toBe('/login?sessionExpired=true');
  });

  it('retries GET requests up to 3 times on 5xx errors with backoff', async () => {
    let callCount = 0;
    server.use(
      http.get('*/test-retry', () => {
        callCount++;
        return new HttpResponse(null, { status: 500 });
      })
    );

    const startTime = Date.now();
    await expect(apiClient.get('http://localhost/test-retry')).rejects.toThrow();
    const duration = Date.now() - startTime;
    
    // Initial call + 3 retries
    expect(callCount).toBe(4);
    // Backoff total should be around 500 + 1000 + 2000 = 3500ms
    expect(duration).toBeGreaterThanOrEqual(3000); // giving 500ms margin
  }, 10000);

  it('does not retry POST requests on 5xx', async () => {
    let callCount = 0;
    server.use(
      http.post('*/test-retry-post', () => {
        callCount++;
        return new HttpResponse(null, { status: 500 });
      })
    );

    await expect(apiClient.post('http://localhost/test-retry-post')).rejects.toThrow();
    expect(callCount).toBe(1); // Only the initial call
  });
});

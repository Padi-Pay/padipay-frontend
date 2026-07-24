import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useApi } from '../src/hooks/useApi';
import { server } from './setup';
import { http, HttpResponse } from 'msw';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: { error: vi.fn() }
}));

describe('useApi', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('manages async lifecycle properly on success', async () => {
    server.use(
      http.get('*/test-success', () => {
        return HttpResponse.json({ success: true });
      })
    );

    const { result } = renderHook(() => useApi());
    expect(result.current.isLoading).toBe(false);

    let promise: ReturnType<typeof result.current.request>;
    act(() => {
      promise = result.current.request({ url: 'http://localhost/test-success', method: 'GET' });
    });

    expect(result.current.isLoading).toBe(true);
    
    await act(async () => {
      await promise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual({ success: true });
    expect(result.current.error).toBeNull();
  });

  it('shows global toast on error', async () => {
    server.use(
      http.get('*/test-error', () => {
        return new HttpResponse(JSON.stringify({ message: 'Custom error' }), { status: 400 });
      })
    );

    const { result } = renderHook(() => useApi());
    
    await act(async () => {
      await result.current.request({ url: 'http://localhost/test-error', method: 'GET' });
    });

    expect(toast.error).toHaveBeenCalledWith('Error: Custom error');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).not.toBeNull();
  });
});

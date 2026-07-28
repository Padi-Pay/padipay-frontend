import { useState, useCallback, useRef, useEffect } from 'react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { apiClient } from '../lib/apiClient';
import { toast } from 'sonner';

interface UseApiOptions {
  showToastOnError?: boolean;
  throwOnError?: boolean;
}

export function useApi<T = unknown>() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | Error | null>(null);
  const [renderError, setRenderError] = useState<Error | null>(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (renderError) {
    throw renderError;
  }

  const request = useCallback(async (
    config: AxiosRequestConfig,
    options: UseApiOptions = { showToastOnError: true, throwOnError: false }
  ): Promise<{ data: T | null; error: AxiosError | Error | null }> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.request<T>(config);
      if (isMounted.current) {
        setData(response.data);
        setIsLoading(false);
      }
      return { data: response.data, error: null };
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      
      if (isMounted.current) {
        setError(err);
        setIsLoading(false);
      }

      if (axios.isAxiosError(e)) {
        const status = e.response?.status;

        if (options.showToastOnError && status !== 401) {
          const message = (e.response?.data as { message?: string })?.message || e.message || 'An unexpected error occurred';
          if (!e.response) {
            toast.error('Network error. Please check your connection.');
          } else {
            toast.error(`Error: ${message}`);
          }
        }
      }

      // To make React Error Boundaries effective for async operations, 
      // we must throw the error during the render cycle.
      if (options.throwOnError && isMounted.current && !(axios.isAxiosError(e) && e.response?.status === 401)) {
        setRenderError(err);
      } else if (!axios.isAxiosError(e) && isMounted.current) {
        // Unexpected runtime errors should always crash the tree (caught by GlobalErrorBoundary)
        setRenderError(err);
      }

      return { data: null, error: err };
    }
  }, []);

  return { request, isLoading, data, error };
}

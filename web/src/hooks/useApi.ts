import { useState, useCallback } from 'react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { apiClient } from '../lib/apiClient';
import { toast } from 'sonner';

interface UseApiOptions {
  showToastOnError?: boolean;
}

export function useApi<T = unknown>() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | Error | null>(null);

  const request = useCallback(async (
    config: AxiosRequestConfig,
    options: UseApiOptions = { showToastOnError: true }
  ): Promise<{ data: T | null; error: AxiosError | Error | null }> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.request<T>(config);
      setData(response.data);
      return { data: response.data, error: null };
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(e);
        if (options.showToastOnError) {
          const message = (e.response?.data as { message?: string })?.message || e.message || 'An unexpected error occurred';
          if (!e.response) {
            toast.error('Network error. Please check your connection.');
          } else {
            toast.error(`Error: ${message}`);
          }
        }
        return { data: null, error: e };
      }
      
      // Prevent unhandled promise rejections for expected errors, but throw unexpected runtime errors
      if (e instanceof Error) {
         setError(e);
      } else {
         setError(new Error(String(e)));
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { request, isLoading, data, error };
}

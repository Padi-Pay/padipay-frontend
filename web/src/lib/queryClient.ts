import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Default to 0 for financial data safety
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => {
        // Don't retry on 401s or 403s
        if (typeof error === 'object' && error !== null && 'response' in error) {
          const status = (error as AxiosError).response?.status;
          if (status === 401 || status === 403) return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      onError: (error) => {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || error.message || 'An error occurred';
        toast.error(`Error: ${message}`);
      },
    },
  },
});

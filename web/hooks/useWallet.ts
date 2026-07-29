import useSWR from 'swr';
import { apiClient } from '../src/lib/apiClient';

export interface WalletData {
  address: string;
  balance: number;
}

const fetcher = async (url: string) => {
  const response = await apiClient.get<WalletData>(url);
  return response.data;
};

/**
 * Hook to manage wallet state and balance.
 * Leverages SWR to cache data and automatically revalidate on window focus.
 */
export function useWallet() {
  const { data, error, isLoading, mutate } = useSWR<WalletData>(
    '/api/wallets/me',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2500,
      shouldRetryOnError: false,
    }
  );

  return {
    wallet: data,
    isLoading,
    error,
    mutate,
  };
}

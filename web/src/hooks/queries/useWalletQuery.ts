import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';

interface WalletBalanceResponse {
  success: boolean;
  message: string;
  data: {
    balance: string;
    asset: string;
  };
}

interface WalletInfoResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    publicKey: string;
    createdAt: string;
  };
}

export function useWalletBalance() {
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: async () => {
      const { data } = await apiClient.get<WalletBalanceResponse>('/api/wallets/me/balance');
      return data;
    },
    staleTime: 0, // Balance is financial data, always fetch fresh on mount/focus
  });
}

export function useWalletInfo() {
  return useQuery({
    queryKey: ['wallet', 'info'],
    queryFn: async () => {
      const { data } = await apiClient.get<WalletInfoResponse>('/api/wallets/me');
      return data;
    },
    staleTime: 1000 * 60 * 5, // Wallet public key rarely changes
  });
}

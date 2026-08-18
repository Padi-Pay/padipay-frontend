import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';

export interface Escrow {
  id: string;
  amount: string;
  asset: string | null;
  status: string;
  buyerAddress: string;
  sellerAddress: string;
  actionType?: string;
  createdAt: string;
}

interface EscrowsResponse {
  success: boolean;
  message: string;
  data: Escrow[];
}

interface EscrowDetailsResponse {
  success: boolean;
  message: string;
  data: Escrow;
}

export function useEscrows() {
  return useQuery({
    queryKey: ['escrows', 'list'],
    queryFn: async () => {
      const { data } = await apiClient.get<EscrowsResponse>('/api/accounts/me/escrows');
      return data;
    },
    staleTime: 0,
  });
}

export function useEscrowDetails(id: string) {
  return useQuery({
    queryKey: ['escrows', 'detail', id],
    queryFn: async () => {
      const { data } = await apiClient.get<EscrowDetailsResponse>(`/api/accounts/me/escrows/${id}`);
      return data;
    },
    staleTime: 0,
    refetchInterval: (query) => {
      const status = query.state?.data?.data?.status;
      // If status is PENDING (unfunded) or FUNDED (but not yet LOCKED/RESOLVED), we might want to poll
      // The issue says: "If an escrow's status === 'Funded', configure refetchInterval: 5000"
      // Assuming 'FUNDED' or 'PENDING' depending on backend representation. Let's poll for 'FUNDED' and 'PENDING'.
      // Actually, wait, "The polling must cease immediately when the status transitions to Locked or Resolved."
      if (status && ['LOCKED', 'RESOLVED', 'locked', 'resolved'].includes(status.toUpperCase())) {
        return false;
      }
      return 5000;
    },
  });
}

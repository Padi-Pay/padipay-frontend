import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';

interface FundEscrowPayload {
  walletAddress: string;
  amount: string;
  asset?: string;
  escrowId?: string; // We might need this to identify which escrow to fund
}

export function useFundEscrowMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FundEscrowPayload) => {
      const response = await apiClient.post('/api/relayer/submit-escrow', {
        actionType: 'FUND', // Explicitly using FUND actionType
        params: data,
      });
      return response.data;
    },
    onMutate: async (newFunding) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['wallet', 'balance'] });

      // Snapshot the previous value
      const previousBalance = queryClient.getQueryData(['wallet', 'balance']);

      // Optimistically update to the new value
      queryClient.setQueryData(['wallet', 'balance'], (old: { data?: { balance?: string } } | undefined) => {
        if (old && old.data && old.data.balance) {
          const currentBalance = parseFloat(old.data.balance);
          const fundAmount = parseFloat(newFunding.amount);
          
          return {
            ...old,
            data: {
              ...old.data,
              balance: (currentBalance - fundAmount).toString(),
            }
          };
        }
        return old;
      });

      // Return a context object with the snapshotted value
      return { previousBalance };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newFunding, context) => {
      if (context?.previousBalance) {
        queryClient.setQueryData(['wallet', 'balance'], context.previousBalance);
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['escrows'] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';
import { WithdrawalFormData } from '@/lib/validations/wallet.schema';

export function useWithdrawMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WithdrawalFormData) => {
      const response = await apiClient.post('/api/wallets/withdraw', data);
      return response.data;
    },
    onMutate: async (newWithdrawal) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['wallet', 'balance'] });

      // Snapshot the previous value
      const previousBalance = queryClient.getQueryData(['wallet', 'balance']);

      // Optimistically update to the new value
      queryClient.setQueryData(['wallet', 'balance'], (old: { data?: { balance?: string } } | undefined) => {
        if (old && old.data && old.data.balance) {
          const currentBalance = parseFloat(old.data.balance);
          const withdrawalAmount = parseFloat(newWithdrawal.amount);
          
          return {
            ...old,
            data: {
              ...old.data,
              balance: (currentBalance - withdrawalAmount).toString(),
            }
          };
        }
        return old;
      });

      // Return a context object with the snapshotted value
      return { previousBalance };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newWithdrawal, context) => {
      if (context?.previousBalance) {
        queryClient.setQueryData(['wallet', 'balance'], context.previousBalance);
      }
      // Error toast is handled globally in queryClient.ts, but we can add specific handling here if needed
    },
    // Always refetch after error or success to ensure data is in sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
    },
  });
}

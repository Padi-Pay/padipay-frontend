'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';
import { useWalletInfo } from '@/src/hooks/queries/useWalletQuery';
import { CreateEscrowWizard } from '@/src/components/escrows/CreateEscrowWizard';
import { type EscrowIntentFormData } from '@/lib/validations/escrow.schema';

export default function CreateEscrowPage() {
  const router = useRouter();
  const { data: walletData } = useWalletInfo();
  const buyerPublicKey = walletData?.data?.publicKey || null;

  const createEscrowMutation = useMutation({
    mutationFn: async (data: { actionType: string; params: Record<string, unknown> }) => {
      const response = await apiClient.post('/api/relayer/submit-escrow', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Escrow intent created successfully!');
      // Assuming backend returns the newly created escrow ID in data.data.id
      const newEscrowId = data?.data?.id;
      if (newEscrowId) {
        router.push(`/dashboard/escrows/${newEscrowId}`);
      } else {
        router.push('/dashboard/escrows');
      }
    },
  });

  const onSubmit = async (data: EscrowIntentFormData) => {
    if (!buyerPublicKey) {
      toast.error('Wallet not loaded. Please wait or refresh.');
      return;
    }

    await createEscrowMutation.mutateAsync({
      actionType: 'CREATE',
      params: {
        buyer: buyerPublicKey,
        seller: data.seller,
        amount: data.amount,
        description: data.description, // Added description field
      },
    });
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr] max-w-5xl mx-auto">
      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <CreateEscrowWizard
          buyerPublicKey={buyerPublicKey}
          onSubmit={onSubmit}
          isSubmitting={createEscrowMutation.isPending}
        />
      </div>

      <div className="hidden lg:block space-y-6">
        <div className="rounded-[1.75rem] border border-outline-variant/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(230,242,255,0.9))] p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
          <h2 className="text-xl font-bold text-foreground">Secure Escrows</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/70">
            PadiPay uses Soroban smart contracts to guarantee the safety of your funds. When you fund an escrow, the XLM is locked on-chain and can only be released when both parties fulfill the agreement terms.
          </p>
          <ul className="mt-5 space-y-3 text-sm text-foreground/70">
            <li className="flex gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>Create intent off-chain.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>Fund the escrow securely.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>Wait for the seller to deliver.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">4.</span>
              <span>Release funds.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

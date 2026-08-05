'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useApi } from '@/src/hooks/useApi';
import { escrowIntentSchema, type EscrowIntentFormData } from '@/lib/validations/escrow.schema';

interface WalletResponse {
  data: {
    publicKey: string;
  };
}

export default function CreateEscrowPage() {
  const router = useRouter();
  const { request: requestWallet } = useApi<WalletResponse>();
  const { request: submitEscrow, isLoading: isSubmitting } = useApi();
  const [buyerPublicKey, setBuyerPublicKey] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWallet() {
      const res = await requestWallet({ method: 'GET', url: '/api/wallets/me' });
      if (res.data?.data?.publicKey) {
        setBuyerPublicKey(res.data.data.publicKey);
      }
    }
    fetchWallet();
  }, [requestWallet]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EscrowIntentFormData>({
    resolver: zodResolver(escrowIntentSchema),
  });

  const onSubmit = async (data: EscrowIntentFormData) => {
    if (!buyerPublicKey) {
      toast.error('Wallet not loaded. Please wait or refresh.');
      return;
    }

    const res = await submitEscrow({
      method: 'POST',
      url: '/api/relayer/submit-escrow',
      data: {
        actionType: 'CREATE',
        params: {
          buyer: buyerPublicKey,
          seller: data.seller,
          amount: data.amount,
        },
      },
    });

    if (res.data) {
      toast.success('Escrow intent created successfully!');
      router.push('/dashboard/escrows');
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <h2 className="text-2xl font-bold text-foreground">Create Intent</h2>
        <p className="mt-2 text-sm text-foreground/65">
          Establish a new escrow agreement. Funds will be locked in the smart contract until release conditions are met.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="space-y-1">
            <label htmlFor="seller" className="text-sm font-semibold text-foreground/80">
              Seller Public Key
            </label>
            <input
              id="seller"
              type="text"
              placeholder="G..."
              className="w-full rounded-xl border border-outline-variant/60 bg-surface-container/30 px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register('seller')}
            />
            {errors.seller && <p className="text-xs text-red-500">{errors.seller.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="amount" className="text-sm font-semibold text-foreground/80">
              Amount (XLM)
            </label>
            <input
              id="amount"
              type="text"
              placeholder="0.00"
              className="w-full rounded-xl border border-outline-variant/60 bg-surface-container/30 px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register('amount')}
            />
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !buyerPublicKey}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Initialize Escrow <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(230,242,255,0.9))] p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileText className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-foreground">Workflow context</h2>
        <p className="mt-3 text-sm leading-6 text-foreground/70">
          You are acting as the <strong>Buyer</strong> in this transaction. Your wallet public key is automatically used as the source for funds.
        </p>
        
        {buyerPublicKey ? (
          <div className="mt-6 rounded-2xl border border-outline-variant/50 bg-white/80 p-4 text-xs font-mono text-foreground/70 break-all">
            <span className="font-semibold text-foreground mb-1 block">Your Wallet:</span>
            {buyerPublicKey}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-outline-variant/50 bg-white/80 p-4 text-sm text-foreground/70 animate-pulse">
            Loading your wallet...
          </div>
        )}
      </div>
    </section>
  );
}

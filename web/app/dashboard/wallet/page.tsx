'use client';

import { useEffect } from 'react';
import { CircleDollarSign, Wallet, RefreshCw } from 'lucide-react';
import { useApi } from '@/src/hooks/useApi';

interface WalletBalanceResponse {
  success: boolean;
  message: string;
  data: {
    balance: string;
    asset: string;
  };
}

export default function WalletPage() {
  const { request, isLoading, data, error } = useApi<WalletBalanceResponse>();

  useEffect(() => {
    request({ method: 'GET', url: '/api/wallets/me/balance' });
  }, [request]);

  const balance = data?.data?.balance || '0.00';
  const asset = data?.data?.asset || 'XLM';

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Wallet className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-foreground">Wallet overview</h2>
        <p className="mt-3 text-sm leading-6 text-foreground/70">
          This is your primary Stellar account automatically provisioned via the Relayer. Use this address for all incoming payments and escrows.
        </p>
      </div>

      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(230,242,255,0.9))] p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CircleDollarSign className="h-6 w-6" />
          </div>
          <button 
            onClick={() => request({ method: 'GET', url: '/api/wallets/me/balance' })}
            disabled={isLoading}
            className="p-2 text-foreground/50 transition hover:text-primary disabled:opacity-50"
            aria-label="Refresh balance"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <h2 className="mt-5 text-2xl font-bold text-foreground">Financial snapshot</h2>
        
        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">Failed to load wallet balance.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-outline-variant/50 bg-white/80 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                Available balance
              </div>
              <div className="mt-2 text-2xl font-bold text-foreground">
                {isLoading && !data ? (
                  <span className="inline-block h-8 w-24 animate-pulse rounded bg-foreground/10" />
                ) : (
                  `${balance} ${asset}`
                )}
              </div>
            </div>
            
            <div className="rounded-2xl border border-outline-variant/50 bg-white/80 p-4 opacity-60">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                Pending releases
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                Coming soon
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

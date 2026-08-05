'use client';

import { useEffect, useState } from 'react';
import { CircleDollarSign, Wallet, RefreshCw, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useApi } from '@/src/hooks/useApi';

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

export default function WalletPage() {
  const { request: requestBalance, isLoading: isLoadingBalance, data: balanceData, error: balanceError } = useApi<WalletBalanceResponse>();
  const { request: requestWallet, isLoading: isLoadingWallet, data: walletData } = useApi<WalletInfoResponse>();

  useEffect(() => {
    requestBalance({ method: 'GET', url: '/api/wallets/me/balance' });
    requestWallet({ method: 'GET', url: '/api/wallets/me' });
  }, [requestBalance, requestWallet]);

  const balance = balanceData?.data?.balance || '0.00';
  const asset = balanceData?.data?.asset || 'XLM';
  const publicKey = walletData?.data?.publicKey;

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      toast.success('Wallet address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
        <div className="mt-6 rounded-2xl border border-outline-variant/50 bg-white/50 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
            Wallet Address
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-white/80 p-3 shadow-sm ring-1 ring-black/5">
            {isLoadingWallet && !publicKey ? (
              <span className="inline-block h-6 w-full animate-pulse rounded bg-foreground/10" />
            ) : publicKey ? (
              <>
                <div className="truncate font-mono text-sm font-medium text-foreground sm:text-base">
                  {publicKey}
                </div>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 rounded-lg p-2 text-foreground/50 transition-colors hover:bg-black/5 hover:text-primary active:bg-black/10"
                  aria-label="Copy wallet address"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </>
            ) : (
              <span className="text-sm font-medium text-foreground/50">Address not found</span>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(230,242,255,0.9))] p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CircleDollarSign className="h-6 w-6" />
          </div>
          <button 
            onClick={() => requestBalance({ method: 'GET', url: '/api/wallets/me/balance' })}
            disabled={isLoadingBalance}
            className="p-2 text-foreground/50 transition hover:text-primary disabled:opacity-50"
            aria-label="Refresh balance"
          >
            <RefreshCw className={`h-5 w-5 ${isLoadingBalance ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <h2 className="mt-5 text-2xl font-bold text-foreground">Financial snapshot</h2>
        
        {balanceError ? (
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
                {isLoadingBalance && !balanceData ? (
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

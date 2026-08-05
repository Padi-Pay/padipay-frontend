'use client';

import { use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { CircleAlert, FileText, ShieldCheck, RefreshCw } from 'lucide-react';
import { useApi } from '@/src/hooks/useApi';

interface EscrowDetailsPageProps {
  params: Promise<{ id: string }>;
}

interface EscrowDetailsResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    amount: string;
    asset: string | null;
    status: string;
    buyerAddress: string;
    sellerAddress: string;
    actionType: string;
    createdAt: string;
  };
}

export default function EscrowDetailsPage({ params }: EscrowDetailsPageProps) {
  const { id } = use(params);

  if (!id) {
    notFound();
  }

  const { request, isLoading, data, error } = useApi<EscrowDetailsResponse>();

  useEffect(() => {
    request({ method: 'GET', url: `/api/accounts/me/escrows/${id}` });
  }, [id, request]);

  const escrow = data?.data;

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/60">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Escrow details
          </div>
          <button 
            onClick={() => request({ method: 'GET', url: `/api/accounts/me/escrows/${id}` })}
            disabled={isLoading}
            className="p-2 text-foreground/50 transition hover:text-primary disabled:opacity-50"
            aria-label="Refresh details"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground">
          Intent details
        </h1>
        <p className="mt-3 text-sm leading-6 text-foreground/70">
          Review the full terms of this escrow agreement. Both parties must fulfill their obligations before funds are released.
        </p>

        {error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-800">
            Failed to load escrow details. Please ensure the escrow ID is correct and you have permission to view it.
          </div>
        ) : isLoading && !data ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 animate-pulse">
            <div className="h-24 rounded-2xl bg-foreground/5" />
            <div className="h-24 rounded-2xl bg-foreground/5" />
            <div className="h-24 rounded-2xl bg-foreground/5" />
            <div className="h-24 rounded-2xl bg-foreground/5" />
          </div>
        ) : escrow ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Status', value: escrow.status },
              { label: 'Amount', value: `${escrow.amount} ${escrow.asset || 'XLM'}` },
              { label: 'Buyer', value: `${escrow.buyerAddress.substring(0, 8)}...${escrow.buyerAddress.substring(50)}` },
              { label: 'Seller', value: `${escrow.sellerAddress.substring(0, 8)}...${escrow.sellerAddress.substring(50)}` },
              { label: 'Type', value: escrow.actionType },
              { label: 'Created', value: new Date(escrow.createdAt).toLocaleDateString() },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-outline-variant/60 bg-surface-container/50 p-4"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                  {item.label}
                </div>
                <div className="mt-2 text-sm font-semibold text-foreground truncate" title={item.value}>{item.value}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(241,240,255,0.9))] p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CircleAlert className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-foreground">Transaction status</h2>
        <p className="mt-3 text-sm leading-6 text-foreground/70">
          The underlying Stellar transaction status will be displayed here once submitted to the network.
        </p>
        <div className="mt-6 rounded-2xl border border-outline-variant/50 bg-white/80 p-4 text-sm text-foreground/70">
          Waiting for actions on this escrow...
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-outline-variant/50 bg-white/80 p-4 text-sm text-foreground/70 break-all">
          <FileText className="h-4 w-4 shrink-0 text-primary" />
          <span className="font-semibold text-foreground text-xs">{id}</span>
        </div>
      </div>
    </section>
  );
}

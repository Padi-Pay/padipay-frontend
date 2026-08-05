'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightLeft, PlusCircle, RefreshCw } from 'lucide-react';
import { useApi } from '@/src/hooks/useApi';

interface Escrow {
  id: string;
  amount: string;
  asset: string | null;
  status: string;
  buyerAddress: string;
  sellerAddress: string;
}

interface EscrowsResponse {
  success: boolean;
  message: string;
  data: Escrow[];
}

export default function EscrowsPage() {
  const { request, isLoading, data, error } = useApi<EscrowsResponse>();

  useEffect(() => {
    request({ method: 'GET', url: '/api/accounts/me/escrows' });
  }, [request]);

  const escrows = data?.data || [];

  return (
    <section className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Escrows</h2>
          <p className="mt-2 text-sm text-foreground/65">
            Review active intents and open the create flow when you need a new agreement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => request({ method: 'GET', url: '/api/accounts/me/escrows' })}
            disabled={isLoading}
            className="rounded-xl border border-outline-variant/50 p-3 text-foreground/60 transition hover:bg-surface-container hover:text-primary disabled:opacity-50"
            aria-label="Refresh escrows"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <Link
            href="/dashboard/escrows/create"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            <PlusCircle className="h-4 w-4" />
            Create intent
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-800">
            Failed to load escrows. Please try again.
          </div>
        ) : isLoading && !data ? (
          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container/50 px-5 py-8 text-center text-sm font-medium text-foreground/50 animate-pulse">
            Loading your escrows...
          </div>
        ) : escrows.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container/50 px-5 py-12 text-center">
            <ArrowRightLeft className="mx-auto h-8 w-8 text-foreground/30" />
            <h3 className="mt-4 text-base font-semibold text-foreground">No escrows found</h3>
            <p className="mt-2 text-sm text-foreground/60">
              You haven&apos;t created or participated in any escrows yet.
            </p>
          </div>
        ) : (
          escrows.map((escrow) => (
            <Link
              key={escrow.id}
              href={`/dashboard/escrows/${escrow.id}`}
              className="group flex items-center justify-between rounded-2xl border border-outline-variant/60 bg-surface-container/50 px-5 py-4 transition-colors hover:border-primary/30 hover:bg-surface-container"
            >
              <div>
                <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <ArrowRightLeft className="h-4 w-4 text-primary" />
                  {escrow.amount} {escrow.asset || 'XLM'}
                </div>
                <p className="mt-1 text-sm text-foreground/65">
                  ID: <span className="font-mono text-xs">{escrow.id}</span>
                </p>
              </div>
              <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary group-hover:bg-primary/20">
                {escrow.status}
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

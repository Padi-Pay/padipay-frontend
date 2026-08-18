'use client';

import Link from 'next/link';
import { ArrowRightLeft, PlusCircle, RefreshCw, Calendar, User } from 'lucide-react';
import { useEscrows } from '@/src/hooks/queries/useEscrowQueries';
import { EscrowBadge } from '@/src/components/escrows/EscrowBadge';
import { useWalletInfo } from '@/src/hooks/queries/useWalletQuery';

export default function EscrowsPage() {
  const { data, isLoading, error, refetch } = useEscrows();
  const { data: walletData } = useWalletInfo();

  const escrows = data?.data || [];
  const userPublicKey = walletData?.data?.publicKey;

  return (
    <section className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Escrows</h2>
          <p className="mt-2 text-sm text-foreground/65">
            Review active intents and open the create flow when you need a new agreement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
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

      <div className="mt-8">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-800">
            Failed to load escrows. Please try again.
          </div>
        ) : isLoading && !data ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-surface-container/50 animate-pulse border border-outline-variant/60" />
            ))}
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {escrows.map((escrow) => {
              const isBuyer = escrow.buyerAddress === userPublicKey;
              const counterparty = isBuyer ? escrow.sellerAddress : escrow.buyerAddress;
              const role = isBuyer ? 'Buyer' : 'Seller';

              return (
                <Link
                  key={escrow.id}
                  href={`/dashboard/escrows/${escrow.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-outline-variant/60 bg-white p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <EscrowBadge status={escrow.status} />
                      <span className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">{role}</span>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {escrow.amount} <span className="text-sm font-semibold text-foreground/50">{escrow.asset || 'XLM'}</span>
                      </div>
                      
                      {escrow.description && (
                        <p className="mt-2 text-sm text-foreground/70 line-clamp-2">
                          {escrow.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 pt-4 border-t border-outline-variant/30">
                      <div className="flex items-center gap-2 text-xs text-foreground/60">
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate">With {counterparty.substring(0, 8)}...{counterparty.substring(50)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-foreground/60">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(escrow.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

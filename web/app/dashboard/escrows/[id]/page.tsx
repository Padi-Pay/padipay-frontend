'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { CircleAlert, FileText, ShieldCheck, RefreshCw, Wallet } from 'lucide-react';
import { useEscrowDetails } from '@/src/hooks/queries/useEscrowQueries';
import { useWalletInfo } from '@/src/hooks/queries/useWalletQuery';
import { EscrowTimeline } from '@/src/components/escrows/EscrowTimeline';
import { FundEscrowModal } from '@/src/components/escrows/FundEscrowModal';
import { Button } from '@/components/ui/Button';

interface EscrowDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function EscrowDetailsPage({ params }: EscrowDetailsPageProps) {
  const { id } = use(params);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);

  if (!id) {
    notFound();
  }

  const { data, isLoading, error, refetch } = useEscrowDetails(id);
  const { data: walletData } = useWalletInfo();
  
  const escrow = data?.data;
  const userPublicKey = walletData?.data?.publicKey;
  const isBuyer = escrow?.buyerAddress === userPublicKey;
  
  // Show fund CTA if the escrow is pending and the user is the buyer
  const showFundCTA = isBuyer && escrow?.status === 'PENDING';

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr] max-w-6xl mx-auto">
      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/60">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Escrow details
          </div>
          <button 
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-2 text-foreground/50 transition hover:text-primary disabled:opacity-50"
            aria-label="Refresh details"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Intent details
          </h1>
          <p className="mt-3 text-sm leading-6 text-foreground/70">
            Review the full terms of this escrow agreement. Both parties must fulfill their obligations before funds are released.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-800">
            Failed to load escrow details. Please ensure the escrow ID is correct and you have permission to view it.
          </div>
        ) : isLoading && !data ? (
          <div className="grid gap-4 sm:grid-cols-2 animate-pulse">
            <div className="h-24 rounded-2xl bg-foreground/5" />
            <div className="h-24 rounded-2xl bg-foreground/5" />
            <div className="h-24 rounded-2xl bg-foreground/5" />
            <div className="h-24 rounded-2xl bg-foreground/5" />
          </div>
        ) : escrow ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Amount', value: `${escrow.amount} ${escrow.asset || 'XLM'}` },
              { label: 'Created', value: new Date(escrow.createdAt).toLocaleDateString() },
              { label: 'Buyer', value: `${escrow.buyerAddress.substring(0, 8)}...${escrow.buyerAddress.substring(50)}` },
              { label: 'Seller', value: `${escrow.sellerAddress.substring(0, 8)}...${escrow.sellerAddress.substring(50)}` },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-outline-variant/60 bg-surface-container/50 p-4"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                  {item.label}
                </div>
                <div className="mt-2 text-sm font-semibold text-foreground truncate" title={item.value as string}>{item.value}</div>
              </div>
            ))}
            
            {escrow.description && (
               <div className="col-span-1 sm:col-span-2 rounded-2xl border border-outline-variant/60 bg-surface-container/50 p-4">
                 <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                   Description
                 </div>
                 <div className="mt-2 text-sm text-foreground whitespace-pre-wrap">{escrow.description}</div>
               </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(241,240,255,0.9))] p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8 flex flex-col h-full">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CircleAlert className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-foreground">Transaction status</h2>
        <p className="mt-3 text-sm leading-6 text-foreground/70">
          Track the lifecycle of this escrow intent below.
        </p>
        
        <div className="mt-8 flex-1">
          <EscrowTimeline status={escrow?.status || 'PENDING'} />
        </div>

        {showFundCTA && (
          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col items-center gap-4 text-center">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Action Required</h4>
              <p className="text-sm text-foreground/60 mt-1">Please fund this escrow to lock the transaction on-chain.</p>
            </div>
            <Button onClick={() => setIsFundModalOpen(true)} className="w-full">
              Fund {escrow.amount} XLM
            </Button>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-outline-variant/50 bg-white/80 p-4 text-sm text-foreground/70 break-all">
          <FileText className="h-4 w-4 shrink-0 text-primary" />
          <span className="font-semibold text-foreground text-xs">{id}</span>
        </div>
      </div>

      {escrow && userPublicKey && (
        <FundEscrowModal 
          escrowId={escrow.id}
          amount={escrow.amount}
          buyerPublicKey={userPublicKey}
          isOpen={isFundModalOpen}
          onClose={() => setIsFundModalOpen(false)}
        />
      )}
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CircleDollarSign, Wallet, RefreshCw, Copy, Check, History, Zap, ListChecks, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApi } from '@/src/hooks/useApi';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TextInput } from '@/components/forms/TextInput';
import { CurrencyInput } from '@/components/forms/CurrencyInput';
import { withdrawalSchema, WithdrawalFormData } from '@/lib/validations/wallet.schema';

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

interface Escrow {
  id: string;
  amount: string;
  asset: string | null;
  status: string;
  createdAt: string;
}

interface EscrowsResponse {
  success: boolean;
  message: string;
  data: Escrow[];
}

export default function WalletPage() {
  const { request: requestBalance, isLoading: isLoadingBalance, data: balanceData, error: balanceError } = useApi<WalletBalanceResponse>();
  const { request: requestWallet, isLoading: isLoadingWallet, data: walletData } = useApi<WalletInfoResponse>();
  const { request: requestFund, isLoading: isFunding } = useApi();
  const { request: requestWithdraw, isLoading: isWithdrawing } = useApi();
  const { request: requestEscrows, isLoading: isLoadingEscrows, data: escrowsData } = useApi<EscrowsResponse>();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
  });

  const fetchBalances = () => {
    requestBalance({ method: 'GET', url: '/api/wallets/me/balance' });
    requestWallet({ method: 'GET', url: '/api/wallets/me' });
    requestEscrows({ method: 'GET', url: '/api/accounts/me/escrows' });
  };

  useEffect(() => {
    fetchBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const balance = balanceData?.data?.balance || '0.00';
  const asset = balanceData?.data?.asset || 'XLM';
  const publicKey = walletData?.data?.publicKey;
  const recentEscrows = escrowsData?.data?.slice(0, 5) || [];

  const pendingReleases = escrowsData?.data?.filter(e => e.status === 'LOCKED').reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      toast.success('Wallet address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFund = async () => {
    if (!publicKey) return;
    const response = await requestFund({
      method: 'POST',
      url: '/api/relayer/fund',
      data: { walletAddress: publicKey, amount: '10000', asset: 'XLM' },
    });
    if (response && !response.error) {
      toast.success('Successfully funded testnet wallet! Balances updating...');
      // Poll for balance updates since ledger closure is async
      let attempts = 0;
      const poll = () => {
        if (attempts > 5) return;
        setTimeout(() => {
          fetchBalances();
          attempts++;
          poll();
        }, 3000);
      };
      poll();
    }
  };

  const onWithdrawSubmit = async (data: WithdrawalFormData) => {
    const response = await requestWithdraw({
      method: 'POST',
      url: '/api/wallets/withdraw',
      data,
    });
    if (response && !response.error) {
      toast.success('Withdrawal initiated successfully!');
      setIsWithdrawModalOpen(false);
      reset();
      // Poll for balance updates since ledger closure is async
      let attempts = 0;
      const poll = () => {
        if (attempts > 5) return;
        setTimeout(() => {
          fetchBalances();
          attempts++;
          poll();
        }, 3000);
      };
      poll();
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Wallet Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/90 via-primary to-emerald-600 p-8 text-white shadow-2xl shadow-primary/20 sm:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/10 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 opacity-90 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner ring-1 ring-white/30">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-white">Managed Wallet</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              {isLoadingBalance && !balanceData ? (
                <span className="inline-block h-12 w-48 animate-pulse rounded-lg bg-white/20" />
              ) : (
                `${balance} ${asset}`
              )}
            </h1>
            <p className="mt-4 text-sm font-medium text-white/80 max-w-md sm:text-base">
              Your primary Stellar account provisioned by the Relayer. Use this address for all incoming payments and escrows.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-0">
            <Button 
              onClick={handleFund} 
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md font-semibold"
              disabled={!publicKey || isFunding}
              isLoading={isFunding}
            >
              <ArrowDownRight className="mr-2 h-4 w-4" />
              Fund Testnet
            </Button>
            <Button 
              onClick={() => setIsWithdrawModalOpen(true)}
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90 font-bold border-none"
              disabled={!balanceData || Number(balanceData.data.balance) <= 0}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Wallet Address Card */}
        <div className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45 mb-4">
            Wallet Address
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-container/30 p-4 ring-1 ring-black/5">
            {isLoadingWallet && !publicKey ? (
              <span className="inline-block h-6 w-full animate-pulse rounded bg-foreground/10" />
            ) : publicKey ? (
              <>
                <div className="truncate font-mono text-sm font-medium text-foreground sm:text-base">
                  {publicKey}
                </div>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 rounded-lg p-2.5 text-foreground/50 transition-colors hover:bg-black/5 hover:text-primary active:bg-black/10"
                  aria-label="Copy wallet address"
                >
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </button>
              </>
            ) : (
              <span className="text-sm font-medium text-foreground/50">Address not found</span>
            )}
          </div>
        </div>

        {/* Snapshot Card */}
        <div className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
              Financial Snapshot
            </div>
            <button 
              onClick={fetchBalances}
              disabled={isLoadingBalance}
              className="p-1 text-foreground/40 transition hover:text-primary disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-surface-container/30 p-4 ring-1 ring-black/5">
              <div className="text-xs text-foreground/60 mb-1">Available</div>
              <div className="text-lg font-bold text-foreground truncate">{balance} {asset}</div>
            </div>
            <div className="rounded-xl bg-surface-container/30 p-4 ring-1 ring-black/5">
              <div className="text-xs text-foreground/60 mb-1">Locked in Escrow</div>
              <div className="text-lg font-bold text-foreground truncate">
                {isLoadingEscrows ? (
                  <span className="inline-block h-6 w-16 animate-pulse rounded bg-foreground/10" />
                ) : (
                  `${pendingReleases} ${asset}`
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="rounded-[2rem] border border-outline-variant/50 bg-white/60 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.04)] backdrop-blur-lg sm:p-8">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-foreground/70">
              <History className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
          </div>
          <Link href="/dashboard/escrows" className="text-sm font-semibold text-primary hover:underline">
            View all escrows
          </Link>
        </div>
        
        <div className="mt-6 flex flex-col gap-4">
          {isLoadingEscrows && !escrowsData ? (
            <div className="flex flex-col gap-4 opacity-60">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between animate-pulse p-2">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-surface-container"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 rounded bg-surface-container"></div>
                      <div className="h-3 w-16 rounded bg-surface-container"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentEscrows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-70">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container/80 mb-4">
                <Zap className="h-6 w-6 text-foreground/40" />
              </div>
              <h3 className="text-base font-semibold text-foreground">No recent activity</h3>
              <p className="mt-2 text-sm text-foreground/60 max-w-[250px]">Your wallet activity and recent escrows will appear here.</p>
            </div>
          ) : (
            recentEscrows.map((escrow) => (
              <Link
                key={escrow.id}
                href={`/dashboard/escrows/${escrow.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl p-3 transition-colors hover:bg-surface-container/50 gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600 transition-transform group-hover:scale-110">
                    <ListChecks className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      Escrow Intent
                    </p>
                    <p className="text-xs text-foreground/60 font-mono mt-0.5">
                      {escrow.id.split('-')[0]}...
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between">
                  <p className="text-sm font-bold text-foreground">
                    {escrow.amount} {escrow.asset || 'XLM'}
                  </p>
                  <p className={`text-xs font-semibold mt-1 ${escrow.status === 'PENDING' ? 'text-orange-500' : escrow.status === 'SUCCESS' ? 'text-green-500' : 'text-primary'}`}>
                    {escrow.status}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Withdrawal Modal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Withdraw Funds"
      >
        <p className="mb-6 text-sm text-foreground/70">
          Transfer your XLM to an external Stellar wallet.
        </p>
        <form onSubmit={handleSubmit(onWithdrawSubmit)} className="space-y-6">
          <TextInput
            label="Destination Address"
            placeholder="G..."
            error={errors.destinationAddress?.message}
            {...register('destinationAddress')}
          />
          <CurrencyInput
            label="Amount (XLM)"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register('amount')}
          />
          
          <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/50">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsWithdrawModalOpen(false)}
              disabled={isWithdrawing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isWithdrawing}
            >
              Confirm Withdrawal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Wallet, RefreshCw, Copy, Check, History, ArrowDownRight, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApi } from '@/src/hooks/useApi';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TextInput } from '@/components/forms/TextInput';
import { CurrencyInput } from '@/components/forms/CurrencyInput';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
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
  const { request: requestBalance, isLoading: isLoadingBalance, data: balanceData } = useApi<WalletBalanceResponse>();
  const { request: requestWallet, isLoading: isLoadingWallet, data: walletData } = useApi<WalletInfoResponse>();
  const { request: requestFund, isLoading: isFunding } = useApi();
  const { request: requestWithdraw, isLoading: isWithdrawing } = useApi();
  const { request: requestEscrows, isLoading: isLoadingEscrows, data: escrowsData } = useApi<EscrowsResponse>();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
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

  const rawBalance = balanceData?.data?.balance || '0.00';
  const balance = Number(rawBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const asset = balanceData?.data?.asset || 'XLM';
  const publicKey = walletData?.data?.publicKey;
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
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-10">
      
      {/* Wallet Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/95 to-emerald-700 p-8 sm:p-12 text-white shadow-xl">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -right-10 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-black/10 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-inner ring-1 ring-white/20">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">Managed Wallet</h2>
                <p className="text-xs text-white/60">Testnet Provisioned</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-white/80">Total Balance</div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight flex items-baseline gap-3">
                {isLoadingBalance && !balanceData ? (
                  <SkeletonLoader variant="rectangular" className="h-14 w-64 bg-white/20" />
                ) : (
                  <>
                    <span>{balance}</span>
                    <span className="text-2xl md:text-3xl font-bold text-white/70">{asset}</span>
                  </>
                )}
              </h1>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Button 
              onClick={handleFund} 
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg shadow-black/10 w-full sm:w-auto h-12 px-6"
              disabled={!publicKey || isFunding}
              isLoading={isFunding}
            >
              <ArrowDownRight className="mr-2 h-5 w-5" />
              Fund Testnet
            </Button>
            <Button 
              onClick={() => setIsWithdrawModalOpen(true)}
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/10 font-bold border-none w-full sm:w-auto h-12 px-6"
              disabled={!balanceData || Number(balanceData.data.balance) <= 0}
            >
              <ArrowUpRight className="mr-2 h-5 w-5" />
              Withdraw
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Details & Snapshot */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Wallet Address Card */}
          <section className="rounded-[2rem] border border-outline-variant/60 bg-surface/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Wallet Address</h3>
            </div>
            
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface-container-lowest p-4 ring-1 ring-outline-variant/50 group transition-all hover:ring-primary/30">
              {isLoadingWallet && !publicKey ? (
                <SkeletonLoader variant="text" className="h-6 w-full" />
              ) : publicKey ? (
                <>
                  <div className="break-all font-mono text-xs sm:text-sm font-medium text-foreground/80">
                    {publicKey}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex-shrink-0 rounded-xl p-2.5 text-foreground/50 transition-all hover:bg-primary/10 hover:text-primary active:scale-95"
                    aria-label="Copy wallet address"
                  >
                    {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                  </button>
                </>
              ) : (
                <span className="text-sm font-medium text-foreground/50">Address not found</span>
              )}
            </div>
          </section>

          {/* Snapshot Card */}
          <section className="rounded-[2rem] border border-outline-variant/60 bg-surface/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
             <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Snapshot</h3>
              </div>
              <button 
                onClick={fetchBalances}
                disabled={isLoadingBalance}
                className="rounded-full p-2 text-foreground/40 transition-colors hover:bg-surface-container hover:text-primary disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between rounded-2xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/50">
                <span className="text-sm font-medium text-foreground/60">Available to Spend</span>
                <span className="text-lg font-bold text-foreground">
                  {isLoadingBalance ? <SkeletonLoader variant="text" className="w-24 h-6" /> : `${balance} ${asset}`}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/50">
                <span className="text-sm font-medium text-foreground/60">Locked in Escrow</span>
                <span className="text-lg font-bold text-foreground">
                  {isLoadingEscrows ? <SkeletonLoader variant="text" className="w-24 h-6" /> : `${pendingReleases.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${asset}`}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="lg:col-span-7">
          <section className="h-full rounded-[2rem] border border-outline-variant/60 bg-surface/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Recent Activity</h3>
              </div>
              {/* View All link removed as transaction history is unavailable */}
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-outline-variant/60 bg-surface-container-lowest/50 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container mb-4 text-foreground/40">
                  <History className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-foreground">Transaction history unavailable</h4>
                <p className="mt-2 text-sm text-foreground/60 max-w-[280px]">
                  A dedicated transaction ledger is currently not supported by the network relayer. 
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

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

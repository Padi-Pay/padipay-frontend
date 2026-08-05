'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightLeft, Wallet, ListChecks, ShieldCheck, ArrowRight, Zap, History, Activity } from 'lucide-react';
import { useGlobalStore } from '@/src/store/globalStore';
import { useApi } from '@/src/hooks/useApi';

const quickActions = [
  {
    title: 'New Escrow',
    description: 'Create a secure trade intent instantly.',
    href: '/dashboard/escrows/create',
    icon: ListChecks,
    color: 'from-green-500 to-emerald-400',
    bg: 'bg-green-50',
    text: 'text-green-600',
    delay: 'delay-[100ms]',
  },
  {
    title: 'Wallet Balance',
    description: 'View your XLM and connected assets.',
    href: '/dashboard/wallet',
    icon: Wallet,
    color: 'from-blue-500 to-indigo-400',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    delay: 'delay-[200ms]',
  },
  {
    title: 'Active Escrows',
    description: 'Manage and review pending trades.',
    href: '/dashboard/escrows',
    icon: ArrowRightLeft,
    color: 'from-purple-500 to-fuchsia-400',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    delay: 'delay-[300ms]',
  },
];

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

export default function DashboardHomePage() {
  const profile = useGlobalStore((state) => state.profile);
  const firstName = profile?.name ? profile.name.split(' ')[0] : null;
  const { request: requestEscrows, isLoading, data } = useApi<EscrowsResponse>();

  useEffect(() => {
    requestEscrows({ method: 'GET', url: '/api/accounts/me/escrows' });
  }, [requestEscrows]);

  const recentEscrows = data?.data?.slice(0, 4) || [];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/90 via-primary to-emerald-600 p-8 text-white shadow-2xl shadow-primary/20 sm:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/10 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back{firstName ? `, ${firstName}` : ''}
            </h1>
            <p className="mt-4 text-base font-medium text-white/80 sm:text-lg">
              You are securely connected to the PadiPay decentralized relayer. Your wallet is active and ready for secure escrows.
            </p>
          </div>
          
          <div className="mt-6 hidden md:mt-0 md:block">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner ring-1 ring-white/30">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className={`group relative overflow-hidden rounded-[1.75rem] border border-outline-variant/50 bg-white/80 p-6 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-${action.text.split('-')[1]}/30 animate-in fade-in slide-in-from-bottom-8 fill-mode-both ${action.delay}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${action.bg} ${action.text} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-6 text-xl font-bold text-foreground group-hover:text-primary transition-colors">{action.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-foreground/60">{action.description}</p>
                </div>
                
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-foreground/40 transition-colors group-hover:text-primary">
                  <span>Open</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Activity & System Status */}
      <section className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Recent Activity */}
        <div className="rounded-[2rem] border border-outline-variant/50 bg-white/60 p-6 shadow-sm backdrop-blur-lg sm:p-8 animate-in fade-in slide-in-from-bottom-8 delay-500 fill-mode-both">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-foreground/70">
                <History className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
            </div>
            <Link href="/dashboard/escrows" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          
          <div className="mt-6 flex flex-col gap-4">
            {isLoading && !data ? (
              <div className="flex flex-col gap-4 opacity-60">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-3">
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
              <div className="flex flex-col items-center justify-center py-8 text-center opacity-60">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container">
                  <Zap className="h-6 w-6 text-foreground/40" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">No recent activity</h3>
                <p className="mt-1 text-xs text-foreground/60 max-w-[200px]">Create an escrow intent or fund your wallet to get started.</p>
              </div>
            ) : (
              recentEscrows.map((escrow) => (
                <Link
                  key={escrow.id}
                  href={`/dashboard/escrows/${escrow.id}`}
                  className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-surface-container/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600 transition-transform group-hover:scale-110">
                      <ListChecks className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        Created Escrow
                      </p>
                      <p className="text-xs text-foreground/60 font-mono mt-0.5">
                        {escrow.id.split('-')[0]}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
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
        </div>

        {/* System Status */}
        <aside className="rounded-[2rem] border border-outline-variant/50 bg-[linear-gradient(135deg,rgba(22,163,74,0.05),rgba(255,255,255,0.8))] p-6 shadow-sm backdrop-blur-lg animate-in fade-in slide-in-from-bottom-8 delay-[600ms] fill-mode-both">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">System Status</h2>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-white/80 p-3 shadow-sm ring-1 ring-black/5">
              <span className="text-sm font-medium text-foreground/70">Relayer API</span>
              <span className="flex items-center gap-2 text-xs font-bold text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/80 p-3 shadow-sm ring-1 ring-black/5">
              <span className="text-sm font-medium text-foreground/70">Stellar Horizon</span>
              <span className="flex items-center gap-2 text-xs font-bold text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                Testnet Active
              </span>
            </div>
          </div>
          
          <div className="mt-6 rounded-xl bg-primary/5 p-4 text-xs leading-relaxed text-primary/80">
            <strong>Security Notice:</strong> Always verify recipient addresses before approving escrow transfers.
          </div>
        </aside>
      </section>

    </div>
  );
}

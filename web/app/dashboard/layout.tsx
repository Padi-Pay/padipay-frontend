import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(22,163,74,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,95,129,0.06),transparent_30%),linear-gradient(180deg,#f7fbff_0%,#eef5ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <header className="overflow-hidden rounded-[2rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,28,45,0.08)] backdrop-blur sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/60">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Secure workspace
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                    Dashboard
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg">
                    Manage escrow operations, review account activity, and move through nested workflows with clear navigation.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-2xl border border-outline-variant bg-white px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Public site
                </Link>
                <Link
                  href="/dashboard/escrows/create"
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  New intent
                </Link>
              </div>
            </div>

            <div className="mt-6 border-t border-outline-variant/50 pt-5">
              <Breadcrumbs />
            </div>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

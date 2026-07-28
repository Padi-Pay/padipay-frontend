import Link from 'next/link';
import { ShieldCheck, Wallet, ArrowRightLeft, ListChecks } from 'lucide-react';

const panels = [
  {
    title: 'Escrow intents',
    description: 'Create and review secure trade intents.',
    href: '/dashboard/escrows',
    icon: ArrowRightLeft,
  },
  {
    title: 'Wallet overview',
    description: 'Inspect balances, connected accounts, and limits.',
    href: '/dashboard/wallet',
    icon: Wallet,
  },
  {
    title: 'Intent builder',
    description: 'Jump directly into the create-intent flow.',
    href: '/dashboard/escrows/create',
    icon: ListChecks,
  },
];

export default function DashboardHomePage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {panels.map((panel) => {
          const Icon = panel.icon;

          return (
            <Link
              key={panel.title}
              href={panel.href}
              className="group rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_70px_rgba(17,28,45,0.1)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-foreground">{panel.title}</h2>
              <p className="mt-2 text-sm leading-6 text-foreground/65">{panel.description}</p>
              <div className="mt-5 text-sm font-semibold text-primary">
                Open section
              </div>
            </Link>
          );
        })}
      </div>

      <aside className="rounded-[1.75rem] border border-outline-variant/60 bg-[linear-gradient(180deg,rgba(22,163,74,0.12),rgba(255,255,255,0.95))] p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-foreground">Secure access verified</h2>
        <p className="mt-3 text-sm leading-6 text-foreground/70">
          The dashboard shell protects privileged routes and redirects unauthenticated users back to login with their intended destination preserved.
        </p>
        <div className="mt-6 rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-foreground/70">
          Tip: try navigating to a nested path such as <span className="font-semibold text-foreground">/dashboard/escrows/123</span> to confirm breadcrumbs stay readable.
        </div>
      </aside>
    </section>
  );
}

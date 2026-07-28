import { CircleDollarSign, Wallet } from 'lucide-react';

export default function WalletPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Wallet className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-foreground">Wallet overview</h2>
        <p className="mt-3 text-sm leading-6 text-foreground/70">
          A placeholder page for nested navigation. The breadcrumb trail should read Dashboard &gt; Wallet.
        </p>
      </div>

      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(230,242,255,0.9))] p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CircleDollarSign className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-foreground">Financial snapshot</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Available balance', value: '18.24 XLM' },
            { label: 'Pending releases', value: '3 escrows' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-outline-variant/50 bg-white/80 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                {item.label}
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { CircleDollarSign, FileText, UserRound } from 'lucide-react';

export default function CreateEscrowPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <h2 className="text-2xl font-bold text-foreground">Create Intent</h2>
        <p className="mt-2 text-sm text-foreground/65">
          This page represents the deeply nested flow used by the breadcrumb component.
        </p>

        <div className="mt-8 space-y-4">
          {[
            {
              icon: UserRound,
              label: 'Buyer and seller details',
            },
            {
              icon: CircleDollarSign,
              label: 'Payment amount and release conditions',
            },
            {
              icon: FileText,
              label: 'Settlement memo and attachments',
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border border-outline-variant/60 bg-surface-container/50 px-4 py-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground/75">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(230,242,255,0.9))] p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileText className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-foreground">Workflow preview</h2>
        <p className="mt-3 text-sm leading-6 text-foreground/70">
          The current page should read as <span className="font-semibold text-foreground">Dashboard &gt; Escrows &gt; Create Intent</span> in the breadcrumb trail.
        </p>
        <div className="mt-6 rounded-2xl border border-outline-variant/50 bg-white/80 p-4 text-sm text-foreground/70">
          Replace these placeholders with the real creation form once the backend contract is ready.
        </div>
      </div>
    </section>
  );
}

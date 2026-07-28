import { notFound } from 'next/navigation';
import { CircleAlert, FileText, ShieldCheck } from 'lucide-react';

interface EscrowDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EscrowDetailsPage({ params }: EscrowDetailsPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/60">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Escrow details
        </div>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground">
          Intent {id}
        </h1>
        <p className="mt-3 text-sm leading-6 text-foreground/70">
          This page demonstrates how a dynamic identifier is surfaced in breadcrumbs without exposing the raw route structure.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            {
              label: 'Status',
              value: 'Awaiting funding',
            },
            {
              label: 'Reference',
              value: id.startsWith('escrow_') ? id : `#${id}`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-outline-variant/60 bg-surface-container/50 p-4"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                {item.label}
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(241,240,255,0.9))] p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CircleAlert className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-foreground">Breadcrumb behavior</h2>
        <p className="mt-3 text-sm leading-6 text-foreground/70">
          For an identifier like this one, the trail should end with a readable detail label or the ID itself instead of a raw UUID.
        </p>
        <div className="mt-6 rounded-2xl border border-outline-variant/50 bg-white/80 p-4 text-sm text-foreground/70">
          Supporting data and actions can be wired here once the API is ready.
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-outline-variant/50 bg-white/80 p-4 text-sm text-foreground/70">
          <FileText className="h-4 w-4 text-primary" />
          Current route example: <span className="font-semibold text-foreground">/dashboard/escrows/{id}</span>
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { ArrowRightLeft, PlusCircle } from 'lucide-react';

const intents = [
  {
    id: 'escrow_123',
    counterparty: 'Acme Foods',
    status: 'Pending confirmation',
  },
  {
    id: 'escrow_124',
    counterparty: 'Bright Market',
    status: 'In review',
  },
];

export default function EscrowsPage() {
  return (
    <section className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Escrows</h2>
          <p className="mt-2 text-sm text-foreground/65">
            Review active intents and open the create flow when you need a new agreement.
          </p>
        </div>

        <Link
          href="/dashboard/escrows/create"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
        >
          <PlusCircle className="h-4 w-4" />
          Create intent
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        {intents.map((intent) => (
          <Link
            key={intent.id}
            href={`/dashboard/escrows/${intent.id}`}
            className="group flex items-center justify-between rounded-2xl border border-outline-variant/60 bg-surface-container/50 px-5 py-4 transition-colors hover:border-primary/30 hover:bg-surface-container"
          >
            <div>
              <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ArrowRightLeft className="h-4 w-4 text-primary" />
                {intent.id}
              </div>
              <p className="mt-1 text-sm text-foreground/65">{intent.counterparty}</p>
            </div>
            <div className="text-sm font-medium text-foreground/60 group-hover:text-primary">
              {intent.status}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

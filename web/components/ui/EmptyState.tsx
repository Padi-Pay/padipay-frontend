import Link from 'next/link';
import { ReactNode } from 'react';

interface EmptyStateAction {
  label: string;
  href: string;
}

interface EmptyStateProps {
  eyebrow: string;
  title: string;
  description: string;
  illustration: ReactNode;
  primaryAction: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

export function EmptyState({
  eyebrow,
  title,
  description,
  illustration,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-outline-variant/50 bg-surface-container-lowest/80 px-6 py-12 shadow-[0_24px_70px_rgba(17,28,45,0.08)] backdrop-blur sm:px-10 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.08),transparent_42%),radial-gradient(circle_at_bottom_right,hsl(var(--tertiary)/0.08),transparent_36%)]" />

      <div className="relative mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-outline-variant/60 bg-surface-container-lowest/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/60">
            {eyebrow}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryAction.href}
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {primaryAction.label}
            </Link>

            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                className="inline-flex items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-lowest/80 px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-surface-container-lowest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative w-full max-w-md">{illustration}</div>
        </div>
      </div>
    </section>
  );
}

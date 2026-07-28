import React, { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
  marketingTitle: string;
  marketingDescription: string;
  features?: string[];
  containerClassName?: string;
  illustration?: ReactNode;
}

export function AuthLayout({
  children,
  marketingTitle,
  marketingDescription,
  features = [],
  containerClassName = "bg-[radial-gradient(circle_at_top,rgba(22,163,74,0.08),transparent_42%),linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)]",
  illustration,
}: AuthLayoutProps) {
  return (
    <div className={`min-h-screen px-4 py-10 sm:px-6 lg:px-8 ${containerClassName}`}>
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="order-2 space-y-8 text-center lg:order-1 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-white/80 px-4 py-2 text-sm font-semibold text-foreground/70 shadow-sm backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <Link href="/" className="hover:underline">PadiPay Workspace</Link>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              {marketingTitle}
            </h1>
            <p className="max-w-xl mx-auto text-lg leading-8 text-foreground/70 lg:mx-0">
              {marketingDescription}
            </p>
          </div>

          {features.length > 0 && (
            <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-3 lg:mx-0 lg:justify-start">
              {features.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 rounded-full border border-outline-variant bg-white/80 px-4 py-2 text-sm font-medium text-foreground/65 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {illustration}
        </div>

        <div className="order-1 relative lg:order-2">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />
          <div className="rounded-[2rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,28,45,0.08)] backdrop-blur sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

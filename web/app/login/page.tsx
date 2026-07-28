'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import { UnauthenticatedRoute } from '@/components/auth/UnauthenticatedRoute';
import { useGlobalStore } from '@/src/store/globalStore';

function getSafeRedirectTarget(redirectParam: string | null) {
  if (redirectParam && redirectParam.startsWith('/')) {
    return redirectParam;
  }

  return '/dashboard';
}

export default function LoginPage() {
  return (
    <UnauthenticatedRoute>
      <LoginForm />
    </UnauthenticatedRoute>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget = useMemo(
    () => getSafeRedirectTarget(searchParams?.get('redirect')),
    [searchParams]
  );

  const sessionExpired = searchParams?.get('sessionExpired') === 'true';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    useGlobalStore.getState().login('demo-access-token');
    useGlobalStore.getState().setProfile({
      id: 'user_001',
      email: 'ade@padipay.io',
      name: 'PadiPay Operator',
    });

    router.replace(redirectTarget);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(22,163,74,0.08),transparent_42%),linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-white/80 px-4 py-2 text-sm font-semibold text-foreground/70 shadow-sm backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Secure access to the dashboard
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              Sign in to PadiPay
            </h1>
            <p className="max-w-xl text-lg leading-8 text-foreground/70">
              Continue into the privileged dashboard, review escrow activity, and pick up exactly where you left off.
            </p>
          </div>

          <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-3 lg:mx-0 lg:justify-start">
            {['Escrow operations', 'Wallet management', 'Session recovery'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-outline-variant bg-white/80 px-4 py-2 text-sm font-medium text-foreground/65 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,28,45,0.08)] backdrop-blur sm:p-8"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
                <p className="text-sm text-foreground/60">
                  Authenticate to continue into your workspace.
                </p>
              </div>
            </div>

            {sessionExpired ? (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Your previous session expired. Please log in again.
              </div>
            ) : null}

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-foreground/70">Email</span>
                <input
                  type="email"
                  defaultValue="ade@padipay.io"
                  className="w-full rounded-2xl border border-outline-variant bg-white px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-foreground/70">Password</span>
                <input
                  type="password"
                  defaultValue="password"
                  className="w-full rounded-2xl border border-outline-variant bg-white px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isSubmitting ? 'Signing in...' : 'Continue to dashboard'}
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-center text-sm text-foreground/60">
              You will be returned to{' '}
              <span className="font-semibold text-foreground">{redirectTarget}</span> after successful login.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

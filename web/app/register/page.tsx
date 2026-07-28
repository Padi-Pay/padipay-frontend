'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BadgeCheck, UserPlus, ArrowRight } from 'lucide-react';
import { UnauthenticatedRoute } from '@/components/auth/UnauthenticatedRoute';
import { useGlobalStore } from '@/src/store/globalStore';

function getSafeRedirectTarget(redirectParam: string | null) {
  if (redirectParam && redirectParam.startsWith('/')) {
    return redirectParam;
  }

  return '/dashboard';
}

export default function RegisterPage() {
  return (
    <UnauthenticatedRoute>
      <RegisterForm />
    </UnauthenticatedRoute>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget = useMemo(
    () => getSafeRedirectTarget(searchParams?.get('redirect')),
    [searchParams]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    useGlobalStore.getState().login('demo-access-token');
    useGlobalStore.getState().setProfile({
      id: 'user_001',
      email: 'new@padipay.io',
      name: 'New Operator',
    });

    router.replace(redirectTarget);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(232,95,129,0.08),transparent_40%),linear-gradient(180deg,#fffafc_0%,#eef5ff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-[2rem] border border-outline-variant/60 bg-white/90 p-8 shadow-[0_24px_70px_rgba(17,28,45,0.08)] backdrop-blur">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,95,129,0.1),transparent_36%)]" />
            <div className="relative space-y-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tertiary/10 text-tertiary">
                <UserPlus className="h-7 w-7" />
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                  Create your account
                </h1>
                <p className="max-w-xl text-lg leading-8 text-foreground/70">
                  Join the secure workspace and get access to the dashboard tools used to manage escrow operations.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {['Dashboard access', 'Saved session state', 'Fast return redirects', 'Protected workflows'].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface-container/60 px-4 py-3 text-sm font-medium text-foreground/70"
                  >
                    <BadgeCheck className="h-4 w-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 relative lg:order-2">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-tertiary/10 blur-3xl" />
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_24px_70px_rgba(17,28,45,0.08)] backdrop-blur sm:p-8"
          >
            <h2 className="mb-2 text-2xl font-bold text-foreground">Get started</h2>
            <p className="mb-8 text-sm text-foreground/60">
              Create a workspace account and continue to your requested destination.
            </p>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-foreground/70">Full name</span>
                <input
                  type="text"
                  defaultValue="New Operator"
                  className="w-full rounded-2xl border border-outline-variant bg-white px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-foreground/70">Email</span>
                <input
                  type="email"
                  defaultValue="new@padipay.io"
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
              {isSubmitting ? 'Creating account...' : 'Create account'}
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-center text-sm text-foreground/60">
              You will continue to{' '}
              <span className="font-semibold text-foreground">{redirectTarget}</span> after registration.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

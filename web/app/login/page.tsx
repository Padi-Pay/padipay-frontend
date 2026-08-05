'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UnauthenticatedRoute } from '@/components/auth/UnauthenticatedRoute';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { TextInput } from '@/components/forms/TextInput';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { useGlobalStore } from '@/src/store/globalStore';
import { apiClient } from '@/src/lib/apiClient';
import { loginSchema, LoginFormData } from '@/lib/validations/auth.schema';
import { toast } from 'sonner';
import Link from 'next/link';
import { isAxiosError } from 'axios';

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

  const redirectTarget = useMemo(
    () => getSafeRedirectTarget(searchParams?.get('redirect')),
    [searchParams]
  );

  const sessionExpired = searchParams?.get('sessionExpired') === 'true';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await apiClient.post('/api/auth/login', data);
      const { token, user } = response.data.data;
      
      if (token && user) {
        useGlobalStore.getState().login(token);
        useGlobalStore.getState().setProfile(user);
        router.replace(redirectTarget);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError('password', { type: 'manual', message: 'Invalid credentials' });
        } else {
          toast.error(error.response?.data?.message || 'Login failed');
        }
      } else {
        toast.error('Login failed');
      }
    }
  };

  return (
    <AuthLayout
      marketingTitle="Sign in to PadiPay"
      marketingDescription="Continue into the privileged dashboard, review escrow activity, and pick up exactly where you left off."
      features={['Escrow operations', 'Wallet management', 'Session recovery']}
      containerClassName="bg-[radial-gradient(circle_at_top,rgba(22,163,74,0.08),transparent_42%),linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)]"
    >
      <h2 className="mb-2 text-2xl font-bold text-foreground">Welcome back</h2>
      <p className="mb-6 text-sm text-foreground/60">
        Authenticate to continue into your workspace.
      </p>

      {sessionExpired && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Your previous session expired. Please log in again.
        </div>
      )}

      <GoogleSignInButton redirectTarget={redirectTarget} />
      
      <div className="my-6 flex items-center text-sm text-foreground/40 before:mt-0.5 before:flex-1 before:border-t before:border-outline-variant after:mt-0.5 after:flex-1 after:border-t after:border-outline-variant">
        <span className="mx-4 text-xs uppercase tracking-wider font-medium">Or</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          label="Email"
          type="email"
          placeholder="ade@padipay.io"
          {...register('email')}
          error={errors.email?.message}
        />

        <PasswordInput
          label="Password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {isSubmitting ? 'Signing in...' : 'Continue to dashboard'}
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-4 text-center text-sm text-foreground/60">
          Don&apos;t have an account?{' '}
          <Link href={`/register?redirect=${encodeURIComponent(redirectTarget)}`} className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

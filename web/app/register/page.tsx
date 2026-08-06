'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UnauthenticatedRoute } from '@/components/auth/UnauthenticatedRoute';
import { AuthLayout } from '@/components/auth/AuthLayout';
// import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { TextInput } from '@/components/forms/TextInput';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { useGlobalStore } from '@/src/store/globalStore';
import { apiClient } from '@/src/lib/apiClient';
import { registerSchema, RegisterFormData } from '@/lib/validations/auth.schema';
import { toast } from 'sonner';
import Link from 'next/link';
import { isAxiosError } from 'axios';

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

  const redirectTarget = useMemo(
    () => getSafeRedirectTarget(searchParams?.get('redirect')),
    [searchParams]
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // 1. Register the user
      await apiClient.post('/api/auth/register', data);
      
      // 2. Automatically log them in since the backend register doesn't return a token
      const loginResponse = await apiClient.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { token, user } = loginResponse.data.data;
      
      if (token && user) {
        useGlobalStore.getState().login(token);
        useGlobalStore.getState().setProfile(user);
        router.replace(redirectTarget);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 409) {
          setError('email', { type: 'manual', message: error.response?.data?.message || 'Email already in use' });
        } else {
          toast.error(error.response?.data?.message || 'Registration failed');
        }
      } else {
        toast.error('Registration failed');
      }
    }
  };

  return (
    <AuthLayout
      marketingTitle="Create your account"
      marketingDescription="Join the secure workspace and get access to the dashboard tools used to manage escrow operations."
      features={['Dashboard access', 'Saved session state', 'Fast return redirects', 'Protected workflows']}
      containerClassName="bg-[radial-gradient(circle_at_top_left,rgba(232,95,129,0.08),transparent_40%),linear-gradient(180deg,#fffafc_0%,#eef5ff_100%)]"
    >
      <h2 className="mb-2 text-2xl font-bold text-foreground">Get started</h2>
      <p className="mb-6 text-sm text-foreground/60">
        Create a workspace account and continue to your requested destination.
      </p>

      {/* 
      <GoogleSignInButton redirectTarget={redirectTarget} />
      
      <div className="my-6 flex items-center text-sm text-foreground/40 before:mt-0.5 before:flex-1 before:border-t before:border-outline-variant after:mt-0.5 after:flex-1 after:border-t after:border-outline-variant">
        <span className="mx-4 text-xs uppercase tracking-wider font-medium">Or</span>
      </div>
      */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          label="Email"
          type="email"
          placeholder="new@padipay.io"
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
          {isSubmitting ? 'Creating account...' : 'Create account'}
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-4 text-center text-sm text-foreground/60">
          Already have an account?{' '}
          <Link href={`/login?redirect=${encodeURIComponent(redirectTarget)}`} className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

'use client';

import { ReactNode, Suspense, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { readPersistedAuthToken, useGlobalStore } from '@/src/store/globalStore';
import { toast } from 'sonner';
import { FeatureFlagName } from '@/lib/featureFlags.schema';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredFeatureFlag?: FeatureFlagName;
}

function ProtectedRouteInner({ children, requiredFeatureFlag }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const flags = useFeatureFlags();

  const isAuthenticated = useGlobalStore((state) => state.isAuthenticated);
  const isHydrated = useGlobalStore((state) => state.isHydrated);
  const sessionExpired = useGlobalStore((state) => state.sessionExpired);

  useEffect(() => {
    if (!isHydrated || sessionExpired) {
      return;
    }

    const persistedToken = readPersistedAuthToken();

    if (!isAuthenticated || !persistedToken) {
      if (isAuthenticated) {
        useGlobalStore.getState().logout();
      }
      const query = searchParams?.toString();
      const currentPath = query ? `${pathname}?${query}` : pathname;
      router.replace(`/login?redirect=${encodeURIComponent(currentPath || '/dashboard')}`);
      return;
    }

    if (requiredFeatureFlag && !flags[requiredFeatureFlag]) {
      toast.error('Feature Unavailable', {
        description: 'This feature is currently disabled or unavailable.',
      });
      router.replace('/dashboard');
      return;
    }
  }, [isAuthenticated, isHydrated, pathname, router, searchParams, sessionExpired, requiredFeatureFlag, flags]);

  if (!isHydrated || !isAuthenticated || sessionExpired) {
    return <div className="min-h-[40vh]" aria-hidden="true" />;
  }

  // Prevent flicker if feature flag rejects the route
  if (requiredFeatureFlag && !flags[requiredFeatureFlag]) {
    return <div className="min-h-[40vh]" aria-hidden="true" />;
  }

  return <>{children}</>;
}

export function ProtectedRoute({ children, requiredFeatureFlag }: ProtectedRouteProps) {
  return (
    <Suspense fallback={<div className="min-h-[40vh]" aria-hidden="true" />}>
      <ProtectedRouteInner requiredFeatureFlag={requiredFeatureFlag}>{children}</ProtectedRouteInner>
    </Suspense>
  );
}

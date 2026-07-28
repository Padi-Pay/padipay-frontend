'use client';

import { ReactNode, Suspense, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { readPersistedAuthToken, useGlobalStore } from '@/src/store/globalStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRouteInner({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
  }, [isAuthenticated, isHydrated, pathname, router, searchParams, sessionExpired]);

  if (!isHydrated || !isAuthenticated || sessionExpired) {
    return <div className="min-h-[40vh]" aria-hidden="true" />;
  }

  return <>{children}</>;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return (
    <Suspense fallback={<div className="min-h-[40vh]" aria-hidden="true" />}>
      <ProtectedRouteInner>{children}</ProtectedRouteInner>
    </Suspense>
  );
}

'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalStore } from '@/src/store/globalStore';

interface UnauthenticatedRouteProps {
  children: ReactNode;
}

export function UnauthenticatedRoute({ children }: UnauthenticatedRouteProps) {
  const router = useRouter();

  const isAuthenticated = useGlobalStore((state) => state.isAuthenticated);
  const isHydrated = useGlobalStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) {
      return;
    }

    router.replace('/dashboard');
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || isAuthenticated) {
    return <div className="min-h-[40vh]" aria-hidden="true" />;
  }

  return <>{children}</>;
}

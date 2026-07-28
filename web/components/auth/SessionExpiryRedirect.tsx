'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGlobalStore } from '@/src/store/globalStore';

export function SessionExpiryRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const handledRef = useRef(false);

  const sessionExpired = useGlobalStore((state) => state.sessionExpired);
  const isHydrated = useGlobalStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated || !sessionExpired || handledRef.current) {
      return;
    }

    handledRef.current = true;
    toast.error('Your session has expired. Please log in again.');
    useGlobalStore.getState().clearSessionExpired();
    const nextTarget =
      pathname?.startsWith('/login') || pathname?.startsWith('/register')
        ? '/login'
        : `/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`;

    router.replace(nextTarget);
  }, [isHydrated, pathname, router, sessionExpired]);

  useEffect(() => {
    if (!sessionExpired) {
      handledRef.current = false;
    }
  }, [sessionExpired]);

  return null;
}

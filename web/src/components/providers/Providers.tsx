'use client';

import React, { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { SessionExpiryRedirect } from '@/components/auth/SessionExpiryRedirect';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <Toaster position="top-right" richColors />
      <SessionExpiryRedirect />
      {children}
    </>
  );
}

'use client';

import React, { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { SessionExpiryRedirect } from '@/components/auth/SessionExpiryRedirect';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Toaster position="top-right" richColors />
      <SessionExpiryRedirect />
      {children}
    </GoogleOAuthProvider>
  );
}

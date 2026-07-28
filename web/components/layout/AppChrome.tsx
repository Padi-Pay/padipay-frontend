'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

interface AppChromeProps {
  children: ReactNode;
}

const HIDDEN_CHROME_PATHS = ['/login', '/register', '/403'];

function shouldHideChrome(pathname: string) {
  return pathname.startsWith('/dashboard') || HIDDEN_CHROME_PATHS.includes(pathname);
}

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname() || '/';
  const hideChrome = shouldHideChrome(pathname);

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

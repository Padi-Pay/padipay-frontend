import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent: boolean;
}

const LABEL_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  escrows: 'Escrows',
  create: 'Create Intent',
  wallet: 'Wallet',
  wallets: 'Wallets',
  settings: 'Settings',
  profile: 'Profile',
  login: 'Login',
  register: 'Register',
  403: 'Unauthorized',
  404: 'Not Found',
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function formatSegment(segment: string) {
  const mapped = LABEL_MAP[segment.toLowerCase()];

  if (mapped) {
    return mapped;
  }

  if (UUID_PATTERN.test(segment)) {
    return 'Details';
  }

  if (/^\d+$/.test(segment)) {
    return `#${segment}`;
  }

  return segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function useBreadcrumbs(pathnameOverride?: string) {
  const pathname = usePathname();

  return useMemo<BreadcrumbItem[]>(() => {
    const activePath = pathnameOverride ?? pathname ?? '/';
    const segments = activePath.split('/').filter(Boolean);

    if (segments.length === 0) {
      return [
        {
          label: 'Home',
          href: '/',
          isCurrent: true,
        },
      ];
    }

    const breadcrumbs: BreadcrumbItem[] = [];

    segments.forEach((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join('/')}`;
      const isCurrent = index === segments.length - 1;
      let label = formatSegment(segment);

      breadcrumbs.push({
        label,
        href,
        isCurrent,
      });
    });

    return breadcrumbs;
  }, [pathname, pathnameOverride]);
}

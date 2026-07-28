import type { Metadata } from 'next';
import { EmptyState } from '@/components/ui/EmptyState';

export const metadata: Metadata = {
  title: '403 Unauthorized | PadiPay',
  description: 'You do not have access to this area.',
};

function UnauthorizedIllustration() {
  return (
    <svg viewBox="0 0 520 420" className="h-full w-full" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="unauth-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#E85F81" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="440" height="340" rx="32" fill="url(#unauth-bg)" />
      <circle cx="260" cy="188" r="92" fill="#fff" fillOpacity="0.95" />
      <rect x="208" y="180" width="104" height="86" rx="18" fill="#16A34A" fillOpacity="0.16" />
      <path d="M228 180v-18c0-17 13.8-31 31-31s31 14 31 31v18" stroke="#16A34A" strokeWidth="14" strokeLinecap="round" />
      <path d="M260 214a16 16 0 1 0 0 32 16 16 0 0 0 0-32Z" fill="#16A34A" />
      <circle cx="372" cy="118" r="18" fill="#E85F81" fillOpacity="0.45" />
      <circle cx="148" cy="302" r="24" fill="#16A34A" fillOpacity="0.22" />
      <path d="M116 104l28 28M332 278l32 32" stroke="#94A3B8" strokeWidth="10" strokeLinecap="round" />
      <path d="M332 104l-28 28M180 266l-32 32" stroke="#94A3B8" strokeWidth="10" strokeLinecap="round" />
      <text x="260" y="334" textAnchor="middle" fill="#3E4A3D" fontSize="16" fontWeight="700" letterSpacing="4">
        UNAUTHORIZED
      </text>
    </svg>
  );
}

export default function ForbiddenPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <EmptyState
          eyebrow="403"
          title="Access restricted"
          description="This part of PadiPay is reserved for authenticated users. Sign in again to continue into the secure workspace."
          illustration={<UnauthorizedIllustration />}
          primaryAction={{ label: 'Return to Dashboard', href: '/dashboard' }}
          secondaryAction={{ label: 'Go Home', href: '/' }}
        />
      </div>
    </div>
  );
}

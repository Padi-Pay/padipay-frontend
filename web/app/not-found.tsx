import { EmptyState } from '@/components/ui/EmptyState';

function NotFoundIllustration() {
  return (
    <svg viewBox="0 0 520 420" className="h-full w-full" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="notfound-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="440" height="340" rx="32" fill="url(#notfound-bg)" />
      <path d="M136 262l72-82 62 58 58-72 66 88" stroke="#16A34A" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="178" cy="154" r="16" fill="#F59E0B" fillOpacity="0.65" />
      <circle cx="336" cy="118" r="24" fill="#E85F81" fillOpacity="0.25" />
      <path d="M384 282c0 28-26 50-58 50s-58-22-58-50 26-50 58-50 58 22 58 50Z" fill="#fff" fillOpacity="0.95" />
      <path d="M304 282h40" stroke="#16A34A" strokeWidth="14" strokeLinecap="round" />
      <path d="M324 262v40" stroke="#16A34A" strokeWidth="14" strokeLinecap="round" />
      <circle cx="264" cy="188" r="12" fill="#111C2D" fillOpacity="0.3" />
      <circle cx="360" cy="220" r="12" fill="#111C2D" fillOpacity="0.3" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <EmptyState
          eyebrow="404"
          title="Page not found"
          description="The route you requested does not exist, but the rest of the platform is still here. Head back home or return to the dashboard."
          illustration={<NotFoundIllustration />}
          primaryAction={{ label: 'Go Home', href: '/' }}
          secondaryAction={{ label: 'Return to Dashboard', href: '/dashboard' }}
        />
      </div>
    </div>
  );
}

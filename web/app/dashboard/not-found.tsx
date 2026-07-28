import { EmptyState } from '@/components/ui/EmptyState';

function DashboardNotFoundIllustration() {
  return (
    <svg viewBox="0 0 520 420" className="h-full w-full" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dashboard-notfound-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#111C2D" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="440" height="340" rx="32" fill="url(#dashboard-notfound-bg)" />
      <rect x="104" y="108" width="312" height="196" rx="24" fill="#fff" fillOpacity="0.95" />
      <rect x="128" y="136" width="120" height="22" rx="11" fill="#16A34A" fillOpacity="0.2" />
      <rect x="128" y="178" width="220" height="18" rx="9" fill="#CBD5E1" />
      <rect x="128" y="214" width="180" height="18" rx="9" fill="#CBD5E1" />
      <rect x="128" y="250" width="130" height="18" rx="9" fill="#CBD5E1" />
      <path d="M334 138l34 34m0-34-34 34" stroke="#E85F81" strokeWidth="10" strokeLinecap="round" />
      <circle cx="386" cy="272" r="34" fill="#16A34A" fillOpacity="0.15" />
      <path d="M364 272h44" stroke="#16A34A" strokeWidth="12" strokeLinecap="round" />
      <path d="M386 250v44" stroke="#16A34A" strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}

export default function DashboardNotFound() {
  return (
    <section className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
      <EmptyState
        eyebrow="404"
        title="Dashboard route not found"
        description="The secure shell is intact, but this nested dashboard route does not exist. Return to the dashboard overview to keep moving."
        illustration={<DashboardNotFoundIllustration />}
        primaryAction={{ label: 'Return to Dashboard', href: '/dashboard' }}
        secondaryAction={{ label: 'Go Home', href: '/' }}
      />
    </section>
  );
}

'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';

export function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={`${crumb.href}-${crumb.label}`} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 shrink-0 text-foreground/40" aria-hidden="true" />
              )}

              {isLast ? (
                <span
                  aria-current="page"
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="inline-flex items-center rounded-full px-3 py-1 font-medium text-foreground/65 transition-colors hover:bg-surface-container-high hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

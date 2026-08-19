import React from 'react';
import { Clock, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';

interface EscrowBadgeProps {
  status: string;
}

export function EscrowBadge({ status }: EscrowBadgeProps) {
  const normalizedStatus = status?.toUpperCase() || 'UNKNOWN';

  switch (normalizedStatus) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-status-pending-muted px-2 py-1 text-xs font-semibold text-status-pending-foreground border border-status-pending/20">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      );
    case 'FUNDED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-status-locked-muted px-2 py-1 text-xs font-semibold text-status-locked-foreground border border-status-locked/20">
          <ShieldCheck className="h-3 w-3" />
          Funded
        </span>
      );
    case 'LOCKED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-status-locked-muted px-2 py-1 text-xs font-semibold text-status-locked-foreground border border-status-locked/20">
          <ShieldCheck className="h-3 w-3" />
          Locked
        </span>
      );
    case 'RESOLVED':
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-status-resolved-muted px-2 py-1 text-xs font-semibold text-status-resolved-foreground border border-status-resolved/20">
          <CheckCircle2 className="h-3 w-3" />
          Resolved
        </span>
      );
    case 'CANCELED':
    case 'DISPUTED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive border border-destructive/20">
          <XCircle className="h-3 w-3" />
          {normalizedStatus.charAt(0) + normalizedStatus.slice(1).toLowerCase()}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-variant px-2 py-1 text-xs font-semibold text-foreground border border-outline-variant">
          <Clock className="h-3 w-3" />
          {normalizedStatus}
        </span>
      );
  }
}

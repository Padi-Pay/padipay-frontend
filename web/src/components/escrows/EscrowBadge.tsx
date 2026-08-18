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
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      );
    case 'FUNDED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
          <ShieldCheck className="h-3 w-3" />
          Funded
        </span>
      );
    case 'LOCKED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
          <ShieldCheck className="h-3 w-3" />
          Locked
        </span>
      );
    case 'RESOLVED':
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
          <CheckCircle2 className="h-3 w-3" />
          Resolved
        </span>
      );
    case 'CANCELED':
    case 'DISPUTED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
          <XCircle className="h-3 w-3" />
          {normalizedStatus.charAt(0) + normalizedStatus.slice(1).toLowerCase()}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
          <Clock className="h-3 w-3" />
          {normalizedStatus}
        </span>
      );
  }
}

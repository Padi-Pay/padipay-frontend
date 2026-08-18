'use client';

import React from 'react';
import { Check, Circle, Loader2 } from 'lucide-react';

interface EscrowTimelineProps {
  status: string; // e.g., 'PENDING', 'FUNDED', 'LOCKED', 'RESOLVED'
}

const steps = [
  { id: 'PENDING', label: 'Created', description: 'Intent created off-chain.' },
  { id: 'FUNDED', label: 'Funded', description: 'Funds submitted by buyer.' },
  { id: 'LOCKED', label: 'Locked (On-Chain)', description: 'Funds secured in smart contract.' },
  { id: 'RESOLVED', label: 'Resolved', description: 'Transaction completed.' },
];

export function EscrowTimeline({ status }: EscrowTimelineProps) {
  const normalizedStatus = status?.toUpperCase() || 'PENDING';
  let currentStepIndex = steps.findIndex(s => s.id === normalizedStatus);
  if (currentStepIndex === -1) currentStepIndex = 0;

  return (
    <div className="relative border-l-2 border-outline-variant/40 ml-4 py-2 space-y-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isActive = index === currentStepIndex;

        return (
          <div key={step.id} className="relative pl-8">
            <div className={`absolute -left-[11px] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ring-white ${
              isCompleted ? 'bg-primary text-white' :
              isActive ? 'bg-primary/20 text-primary border-2 border-primary' :
              'bg-surface-container border-2 border-outline-variant/60 text-foreground/40'
            }`}>
              {isCompleted ? (
                <Check className="h-3 w-3" />
              ) : isActive && normalizedStatus === 'FUNDED' && step.id === 'FUNDED' ? (
                 <Loader2 className="h-3 w-3 animate-spin text-primary" />
              ) : (
                <Circle className={`h-2 w-2 ${isActive ? 'fill-primary' : 'fill-transparent'}`} />
              )}
            </div>

            <div className="flex flex-col">
              <h4 className={`text-sm font-bold ${
                isActive ? 'text-primary' :
                isCompleted ? 'text-foreground' :
                'text-foreground/50'
              }`}>
                {step.label}
              </h4>
              <p className="mt-1 text-xs text-foreground/60">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

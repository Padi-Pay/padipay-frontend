'use client';

import React, { ReactNode } from 'react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { FeatureFlagName } from '@/lib/featureFlags.schema';

export interface FeatureGuardProps {
  flag: FeatureFlagName;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGuard({ flag, children, fallback = null }: FeatureGuardProps) {
  const flags = useFeatureFlags();

  if (flags[flag]) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

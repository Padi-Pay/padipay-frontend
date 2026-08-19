import { useContext } from 'react';
import { FeatureFlagContext } from '@/src/components/providers/FeatureFlagProvider';
import { FeatureFlags } from '@/lib/featureFlags.schema';

export function useFeatureFlags(): FeatureFlags {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
}

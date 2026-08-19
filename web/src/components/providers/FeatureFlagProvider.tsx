'use client';

import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { FeatureFlags, defaultFlags, FeatureFlagsSchema } from '@/lib/featureFlags.schema';

export const FeatureFlagContext = createContext<FeatureFlags>(defaultFlags);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);

  useEffect(() => {
    let currentFlags = { ...defaultFlags };

    // 1. Load overrides from localStorage
    const storedOverrides = localStorage.getItem('padipay_ff_overrides');
    let overrides: Partial<FeatureFlags> = {};
    if (storedOverrides) {
      try {
        overrides = JSON.parse(storedOverrides);
      } catch (e) {
        console.error('Failed to parse feature flag overrides from localStorage', e);
      }
    }

    // 2. Check for URL parameters
    const searchParams = new URLSearchParams(window.location.search);
    let urlOverridesChanged = false;

    for (const key of Object.keys(FeatureFlagsSchema.shape)) {
      const overrideKey = `padipay_ff_override_${key}`;
      if (searchParams.has(overrideKey)) {
        const val = searchParams.get(overrideKey);
        if (val === 'true') {
          overrides[key as keyof FeatureFlags] = true;
          urlOverridesChanged = true;
        } else if (val === 'false') {
          overrides[key as keyof FeatureFlags] = false;
          urlOverridesChanged = true;
        }
      }
    }

    if (urlOverridesChanged) {
      localStorage.setItem('padipay_ff_overrides', JSON.stringify(overrides));
    }

    currentFlags = { ...currentFlags, ...overrides };
    
    // Ensure final state strictly matches schema and fills defaults
    try {
      const finalFlags = FeatureFlagsSchema.parse(currentFlags);
      setFlags(finalFlags);
    } catch (e) {
      console.error('Failed to validate feature flags state:', e);
      setFlags(defaultFlags);
    }

    // 3. Expose dev helper globally
    (window as any).__clearFeatureFlags = () => {
      localStorage.removeItem('padipay_ff_overrides');
      console.log('Feature flag overrides cleared. Reload the page to apply defaults.');
    };
  }, []);

  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

import { z } from 'zod';

// Define all available flags using a strict Zod schema
export const FeatureFlagsSchema = z.object({
  ENABLE_FIAT_RAMP: z.boolean().default(false),
  NEW_ESCROW_WIZARD: z.boolean().default(false),
});

export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;
export type FeatureFlagName = keyof FeatureFlags;

// Parse the flags from the environment variable at startup
const parseEnvironmentFlags = (): FeatureFlags => {
  const envFlagsString = process.env.NEXT_PUBLIC_FLAGS || '{}';
  try {
    const rawFlags = JSON.parse(envFlagsString);
    return FeatureFlagsSchema.parse(rawFlags);
  } catch (error) {
    console.error('Failed to parse NEXT_PUBLIC_FLAGS:', error);
    // Fallback to defaults if parsing fails or environment config is malformed
    return FeatureFlagsSchema.parse({});
  }
};

export const defaultFlags = parseEnvironmentFlags();

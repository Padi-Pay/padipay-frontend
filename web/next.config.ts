import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default withSentryConfig(
  nextConfig,
  {
    silent: true,
    sourcemaps: {
      deleteSourcemapsAfterUpload: true,
    },
  }
);

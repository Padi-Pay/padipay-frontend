import * as Sentry from '@sentry/nextjs';
import type { Event } from '@sentry/nextjs';
import { scrubEventData } from './lib/telemetry/scrubber';

interface Integration {
  name: string;
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 0.1,
  debug: false,
  integrations: (integrations: Integration[]) => {
    return integrations.filter((integration: Integration) => {
      // Explicitly disable overly invasive integrations
      return integration.name !== 'CaptureConsole' && integration.name !== 'Replay';
    });
  },
  beforeSend: (event: Event) => {
    return scrubEventData(event);
  },
});

import * as Sentry from '@sentry/nextjs';
import { scrubEventData } from './lib/telemetry/scrubber';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 0.1,
  debug: false,
  integrations: (integrations) => {
    return integrations.filter((integration) => {
      // Explicitly disable overly invasive integrations
      return integration.name !== 'CaptureConsole' && integration.name !== 'Replay';
    });
  },
  beforeSend: (event) => {
    return scrubEventData(event);
  },
});

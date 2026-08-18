import { Event, Breadcrumb } from '@sentry/nextjs';

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'authorization',
  'cookie',
  'mnemonic',
  'privatekey',
];

const SENSITIVE_REGEX = new RegExp(SENSITIVE_KEYS.join('|'), 'i');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function scrubObject(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(scrubObject);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrubbed: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (SENSITIVE_REGEX.test(key)) {
        scrubbed[key] = '[REDACTED]';
      } else {
        scrubbed[key] = scrubObject(obj[key]);
      }
    }
  }
  return scrubbed;
}

export function scrubEventData(event: Event): Event {
  const scrubbedEvent = { ...event };

  if (scrubbedEvent.request) {
    if (scrubbedEvent.request.headers) {
      scrubbedEvent.request.headers = scrubObject(scrubbedEvent.request.headers);
    }
    if (scrubbedEvent.request.data) {
      if (typeof scrubbedEvent.request.data === 'string') {
        try {
          const parsed = JSON.parse(scrubbedEvent.request.data);
          scrubbedEvent.request.data = JSON.stringify(scrubObject(parsed));
        } catch {
          // If it's a string but not JSON, leave it or consider naive regex replace.
          // For now, we only scrub parsed JSON objects.
        }
      } else {
        scrubbedEvent.request.data = scrubObject(scrubbedEvent.request.data);
      }
    }
  }

  if (scrubbedEvent.breadcrumbs) {
    scrubbedEvent.breadcrumbs = scrubbedEvent.breadcrumbs.map((crumb: Breadcrumb) => ({
      ...crumb,
      data: crumb.data ? scrubObject(crumb.data) : crumb.data,
    }));
  }

  if (scrubbedEvent.extra) {
    scrubbedEvent.extra = scrubObject(scrubbedEvent.extra);
  }

  if (scrubbedEvent.contexts) {
    scrubbedEvent.contexts = scrubObject(scrubbedEvent.contexts);
  }

  return scrubbedEvent;
}

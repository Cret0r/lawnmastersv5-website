// Sentry server-side init. Loaded via instrumentation.ts on the Node runtime.
// No-ops until NEXT_PUBLIC_SENTRY_DSN is set (Vercel env vars + .env.local).
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  tracesSampleRate: 0.1,
})

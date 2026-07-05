// Sentry browser-side init. Next.js loads this automatically on the client.
// No-ops until NEXT_PUBLIC_SENTRY_DSN is set.
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  tracesSampleRate: 0.1,
  // Session replay is intentionally off — marketing site, keep the bundle lean.
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart

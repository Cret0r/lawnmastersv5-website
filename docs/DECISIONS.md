# Decision Log

> Significant decisions and WHY they were made. **Do not re-litigate or accidentally reverse these without new evidence and owner sign-off.** Reconstructed from HANDOFF.md, git history, and session records. Newest architecture-shaping decisions first is not the order — this is grouped by domain.

---

## Tooling & Build

### pnpm-only; package-lock.json deleted (session 7)
**Decision:** All dependency changes via `pnpm add` / `pnpm install`. `package-lock.json` was deleted.
**Why:** The repo had both lockfiles. Sentry was installed via npm (updated only package-lock.json); Vercel builds from pnpm-lock.yaml → production deploy failed with `ERR_PNPM_OUTDATED_LOCKFILE`. Two lockfiles guarantee eventual desync. pnpm also handles the React 19 peer-dep conflicts (vaul@0.9.9) without `--legacy-peer-deps`.
**Don't:** run `npm install` — it recreates package-lock.json and restarts the cycle.
**Related:** packages with install scripts need approval in `pnpm-workspace.yaml` → `allowBuilds`.

### TypeScript build enforcement re-enabled (session 7)
**Decision:** Removed `ignoreBuildErrors: true` from next.config.mjs.
**Why:** It existed solely to mask a hard compile failure in the orphaned route-planner tab. Once that was deleted and the two Supabase cookie callbacks were typed, `tsc --noEmit` was clean. Suppressing TS at build had already hidden a broken feature for months.
**Consequence:** a type error now FAILS the Vercel deploy. That is the point. Check build logs for type errors first when a deploy fails.

### route-planner-tab.tsx deleted, not finished (session 7)
**Decision:** Deleted `app/admin/route-planner-tab.tsx` outright.
**Why:** It was never rendered anywhere, imported a `./route-map` component that never existed, and called an `updateClientCoordinates` action that was never written. Finishing it meant building Leaflet integration, a geocoding pipeline, and a coordinates workflow for a feature nobody had prioritized — while its broken imports were the reason TS enforcement was off. It's recoverable from git history (`git log --all -- app/admin/route-planner-tab.tsx`) if the ops tooling need returns.

---

## Architecture & Integrations

### Custom cookie auth instead of Supabase Auth (session 1–2, hardened session 4)
**Decision:** Admin auth = static token in `SESSION_TOKEN` env var, compared against an `admin_session` cookie in both middleware and `lib/admin-auth.ts`. Supabase Auth is installed but unused (`lib/supabase/proxy.ts` is dead wiring).
**Why:** Single-admin business; Supabase Auth added complexity (user management, JWT plumbing, email flows) for exactly one user. Simplicity chosen deliberately. Hardened in session 4 to be fail-closed (`?? ""` — unset env vars make login impossible) after test-credential fallbacks were found.
**Trade-off accepted:** only one admin account; rotation = update Vercel env var + redeploy.
**If this ever changes:** the dead `authenticated`-role RLS policies were dropped in 005 — Supabase Auth adoption would need a full RLS redesign.

### Server actions individually auth-guarded (session 6)
**Decision:** Every admin server action starts with `if (!(await isAdminAuthenticated())) return ...` even though middleware already protects /admin.
**Why:** Next.js treats server actions as public HTTP endpoints; middleware coverage isn't a guarantee (Next had middleware-bypass CVEs at the time). Defense in depth.
**Rule:** never ship an admin server action without the guard.

### RLS scoped to service_role only (+anon INSERT on form tables) — 005 (session 6)
**Decision:** All tables: `service_role` full access; `anon` may INSERT into `quote_submissions`/`contact_messages` only. The `authenticated`-role policies from 003 were dropped.
**Why:** The original 001 policy had **no `to` clause**, which Postgres applies to ALL roles — anyone with the public anon key (it ships in the browser bundle) could read/update/delete every lead via the Supabase REST API. Critical PII leak. The app never relied on those policies (everything goes through the service-role client), so tightening broke nothing. The `authenticated` policies were dead weight that would become live if a Supabase-Auth JWT ever appeared.
**Rule for new tables:** always write `to service_role` explicitly; roleless policies are the original sin here. Follow the 005/006 pattern.

### Resend over Twilio for speed-to-lead (session 7)
**Decision:** Lead notifications are email via Resend's REST API, called with plain `fetch` (no SDK).
**Why:** Twilio SMS requires phone-number provisioning + A2P 10DLC registration (weeks, forms, fees) — Resend is a free-tier API key and a domain verification. No SDK keeps the dependency surface at zero. Fails soft by design: notification failure never blocks the lead insert.
**Revisit if:** owner wants true SMS push — Twilio A2P or a push-notification approach are the options.

### Sentry wired but dormant; no source-map upload (session 7)
**Decision:** Full @sentry/nextjs wiring (server/edge/client + global-error boundary), disabled until `NEXT_PUBLIC_SENTRY_DSN` exists; `withSentryConfig` deliberately NOT added.
**Why:** DSN requires an account only the owner can create. Source-map upload requires an auth token and slows builds — pointless until the DSN exists.

### Images unoptimized + sharp pre-generation (sessions 1, 6)
**Decision:** Keep `images: { unoptimized: true }`; solve hero weight with pre-generated variants (`scripts/generate-hero-images.mjs`) served via `<picture>`.
**Why:** unoptimized was v0-scaffold legacy; flipping it changes every image's serving path and has Vercel image-transform cost implications. The actual pain (2.6 MB hero on phones) was solved surgically with build-time variants. Full next/image optimization remains a possible future migration (docs/ROADMAP.md).

---

## Product & Content

### /summer built fresh; /spring-rush 308-redirected (session 6)
**Decision:** New campaign page at `/summer`; old `/spring-rush/page.tsx` deleted; permanent 308 redirect in next.config.mjs.
**Why:** Owner locked "/summer — new page" in SUMMER_CAMPAIGN_2026.md §10. The redirect (rather than deletion alone) preserves any printed QR codes / ad links pointing at the old URL. `lib/spring-rush-content.ts` keeps its legacy filename because the homepage still consumes `springRush` — renaming was churn without benefit.
**Don't:** remove the redirect while any old-campaign print material may circulate.

### "Licensed & Insured" removed everywhere (session 6)
**Decision:** Stripped from the /summer trust bar and from SUMMER_CAMPAIGN_2026.md (the doc line was edited too, so it can't be re-imported from spec).
**Why:** The claim is **not currently accurate** for the business. False advertising risk. Owner directive.
**Don't re-add** without explicit owner confirmation that licensing/insurance is in place.

### Business facts centralized in lib/business-info.ts (session 7)
**Decision:** Phone (33 hardcoded instances), cities (5 files), email (3 files), socials → one constants module.
**Why:** AGENTS.md itself documented the drift risk ("appears in ~12 places"). A phone/city change is now a one-file edit. The AGENTS.md owner-confirmation rules still apply to the VALUES; the module just ends the hunt for locations.

### Placeholder reviews stay until real ones exist; AggregateRating schema blocked
**Decision:** The 3 generic reviews remain (better than an empty section) but AggregateRating/star schema must NOT be added until real reviews replace them.
**Why:** Schema markup on fabricated reviews risks a Google manual action against the whole domain. Reviews are also the gating item for Local Services Ads.

### Cypress suite designed around the rate limiter
**Decision:** Exactly 2 real form submissions per suite run; all validation tests are client-side (`:invalid` assertions).
**Why:** `lib/rate-limit.ts` allows 3 requests/IP/15 min SHARED across both forms, and it counts requests BEFORE validation. A third server-hitting test would make the suite flaky against itself. Both submission tests also accept "Too many requests" as a pass for back-to-back local runs.

---

## Growth Strategy (from the session-9 growth analysis)

### Paid ads deprioritized — GBP + free local channels first
**Decision:** No Meta/Google Search spend now. Google Local Services Ads only after 10+ real reviews.
**Why:** (1) Route-density economics conflict with broad ad radius — ads generate scattered leads the model correctly refuses; (2) landing paid traffic on 3 placeholder reviews burns trust and money; (3) Google Business Profile + Nextdoor + yard signs + door hangers are free, unsaturated, and compound. LSA is the exception when triggered because it's pay-per-lead with a trust badge that substitutes for a thin review profile.
**Revisit trigger:** 10+ reviews AND unfilled route capacity.

### Review collection is never incentivized; referrals are
**Why:** Google prohibits incentivized reviews (profile-nuke risk). The incentive budget goes to the two-sided referral program instead, which is allowed and reinforces route density.

# Lawn Masters V5 — Architecture Reference

> Last full refresh: July 2026 (session 9) — reflects Sentry, Resend notifications, /summer campaign page, business-info constants, gallery system, SEO/city pages, pnpm migration, and TypeScript enforcement.
> Domain: lawnmastersv5.com | Location: Covington, GA | Phone: (407) 600-0301
> Deeper docs live in `/docs` — see `docs/README.md` for the index.

---

## 0. TECH STACK

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | React 19, Server + Client Components |
| Language | TypeScript 5 | **Errors FAIL the build** — `ignoreBuildErrors` was removed in session 7 |
| Package manager | **pnpm ONLY** | `package-lock.json` deleted after a lockfile desync broke a deploy. Never `npm install`. |
| Styling | Tailwind CSS v4 | Design tokens as CSS custom properties in `app/globals.css` |
| Component library | shadcn/ui (Radix UI) | Full library installed, most unused |
| Database | Supabase | PostgreSQL + RLS (service_role-scoped — see § 7) + Storage (gallery bucket) |
| Auth | Custom cookie session | NOT Supabase Auth — `SESSION_TOKEN` env var, fail-closed (see docs/DECISIONS.md) |
| Hosting | Vercel | Auto-deploys on push to GitHub `master` |
| Error tracking | Sentry (@sentry/nextjs) | No-op until `NEXT_PUBLIC_SENTRY_DSN` is set |
| Lead notifications | Resend REST API (plain fetch, no SDK) | `lib/notify.ts`; no-op until `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` set |
| Analytics | Vercel Analytics + Speed Insights | Injected in `app/layout.tsx` |
| Fonts | Inter (sans), DM Serif Display (serif) | Google Fonts via next/font |
| Icons | lucide-react | Standard throughout |
| Forms | Server Actions + useTransition | No API routes |
| Validation | Zod | `quoteSchema` + `contactSchema` in form actions |
| Rate limiting | In-memory (lib/rate-limit.ts) | 3 req/IP/15 min, shared across BOTH form actions |
| Images | `unoptimized: true` + sharp pre-generation | Hero variants via `scripts/generate-hero-images.mjs` + `<picture>` art direction |
| E2E testing | Cypress — **45 tests** | 9 specs; dev server must be running first |
| Linting | ESLint 9 flat config | `eslint.config.mjs` |

---

## 1. PROJECT STRUCTURE

```
landscaping-business-website/
│
├── app/
│   ├── layout.tsx                # Root layout: fonts, metadata, LocalBusiness JSON-LD, FloatingCTA, Analytics
│   ├── page.tsx                  # Homepage — campaign hero (responsive <picture>), pricing, reviews, portfolio
│   ├── globals.css               # Tailwind v4 + design tokens (the ACTIVE one; styles/globals.css is dead)
│   ├── global-error.tsx          # Root error boundary → Sentry captureException + branded fallback
│   ├── sitemap.ts                # Generated /sitemap.xml (static routes + city pages)
│   ├── robots.ts                 # Generated /robots.txt (disallows /admin)
│   │
│   ├── about/page.tsx            # /about — story, values, service area (cities from BUSINESS.cities)
│   ├── services/page.tsx         # /services — 7 services + ItemList Service JSON-LD
│   ├── gallery/page.tsx          # /gallery — DB-backed uploads FIRST, then hardcoded transformations
│   ├── contact/                  # /contact (CLIENT) — form → contact_messages + lead email
│   ├── quote/                    # /quote (CLIENT) — form → quote_submissions + lead email
│   ├── service-policies/page.tsx # /service-policies
│   ├── summer/page.tsx           # /summer — Summer Refresh 2026 campaign page (14 sections)
│   │                             #   (/spring-rush 308-redirects here via next.config.mjs)
│   ├── lawn-care/[city]/page.tsx # Per-city SEO pages (covington/conyers/oxford; data in lib/city-pages.ts)
│   │
│   └── admin/                    # /admin — protected dashboard
│       ├── page.tsx              # Server component; re-checks auth on top of middleware
│       ├── login/page.tsx        # Dark CSS-module login; inline "use server" loginAction
│       ├── actions.ts            # Quote/message mutations — ALL auth-guarded
│       ├── client-actions.ts     # Clients CRUD — ALL auth-guarded
│       ├── gallery-actions.ts    # Gallery upload/delete/list — ALL auth-guarded
│       ├── admin-tabs.tsx        # Tabs: Clients | Quotes | Messages | Gallery (CLIENT)
│       ├── clients-tab.tsx       # Recurring-client tracker (due dates, gate codes, hazards)
│       ├── gallery-tab.tsx       # Before/after photo upload UI (CLIENT)
│       ├── submission-actions.tsx / message-actions.tsx / sign-out-button.tsx
│       └── (route-planner-tab.tsx was DELETED in session 7 — see docs/DECISIONS.md)
│
├── components/
│   ├── navigation.tsx            # Fixed nav; offsets below announcement bar via --announcement-height (CLIENT)
│   ├── announcement-bar.tsx      # Dismissable promo bar; publishes its height as a CSS var (CLIENT)
│   ├── footer.tsx                # Footer — contact info from BUSINESS, links to city pages
│   ├── before-after-slider.tsx   # Drag/keyboard slider, role="slider", lazy-loaded imgs (CLIENT)
│   ├── floating-cta.tsx          # Mobile call/text bar (CLIENT)
│   ├── social-buttons.tsx        # WhatsApp/FB/IG/SMS cluster (CLIENT)
│   ├── review-card.tsx
│   ├── theme-provider.tsx        # next-themes (dark mode ready, unused)
│   └── ui/                       # shadcn/ui library
│
├── lib/
│   ├── business-info.ts          # ★ SINGLE SOURCE OF TRUTH: phone, email, cities, socials,
│   │                             #   smsHref()/whatsappHref() builders. Edit business facts HERE ONLY.
│   ├── spring-rush-content.ts    # Homepage campaign copy (springRush export) — pulls from business-info
│   ├── summer-content.ts         # /summer campaign copy (summerRefresh export) — pulls from business-info
│   ├── city-pages.ts             # Per-city landing page copy + getCityPage()
│   ├── reviews-data.ts           # Reviews array + Google review link (3 PLACEHOLDERS — replace with real)
│   ├── gallery.ts                # Public gallery reads (fails soft if migration 006 not run)
│   ├── notify.ts                 # Resend lead-notification email (fails soft if unconfigured)
│   ├── admin-auth.ts             # Cookie session: verify/create/destroy/check
│   ├── rate-limit.ts             # In-memory IP limiter — used by both form actions, do not remove
│   ├── utils.ts                  # cn()
│   └── supabase/
│       ├── admin.ts              # ★ Service-role client — used for ALL app DB access (bypasses RLS)
│       ├── client.ts / server.ts # Anon-key clients (browser / cookie-aware server) — mostly unused
│       └── proxy.ts              # Supabase-auth middleware helper — NOT wired up (app uses custom auth)
│
├── public/
│   ├── logo-color.png / logo-contrast.png   # DO NOT MODIFY (owner rule) — 1638×497
│   ├── hero/                     # Generated responsive hero variants (mobile/tablet/desktop ×2 images)
│   ├── hero-bg.jpg               # Homepage hero SOURCE (2.6 MB — never served directly anymore)
│   ├── hero-landscaping-lush-garden.jpg     # /summer + city hero source
│   ├── gallery/                  # 11 hardcoded before/after pairs
│   └── [misc hero/section images]
│
├── scripts/                      # See SCRIPTS.md + docs/sops/ for run instructions
│   ├── 001–004 *.sql             # Original table migrations (RLS superseded by 005)
│   ├── 005_fix_rls_scoping.sql   # SECURITY: scopes RLS to service_role (⚠️ verify run in Supabase)
│   ├── 006_create_gallery_items.sql  # Gallery table + storage bucket (⚠️ must run before gallery uploads)
│   ├── generate-hero-images.mjs  # sharp — regenerates public/hero/ variants
│   └── development|testing|monitoring|maintenance|automation/*.sh
│
├── cypress/e2e/                  # 9 specs, 45 tests (see § 8)
├── docs/                         # ★ Knowledge base: playbook, SOPs, decisions, gotchas, growth, roadmap, tooling
├── .claude/commands/close-session.md  # /close-session slash command (end-of-session doc sync)
├── middleware.ts                 # Edge protection for /admin/* (cookie vs SESSION_TOKEN)
├── next.config.mjs               # redirects (/spring-rush→/summer 308), headers, serverActions 20mb,
│                                 #   images.unoptimized — TS errors NOT suppressed anymore
├── instrumentation.ts / instrumentation-client.ts / sentry.*.config.ts   # Sentry wiring
├── pnpm-lock.yaml                # THE lockfile (package-lock.json intentionally deleted)
├── pnpm-workspace.yaml           # allowBuilds approvals: cypress, sharp, unrs-resolver, @sentry/cli
└── AGENTS.md / HANDOFF.md / SCRIPTS.md / README.md / SUMMER_CAMPAIGN_2026.md
```

---

## 2. ROUTES

| Route | Type | Notes |
|---|---|---|
| `/` | Server | Campaign hero (responsive `<picture>`, hero-bg variants), pricing, proof, reviews, portfolio |
| `/about` | Server | Cities rendered from `BUSINESS.cities` |
| `/services` | Server | 7 services + `ItemList` of `Service` JSON-LD |
| `/gallery` | Server (async) | Admin-uploaded items (Supabase) render above the hardcoded set; falls back silently |
| `/contact` | Client | Form → `contact_messages` + Resend lead email |
| `/quote` | Client | Form → `quote_submissions` + Resend lead email |
| `/service-policies` | Server | Policy sections |
| `/summer` | Server | Summer Refresh 2026 landing page — copy in `lib/summer-content.ts` |
| `/spring-rush` | — | **308 permanent redirect → /summer** (next.config.mjs). Keep while old QR/ad links may circulate |
| `/lawn-care/covington` `/conyers` `/oxford` | Server (SSG) | Local-SEO pages; unknown slugs 404; data in `lib/city-pages.ts` |
| `/sitemap.xml` `/robots.txt` | Generated | `app/sitemap.ts` / `app/robots.ts` |
| `/admin` | Server, protected | Tabs: Clients, Quote Requests, Contact Messages, Gallery |
| `/admin/login` | Server | Dark login; `type="text"` username field is intentional |

---

## 3. SECURITY MODEL

1. **Middleware** (`middleware.ts`): every `/admin/*` request (except login) requires `admin_session` cookie === `SESSION_TOKEN` env var. Fail-closed: unset token ⇒ nothing matches.
2. **Server actions**: EVERY admin action (`actions.ts`, `client-actions.ts`, `gallery-actions.ts`) independently checks `isAdminAuthenticated()` — defense in depth added in session 6 because Next.js treats server actions as public endpoints. **Never add an admin server action without this guard.**
3. **RLS**: all tables scoped to `service_role` only, plus `anon` INSERT on the two form tables (`005_fix_rls_scoping.sql`). The app itself always uses `createAdminClient()` (service key), so RLS is the backstop against direct REST-API access with the public anon key — that exact leak existed and was fixed in session 6.
4. **Credentials fail closed**: `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `SESSION_TOKEN` all use `?? ""` — unset env vars make login impossible rather than falling back.
5. **HTTP headers** (next.config.mjs): X-Frame-Options DENY, nosniff, HSTS, Referrer-Policy, Permissions-Policy.
6. Session cookie: httpOnly, secure in prod, sameSite lax, 24 h expiry.

---

## 4. DATA & INTEGRATIONS

### Supabase tables
| Table | Written by | Read by | RLS |
|---|---|---|---|
| `quote_submissions` | quote form action | /admin Quotes tab | service_role all + anon INSERT |
| `contact_messages` | contact form action | /admin Messages tab | service_role all + anon INSERT |
| `clients` | /admin Clients tab | /admin (due today / overdue / stats) | service_role only |
| `gallery_items` | /admin Gallery tab | /gallery public page | service_role only |
| Storage `gallery` bucket | gallery-actions upload | public CDN URLs | public-read bucket; uploads via service key |

### Form → lead flow
```
Client form → Server Action
  → isRateLimited(ip)          (3/IP/15min, shared across both forms)
  → Zod validation + tag-strip sanitize
  → createAdminClient().insert(...)
  → sendLeadNotification(...)  (Resend email to owner — fails soft)
  → { success } → client shows confirmation
```

### Sentry
- `instrumentation.ts` → `onRequestError` captures Server Component/Action errors
- `instrumentation-client.ts` → browser errors + router transitions
- `app/global-error.tsx` → render-crash boundary with branded fallback
- Everything no-ops until `NEXT_PUBLIC_SENTRY_DSN` exists. Source-map upload (withSentryConfig) intentionally NOT wired — needs an auth token first.

---

## 5. CONTENT ARCHITECTURE

**The hierarchy (edit at the highest applicable level):**

1. `lib/business-info.ts` — phone, email, cities, socials, sms/whatsapp builders. **The only place business facts live.** Owner-confirmation rules in AGENTS.md apply.
2. `lib/spring-rush-content.ts` (`springRush`) — homepage + announcement bar campaign copy, mowing pricing plans.
3. `lib/summer-content.ts` (`summerRefresh`) — everything on /summer.
4. `lib/city-pages.ts` — per-city landing copy.
5. `lib/reviews-data.ts` — reviews (⚠️ 3 placeholders) + Google review link.
6. `lib/gallery.ts` + DB — dynamic gallery items.

Pricing displayed: Biweekly $90*/mo · Weekly $120*/mo (highlighted) · One-time $45–55* · PW from $197* · Bed refresh from $300*. Asterisk = final price quoted on-site.

---

## 6. RESPONSIVE HERO IMAGE SYSTEM

Because `images.unoptimized` is on (v0 legacy + Vercel image-transform cost), next/image produces no srcset. Instead:

- `scripts/generate-hero-images.mjs` (sharp) renders each hero source into `public/hero/{name}-{mobile,tablet,desktop}.jpg` (828×1104 / 1536×1152 / 1920×1080, q72 mozjpeg, attention crop).
- Heroes render a `<picture>` with `max-width: 640px` / `1024px` sources and the desktop img as default (`fetchPriority="high"`).
- Result: homepage hero went 2.6 MB → 99 KB on phones.
- **When replacing a hero source image:** drop the new file in `public/`, re-run the script, commit `public/hero/`. See `docs/sops/hero-images.md`.

---

## 7. SEO LAYER

- Root JSON-LD (`app/layout.tsx`): `["LocalBusiness","HomeAndConstructionBusiness"]` with `@id: https://lawnmastersv5.com/#business` — city/service schema references this. (`LandscapeService` was removed — not a real schema.org type.)
- `/services`: `ItemList` of 7 `Service` objects, provider-linked to the business `@id`.
- City pages: `Service` schema with `areaServed` City + `Offer`s from the pricing plans; canonical URLs; `generateStaticParams`.
- `app/sitemap.ts` + `app/robots.ts` (admin disallowed).
- Footer links to city pages for crawlability.
- NOT yet done: AggregateRating (blocked on real reviews), FAQ schema, OG images — see docs/ROADMAP.md.

---

## 8. TESTING

**45 Cypress tests, 9 specs** — `npm run cypress:run` (dev server must already be running on :3000).

| Spec | Tests | Covers |
|---|---|---|
| admin.cy.ts | 5 | Login page smoke + redirect |
| admin-auth.cy.ts | 3 | Wrong creds rejected, forged cookie redirected, password masked |
| city-pages.cy.ts | 5 | 3 city pages + 404 + CTAs |
| contact.cy.ts | 5 | Fields + 1 REAL submission |
| form-validation.cy.ts | 6 | Client-side validation (never hits server) |
| homepage.cy.ts | 4 | Hero content + CTAs |
| mobile-nav.cy.ts | 5 | Hamburger aria states, drawer, outside-tap close, floating CTA |
| navigation.cy.ts | 5 | Desktop nav links |
| quote.cy.ts | 7 | Fields + 1 REAL submission |

**Hard constraint:** the suite makes exactly 2 real form submissions per run against a 3-per-IP-per-15-min rate limit. New tests must NOT add server-side submissions — assert client-side `:invalid` state instead.

---

## 9. ENVIRONMENT VARIABLES

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key (ships in browser by design) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Bypasses RLS — server-only, never expose |
| `SESSION_TOKEN` | Yes | Admin cookie value; rotate in Vercel + redeploy |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Yes | Admin login; fail-closed |
| `NEXT_PUBLIC_SENTRY_DSN` | Pending owner | Enables Sentry (currently no-op) |
| `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` | Pending owner | Enables speed-to-lead emails (currently no-op) |
| `LEAD_NOTIFY_FROM` | Optional | Verified Resend sender; defaults to onboarding@resend.dev |

Set in Vercel (Production + Preview). Note: `vercel env pull` returns sensitive values as EMPTY strings — see docs/GOTCHAS.md.

---

## 10. DEPLOYMENT

- Push to `master` → Vercel auto-deploys production. There is no staging environment — the merge-gate is the 45-test Cypress suite run locally.
- Build: `pnpm build` (TypeScript errors now fail it — that's intentional).
- DB migrations are MANUAL: paste `scripts/00X_*.sql` into Supabase SQL Editor (see docs/sops/database-migrations.md). Deploy order matters when code depends on schema: run SQL first, then push.
- Failed deploy recovery: docs/sops/failed-vercel-deploy.md.

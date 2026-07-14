# STACK MAP — The Entire Operation at a Glance

> "You use THIS for THIS." One line per fact, organized by layer. For each tool: what it is, what it does HERE, where it lives, how you access it, what it connects to.
> Last verified: July 2026 (session 10 — account ownership owner-confirmed; DNS delegation verified via nslookup). Deeper detail: ARCHITECTURE.md (technical), docs/TOOLING.md (commands), docs/sops/ (procedures).

---

## 1. HOSTING & DEPLOYMENT — Vercel

- **What:** Serverless Next.js hosting. THE production environment.
- **Used for:** Serves lawnmastersv5.com; runs all server actions/middleware; holds ALL production secrets as env vars.
- **Where:** vercel.com → team `cret0rs-projects` → project `lawnmastersv5-website`.
- **Access:** Owner's Vercel account — logs in via the owner's **GitHub account** (Google as fallback); CLI via `npx vercel` (device-code login; repo is `vercel link`ed).
- **How deploys work:** every push to GitHub `master` → automatic PRODUCTION deploy. No staging; preview deploys only if a non-master branch is pushed. Failed build ⇒ Vercel keeps serving the last good deploy. Rollback = dashboard → Deployments → promote a previous one.
- **Connects to:** GitHub (deploy trigger), the domain **and its entire DNS zone** (nameservers are delegated to Vercel — see § 4), Sentry/Resend/Supabase via env vars, Vercel Analytics + Speed Insights (built-in, wired in `app/layout.tsx`).
- **Quirks:** `vercel env pull` returns sensitive values as EMPTY strings — the dashboard is the only place to read secrets. TypeScript errors fail the build (intentional).

## 2. DATABASE — Supabase

- **What:** Hosted Postgres + Storage + auto REST API.
- **Used for:** Lead storage (`quote_submissions`, `contact_messages`), recurring-client CRM (`clients` — addresses, gate codes, hazards, due dates), gallery uploads (`gallery_items` + `gallery` storage bucket).
- **Where:** supabase.com dashboard → project "lawnmastersv5-website". Project URL is in `NEXT_PUBLIC_SUPABASE_URL`.
- **Access:** Owner's Supabase account — logs in via the owner's **GitHub account** (Google as fallback). The app accesses it exclusively through `lib/supabase/admin.ts` (service-role key, bypasses RLS).
- **RLS model:** every table `to service_role` only; `anon` may INSERT into the two form tables. RLS is the backstop against direct REST calls with the public anon key — a real leak existed and was closed+verified (005). New tables MUST follow the 005/006 pattern (docs/sops/database-migrations.md).
- **Migrations:** MANUAL — paste `scripts/00X_*.sql` into Dashboard → SQL Editor. Status ledger in docs/TOOLING.md § 1 (⚠️ 006 gallery pending as of writing).
- **Connects to:** Vercel (3 env vars), the admin dashboard at /admin, Resend flow (insert precedes the notification email).

## 3. SOURCE CONTROL — GitHub

- **What:** Git remote + deploy trigger.
- **Where:** github.com/Cret0r/lawnmastersv5-website — user `Cret0r`, default branch `master`.
- **Branch strategy:** work lands on `master` directly (which deploys!); feature branches used for risky work (pattern: `security/admin-authz-rls-fix` was merged with `--no-ff` after DB prep). Gate before any push: 45/45 Cypress + `tsc --noEmit`.
- **Connects to:** Vercel (push → deploy). No CI on GitHub yet (roadmap item — Actions for lint/tsc/cypress).

## 4. DOMAIN — lawnmastersv5.com

- **What:** The production domain, attached to the Vercel project. **Primary host = `www.lawnmastersv5.com`** (the apex 307-redirects to it); `BUSINESS.domain` in code is the www host so canonicals/schema/OG/sitemap match — GOTCHAS #33.
- **Registrar:** **Hostinger** (owner-confirmed) — handles registration and renewal ONLY.
- **DNS:** delegated to **Vercel's nameservers** (`ns1.vercel-dns.com` / `ns2.vercel-dns.com` — verified via nslookup, July 2026). **All DNS records are managed in the Vercel dashboard (project → Settings → Domains), NOT in Hostinger.** Practical consequence: when verifying lawnmastersv5.com as a Resend sending domain (or adding any TXT/MX/DKIM record), add the records in Vercel DNS — Hostinger's DNS panel has no effect while the nameservers point at Vercel.
- **History:** the domain was detached from an old V0 Vercel project in session 3 and assigned to the current project.
- **Connects to:** Vercel (serving + DNS), Hostinger (renewal — keep the registration from lapsing), Google Business Profile (website field), schema URLs (`https://lawnmastersv5.com/#business`), sitemap/robots.

## 5. ERROR TRACKING — Sentry

- **What:** @sentry/nextjs 10.x, fully wired, **currently DORMANT** (no DSN set).
- **Catches (once live):** server component/action errors (`instrumentation.ts` → `onRequestError`), browser errors + route transitions (`instrumentation-client.ts`), render crashes (`app/global-error.tsx` — also shows a branded call-us fallback).
- **Where:** sentry.io → **[owner must create the project; account doesn't exist yet]**.
- **Activate:** set `NEXT_PUBLIC_SENTRY_DSN` in Vercel + redeploy. Source-map upload deliberately not wired (needs auth token — docs/DECISIONS.md).

## 6. EMAIL / NOTIFICATIONS — Resend

- **What:** Transactional email API, called via plain `fetch` in `lib/notify.ts` (no SDK). **LIVE — `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` were added to Vercel on 7/6/2026 (owner-confirmed).**
- **The speed-to-lead flow:** quote or contact form submits → row inserted in Supabase → `sendLeadNotification()` emails the lead's full details + /admin link to `LEAD_NOTIFY_EMAIL` within seconds. Fails soft — email failure never blocks the lead.
- **Where:** resend.com (account under lawnmastersv5@gmail.com; the default onboarding sender only delivers to the account owner's address until lawnmastersv5.com is verified as a sending domain).
- **Remaining polish:** verify lawnmastersv5.com as a sending domain, then set optional `LEAD_NOTIFY_FROM` — the verification DNS records (TXT/DKIM) go into **Vercel DNS**, not Hostinger (see § 4).
- **Why Resend not Twilio:** docs/DECISIONS.md (no phone provisioning/A2P registration; free tier; zero deps).

## 7. PAYMENTS — Zelle (off-site only)

- **What:** Peer-to-peer bank transfer the business collects with.
- **In this project:** **ZERO code integration** — no Zelle/payment references exist anywhere in the site. Payment is a manual business process: per SUMMER_CAMPAIGN_2026.md § 4, the owner texts a Zelle payment request on Day 1 after a job. The website's job ends at lead capture.
- **If payments ever come on-site:** that's a new architecture decision (Stripe et al.), not a small edit.

## 8. ANALYTICS — Vercel Analytics + Speed Insights

- **What:** `@vercel/analytics` + `@vercel/speed-insights`, injected in `app/layout.tsx`.
- **Used for:** page views/traffic + Core Web Vitals. NO conversion/goal tracking yet (roadmap: form-submission events).
- **Where:** Vercel dashboard → project → Analytics / Speed Insights tabs.
- **Nothing else installed** — no GA4, no Meta pixel, no tag manager.

## 9. MARKETING — Google Business Profile & the SEO layer

- **GBP:** live and approved (Georgia/Covington profile). Managed at business.google.com under **successblueprint90@gmail.com** (owner-confirmed). ⚠️ **The SAME Google account also owns the older Orlando/Florida profile** — when copying review links, posting, or editing, always confirm you're on the GEORGIA listing. This exact mixup already happened once: the site shipped with the Florida profile's review link until July 2026 (fixed — see GOTCHAS #30). THE #1 growth lever (docs/GROWTH.md).
- **Ties to the site:** `lib/reviews-data.ts` → `googleReviewLink` (`https://share.google/AM7DCDpim0yALiqCR`) powers the homepage "Leave Us a Google Review" button — the ONLY review CTA in the codebase; root JSON-LD in `app/layout.tsx` describes the same business entity; sitemap at /sitemap.xml for Search Console **[Search Console not yet verified — roadmap]**.
- **Social:** Instagram @lawnmasters_v5, Facebook page id 61590265813532 — linked from `components/social-buttons.tsx` + schema `sameAs`, both from `lib/business-info.ts`. WhatsApp/SMS deep links generated by `smsHref()`/`whatsappHref()`.
- **Campaign assets:** SUMMER_CAMPAIGN_2026.md (door hangers, Instagram plan, follow-up scripts) + /summer landing page (QR/ad target; /spring-rush 308s to it).

## 10. LOCAL DEV ENVIRONMENT

- **Machine:** Windows 11, project at `C:\Users\LAWN MASTERS V5\Documents\Lawn Masters V5\landscaping-business-website`. Editor: VS Code (Claude Code IDE extension present).
- **Shell:** PowerShell 5.1 primary (no `&&` — use `;` / `if ($?)`); Git Bash available.
- **Run it:** `npm run dev` → localhost:3000. Preflight check: `bash scripts/development/dev-verify.sh`. Local secrets in `.env.local` (gitignored; recreate from Vercel dashboard values).
- **Package manager: pnpm ONLY** (`pnpm add`) — see docs/GOTCHAS.md #4–5. Node 24.x; `npm run <script>` is fine for RUNNING scripts.
- **Bun:** required ONLY by claude-mem's worker, not the website (`~/.bun/bin/bun.exe`).
- **Norton 360:** three known interference modes (SSL scanning breaks Claude Code API + claude-mem; "AI Agent Protection" can block file writes) — exceptions must stay configured; docs/GOTCHAS.md #1–3.
- **Testing:** Cypress 15 — dev server first, then `npm run cypress:run`; 45 tests; max 2 real form submissions/run (rate limiter).

## 11. AI TOOLING

- **Claude Code** — primary development agent; rules in AGENTS.md (via CLAUDE.md), knowledge base in /docs. Owner switches models with `/model` (Fable 5 default).
- **claude-mem** (thedotmack plugin) — cross-session memory: Bun worker + SQLite; injects context at session start; `/claude-mem:mem-search` etc. Fragile parts + recovery: docs/sops/claude-mem-troubleshooting.md. Reliable fallback for history: HANDOFF.md + git log.
- **Custom command:** `/close-session` — end-of-session doc sync (SOP: closing-a-session.md).
- **Project skills** (`.claude/skills/`): security-sweep, safe-setup, planner, honest-advisor, bug-hunter — encode how work is done here; inventory in docs/TOOLING.md § 2.
- **hormozi-skills** — 17 offer/marketing framework commands + orchestrator agent; use for business strategy, not code (inventory in docs/TOOLING.md § 2).
- **Vercel plugin** — `/vercel:status`, `/vercel:env`, deploy-debugging knowledge skills.

## 12. KEY FILES — single sources of truth

| File | Governs |
|---|---|
| `lib/business-info.ts` | Phone, email, cities, socials, sms/WhatsApp link builders — ALL business facts |
| `lib/spring-rush-content.ts` | Homepage + announcement-bar campaign copy, mowing pricing plans |
| `lib/summer-content.ts` | Everything on /summer |
| `lib/city-pages.ts` | Per-city landing pages (add a city = add an entry) |
| `lib/reviews-data.ts` | Reviews (⚠️ 3 placeholders) + the Google review link |
| `next.config.mjs` | Redirects (/spring-rush→/summer), security headers, 20mb server-action limit, images.unoptimized |
| `pnpm-workspace.yaml` | Install-script approvals (allowBuilds) |
| `middleware.ts` + `lib/admin-auth.ts` | The entire admin auth model |
| `.claude/commands/close-session.md` | The /close-session procedure |
| AGENTS.md | The rules (owner-locked values, always/never lists) |

## 13. ENV VARIABLES (names only — never commit values)

| Variable | For | Set where |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Vercel (Prod+Preview) + .env.local |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key (browser-safe by design) | Vercel + .env.local |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key; bypasses RLS — the app's actual DB credential | Vercel + .env.local |
| `SESSION_TOKEN` | Admin cookie value; rotate = update + redeploy | Vercel + .env.local |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin login (fail-closed if unset) | Vercel + .env.local |
| `NEXT_PUBLIC_SENTRY_DSN` | Enables Sentry (unset = dormant) | Vercel — ⚠️ not yet set |
| `RESEND_API_KEY` | Enables lead emails | Vercel — ✅ set 7/6/2026 |
| `LEAD_NOTIFY_EMAIL` | Where lead alerts go | Vercel — ✅ set 7/6/2026 |
| `LEAD_NOTIFY_FROM` | Optional verified sender | Vercel — optional |
| `NODE_ENV` | Auto; controls cookie `secure` flag | automatic |

## 14. INSTALLED-BUT-NOTABLE (know these exist)

- `leaflet` / `react-leaflet` / `@types/leaflet` — orphaned since the route-planner deletion; removal candidates (roadmap).
- `package.json` name is still `my-v0-project` — v0.dev scaffold leftover, cosmetic.
- `recharts`, `react-hook-form`, most Radix/shadcn components — installed, largely unused; available if needed.
- `styles/globals.css` — dead duplicate; `app/globals.css` is live.

---

## COLD START — sit down today, in this order

1. **Read** AGENTS.md (the rules — 5 min), then this file, then docs/GOTCHAS.md headlines.
2. **Access check** — can you reach: GitHub repo (Cret0r/lawnmastersv5-website — the keystone: it also logs you into Vercel and Supabase), Vercel dashboard (cret0rs-projects), Supabase dashboard, GBP (successblueprint90@gmail.com), Hostinger (domain renewal only — DNS lives in Vercel).
3. **Local boot:** clone → `pnpm install` → get env values from Vercel dashboard into `.env.local` → `npm run dev` → localhost:3000 loads.
4. **Verify the safety net:** `npx tsc --noEmit` clean → `npm run cypress:run` = 45/45 (dev server running first).
5. **Know the blast radius:** any push to `master` IS a production deploy. DB changes are manual SQL in Supabase, run BEFORE pushing dependent code.
6. **Check state:** HANDOFF.md (latest session + open items) and docs/ROADMAP.md (what's pending; the 🔴 table is what's blocking already-shipped features).
7. **Business context** when needed: docs/BUSINESS_PLAYBOOK.md (pitch-ready) and docs/GROWTH.md (strategy + the two strategic truths).
8. **End every session** with `/close-session`.

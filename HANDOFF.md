# Lawn Masters V5 Website — AI Handoff Document
> Last updated: June 27, 2026 (session 3)
> Rule: Update this document at the end of every session before pushing.

---

## Project Overview

Production marketing website for **Lawn Masters V5 INC**, a lawn care and landscaping company relocating from Florida to **Covington, GA**. The site captures leads via a quote request form and a contact form. All submissions are stored in Supabase and managed through a protected admin dashboard at `/admin`.

- **Live URL:** lawnmastersv5.com
- **GitHub:** github.com/Cret0r/lawnmastersv5-website (branch: `master`)
- **Hosting:** Vercel (auto-deploys on push to `master`)
- **Database:** Supabase (PostgreSQL + Row Level Security)

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | React 19, Server + Client components |
| Language | TypeScript 5 | Build errors suppressed — fix anyway |
| Styling | Tailwind CSS v4 | CSS custom properties, no tailwind.config.ts needed |
| Component lib | shadcn/ui (Radix UI) | Full library installed, most unused |
| Database | Supabase | PostgreSQL + RLS policies |
| Auth | Custom cookie session | NOT Supabase Auth — env var credentials only |
| Hosting | Vercel | Auto-deploy from GitHub master |
| Analytics | Vercel Analytics | Injected in app/layout.tsx |
| Fonts | Inter (sans), DM Serif Display (serif) | Google Fonts via next/font |
| Icons | lucide-react | Standard throughout site |
| Forms | Server Actions + useTransition | No API routes — see app/contact/actions.ts |
| Custom CSS | CSS Modules | Used for admin login + admin nav button |
| Form Validation | Zod | quoteSchema + contactSchema in both form Server Actions |
| Rate Limiting | In-memory (lib/rate-limit.ts) | 3 requests/IP/15 min on both form actions |
| E2E Testing | Cypress | 26/26 tests passing — `npm run cypress:run` |
| Performance | Vercel Speed Insights | `<SpeedInsights />` in app/layout.tsx |

---

## Architecture Patterns

### Server vs Client Split
- **Server Components (default):** All page.tsx files except /contact and /quote
- **Client Components (`"use client"`):** navigation, announcement-bar, before-after-slider, floating-cta, social-buttons, contact/page.tsx, quote/page.tsx, all admin/*-actions.tsx files
- **Server Actions:** app/contact/actions.ts, app/quote/actions.ts, app/admin/actions.ts

### Content Centralization
**`lib/spring-rush-content.ts` is the master content file.** All campaign copy (announcement bar, hero headlines, pricing, guarantee, referral, service area text, CTA links) lives here. Homepage and /spring-rush page both pull from it. Update this file first for any campaign changes.

**`lib/reviews-data.ts`** is the master reviews file. Add/edit customer reviews here.

### Admin Authentication
- Custom cookie-based session — NOT Supabase Auth
- Credentials set via `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars
- Defaults (insecure): `admin@test.com` / `test123456` — **must override in Vercel**
- Cookie: `admin_session = "lm5-admin-authenticated-2026"`, expires 24hrs, httpOnly
- Token checked in TWO places: `middleware.ts` AND `lib/admin-auth.ts` — update both if changing
- Login page uses `type="text"` (not email) — accepts any string as username

### Forms → Database Flow
```
Client Component form
  → Server Action (app/*/actions.ts)
    → IP rate limit check (lib/rate-limit.ts — 3 req/IP/15 min)
    → Zod schema validation (quoteSchema / contactSchema)
    → try { createAdminClient() } catch → return { error: "Something went wrong..." }
    → Supabase insert into quote_submissions or contact_messages
      → Admin sees it at /admin dashboard
```
> The `createAdminClient()` call is wrapped in try/catch because it throws `supabaseUrl is required` when `.env.local` is not configured. Without the catch, the Server Action throws instead of returning, and the form silently hangs in a pending state with no user feedback.

### CSS Modules
Used for components that need styles outside Tailwind's scope:
- `app/admin/login/login.module.css` — dark #171717 admin login form
- `components/admin-nav-button.module.css` — green outline admin button in nav

---

## File Structure

```
app/
  layout.tsx              Root layout — Schema.org JSON-LD, fonts, FloatingCTA, Analytics
  page.tsx                Homepage (Server Component)
  globals.css             Tailwind v4 + design tokens (CSS custom properties)
  about/page.tsx          /about
  services/page.tsx       /services
  gallery/page.tsx        /gallery
  contact/
    page.tsx              /contact (CLIENT)
    actions.ts            Server Action → contact_messages table
    layout.tsx
  quote/
    page.tsx              /quote (CLIENT)
    actions.ts            Server Action → quote_submissions table
    layout.tsx
  service-policies/page.tsx   /service-policies
  spring-rush/page.tsx    /spring-rush — Summer Special campaign landing page
  admin/
    page.tsx              /admin — Protected dashboard (Server Component)
    login/
      page.tsx            /admin/login — Dark themed login form
      login.module.css    CSS module for login form styling
    actions.ts            update status, delete, mark-read, sign-out
    admin-tabs.tsx        Tab switcher (CLIENT)
    submission-actions.tsx  Quote status buttons (CLIENT)
    message-actions.tsx   Message read/delete buttons (CLIENT)
    sign-out-button.tsx   Sign out (CLIENT)
    clients-tab.tsx       Clients tab with Leaflet map
    route-planner-tab.tsx Route planning (Leaflet)
    client-actions.ts

components/
  navigation.tsx          Fixed top nav, scroll-aware, mobile drawer (CLIENT)
  footer.tsx              Site footer — logo, links, contact info, social buttons
  announcement-bar.tsx    Dismissable top promo bar (CLIENT) — pulls from spring-rush-content.ts
  before-after-slider.tsx Drag-to-reveal image comparison (CLIENT)
  floating-cta.tsx        Mobile-only fixed bottom Call+Text bar (CLIENT)
  review-card.tsx         Customer review card
  social-buttons.tsx      WhatsApp/FB/IG/SMS 2x2 button cluster (CLIENT)
  theme-provider.tsx      next-themes (dark mode ready, not yet enabled)
  admin-nav-button.module.css  CSS module for admin nav button
  ui/                     Full shadcn/ui library (60+ components, most unused)

lib/
  spring-rush-content.ts  MASTER CONTENT — all campaign copy, pricing, CTAs
  reviews-data.ts         Customer reviews array + Google review link
  admin-auth.ts           Cookie session: verify, create, destroy, check
  utils.ts                cn() Tailwind merge utility
  rate-limit.ts           In-memory IP rate limiter (3 req/IP/15 min) — used by both form actions
  supabase/
    client.ts             Browser client (anon key)
    server.ts             Server client (anon key, cookie-aware)
    admin.ts              Admin client (service role key, bypasses RLS)
    proxy.ts              Proxy config

public/
  logo-color.png          Color logo — scrolled nav (DO NOT MODIFY)
  logo-contrast.png       White logo — dark nav + footer (DO NOT MODIFY)
  hero-lawn-care-new.jpg  Homepage Spring Rush hero bg
  hero-landscaping-lush-garden.jpg  Secondary hero
  backyard-transformation-complete.jpg  Featured portfolio
  [+ 10 other hero/section images]
  gallery/                11 before/after image pairs (22 files)

scripts/
  001_create_submissions.sql  Creates quote_submissions table + RLS ✅ run
  002_create_admin_user.sql   Creates Supabase Auth user (NOT used by login system — skip)
  003_fix_admin_rls.sql       Adds authenticated user read/update/delete policies ✅ run
  004_create_contact_messages.sql  Creates contact_messages table + RLS ✅ run
  development/quick-start.sh
  development/dev-verify.sh
  testing/verify-build.sh
  monitoring/quick-health-check.sh
  maintenance/code-quality.sh
  automation/documentation-generator.sh

cypress/
  e2e/                    End-to-end tests (admin, contact, homepage, navigation, quote)
  support/e2e.ts          Exception handler for hydration + Supabase errors
cypress.config.ts         Cypress config (baseUrl: localhost:3000)

middleware.ts             Edge middleware — protects /admin/* routes
next.config.mjs           TypeScript error bypass, images unoptimized
ARCHITECTURE.md           Full technical reference
AGENTS.md                 AI agent rules and instructions
HANDOFF.md                This file
CLAUDE.md                 Points to AGENTS.md
```

---

## Pages / Routes — Current Status

| Route | File | Type | Status | Notes |
|---|---|---|---|---|
| `/` | app/page.tsx | Server | ✅ Working | Summer Special hero + full marketing page |
| `/about` | app/about/page.tsx | Server | ✅ Working | Story, values, service area |
| `/services` | app/services/page.tsx | Server | ✅ Working | 7 services with feature lists |
| `/gallery` | app/gallery/page.tsx | Server | ✅ Working | 12 before/after sliders |
| `/contact` | app/contact/page.tsx | Client | ✅ Working | Form saves to contact_messages table |
| `/quote` | app/quote/page.tsx | Client | ✅ Working | Form saves to quote_submissions table |
| `/service-policies` | app/service-policies/page.tsx | Server | ✅ Working | 6 policy sections |
| `/spring-rush` | app/spring-rush/page.tsx | Server | ✅ Working | Summer Special campaign page, URL still `/spring-rush` |
| `/admin` | app/admin/page.tsx | Server | ✅ Working | Protected; shows quote + message submissions |
| `/admin/login` | app/admin/login/page.tsx | Server | ✅ Working | Dark themed login, text field (not email), CSS module |

---

## To-Do List
> **Rule:** Update this list at the end of every session.

### DONE ✅
- Migrated all location references: Florida → Covington, GA
- Updated phone number to (407) 600-0301 across all ~12 locations
- Updated campaign name: Spring Rush → Summer Special
- Added Schema.org structured data in app/layout.tsx
- Added Next.js metadata exports to all pages
- Git repo initialized, connected to GitHub (Cret0r/lawnmastersv5-website)
- Created Supabase SQL scripts (001_create_submissions, 002_create_admin_user, 003_fix_admin_rls)
- Redesigned admin login page — dark #171717 CSS module theme
- Changed admin login field from `type="email"` to `type="text"`
- Added Admin button to navigation (green outline, matches Free Estimate button size)
- Created ARCHITECTURE.md — full technical reference
- Created AGENTS.md — AI agent rules
- Created CLAUDE.md — points to AGENTS.md
- Created HANDOFF.md — this file
- Created 6 shell scripts in /scripts subfolders
- Installed claude-mem
- Pushed all code to GitHub (lawnmastersv5-website, master branch)
- **[Session 2]** Created Supabase project (lawnmastersv5-website)
- **[Session 2]** Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY in Vercel
- **[Session 2]** Set ADMIN_EMAIL and ADMIN_PASSWORD to real credentials in Vercel
- **[Session 2]** Ran SQL scripts 001, 003, 004 in Supabase SQL Editor
- **[Session 2]** quote_submissions and contact_messages tables created with RLS
- **[Session 2]** Admin login working on live site with custom credentials
- **[Session 2]** Quote and contact forms working end-to-end on live site
- **[Session 2]** Created scripts/004_create_contact_messages.sql
- **[Session 2]** Added detailed Supabase error logging to app/contact/actions.ts
- **[Session 2]** Created SUMMER_CAMPAIGN_2026.md — initial campaign planning doc
- **[Session 3]** SUMMER_CAMPAIGN_2026.md fully updated with Hormozi framework analysis
- **[Session 3]** output/HORMOZI_SUMMER_OFFER.md created — 10 Hormozi skills run against the campaign
- **[Session 3]** Cypress E2E test suite — 26/26 tests passing (admin, contact, homepage, navigation, quote)
- **[Session 3]** Zod schema validation added to app/quote/actions.ts and app/contact/actions.ts
- **[Session 3]** Vercel Speed Insights added to app/layout.tsx
- **[Session 3]** In-memory IP rate limiting (lib/rate-limit.ts) — 3 req/IP/15 min on both form actions
- **[Session 3]** README.md created with badges, changelog, roadmap, branch workflow docs
- **[Session 3]** Gallery "15+ years" bug fixed to "5+" (app/gallery/page.tsx)
- **[Session 3]** lawnmastersv5.com domain removed from old V0 Vercel project
- **[Session 3]** hormozi-skills cloned and installed into Claude Code

### IN PROGRESS 🔵
- **Summer 2026 campaign** — SUMMER_CAMPAIGN_2026.md fully updated with Hormozi analysis
  - Dual strategy: lead with high-ticket services (pressure washing, landscaping installs) → convert to recurring mowing
  - Hormozi insights applied: satisfaction guarantee, Summer Starter Cut bonus, scarcity messaging, neighborhood-specific door hangers, bilingual Instagram strategy
  - Next step: build the summer landing page at /spring-rush using the 14-section structure in SUMMER_CAMPAIGN_2026.md

### MEDIUM PRIORITY 🟡
- Add real customer reviews to lib/reviews-data.ts (currently 3 placeholder entries)
- Update Google Review link in lib/reviews-data.ts to actual business Google My Business URL
- Consider enabling image optimization: remove `unoptimized: true` from next.config.mjs after compressing image files
- Add admin link to mobile nav drawer (currently admin button only shows on desktop `md:` breakpoint)

---

## Known Bugs

| Bug | File | Severity | Fix |
|---|---|---|---|
| TypeScript errors silently ignored at build | next.config.mjs | Low | `ignoreBuildErrors: true` — don't rely on this |

---

## UI Design System

### Colors (CSS custom properties — oklch)

| Token | oklch value | Hex approx | Use |
|---|---|---|---|
| `--primary` | `oklch(0.45 0.12 145)` | ~#2d7a3a | Brand green — buttons, icons, borders, accents |
| `--primary-foreground` | `oklch(0.99 0 0)` | ~#fefefe | White — text on green |
| `--background` | `oklch(0.97 0.005 90)` | ~#f8f7f3 | Warm off-white page background |
| `--foreground` | `oklch(0.20 0.02 50)` | ~#2a2520 | Near black — body text + dark sections |
| `--secondary` | `oklch(0.92 0.01 90)` | ~#ebebea | Light warm gray — alternating section bg |
| `--card` | `oklch(0.99 0.003 90)` | ~#fefefe | Almost white — card backgrounds |
| `--muted-foreground` | `oklch(0.50 0.015 50)` | ~#7a7673 | Medium gray — secondary/helper text |
| `--accent` | `oklch(0.55 0.10 55)` | ~#b07a30 | Warm amber — available, not used in UI yet |
| `--destructive` | `oklch(0.577 0.245 27.325)` | ~#e03030 | Red — errors, required markers |
| `--border` | `oklch(0.88 0.01 90)` | ~#e2e1dd | Light warm gray — borders, dividers |
| `--radius` | `0.625rem` | 10px | Default border radius |

### Typography

| Role | Class | Font |
|---|---|---|
| Headings h1–h3 | `font-serif` | DM Serif Display (400 weight only) |
| Body / UI / labels | `font-sans` | Inter |
| Eyebrow labels | `text-sm uppercase tracking-wider font-semibold text-primary` | Inter |
| Page h1 | `text-4xl sm:text-5xl md:text-6xl font-serif` | DM Serif Display |
| Section h2 | `text-3xl sm:text-4xl md:text-5xl font-serif` | DM Serif Display |
| Card h3 | `text-lg sm:text-xl font-semibold` | Inter |

### Button Patterns (Tailwind classes)

```tsx
// Primary — solid green (use on light/white backgrounds)
className="bg-primary hover:bg-primary/90 text-primary-foreground"

// Outline green (use on light backgrounds)
className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"

// Outline light (use on DARK/hero image backgrounds)
className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"

// Inverted (use on green bg sections like bg-primary CTAs)
className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
```

Button default size (shadcn): `h-9 px-4 py-2` (or `px-3` when containing SVG), `rounded-md`, `text-sm font-medium`

### Section Background Pattern
Sections alternate in this order: `bg-background` → `bg-secondary` → `bg-primary` (CTA) → `bg-foreground` (dark CTA)

### Custom CSS Components
- **Admin login form:** `app/admin/login/login.module.css` — dark #171717, rounded-25px card, inset-shadow fields, hover scale
- **Admin nav button:** `components/admin-nav-button.module.css` — green outline, glow on hover, matches Free Estimate button dimensions (h-9, px-3, rounded-md, text-sm)

### Animation
- `animate-fade-in-up` — 0.6s ease-out, cards stagger with `animationDelay: index * 80ms`
- All `[data-slot="button"]` elements: letter-spacing expand + green box shadow on hover

---

## Business Context

| Field | Value |
|---|---|
| Business name | Lawn Masters V5 INC |
| Location | Covington, GA (Newton County) |
| Phone | (407) 600-0301 |
| Email | lawnmastersv5@gmail.com |
| Instagram | @lawnmasters_v5 |
| Facebook | facebook.com/profile.php?id=61586389722504 |
| Google Reviews | Link in lib/reviews-data.ts → googleReviewLink |
| Language | English + Spanish (Se Habla Español) |
| Experience | 5+ years |
| Projects | 130+ completed |
| Current campaign | Summer Special — weekly lawn service |

### Service Area
Covington, Conyers, Oxford, Porterdale, Social Circle, Monroe, GA (Newton County)

### Pricing (from lib/spring-rush-content.ts)
| Plan | Price | Notes |
|---|---|---|
| Biweekly Service | $90*/month | 2 visits |
| Recurring Weekly | $120*/month | 3–4 visits, highlighted/popular |
| One-Time Cut | $45–$55* | Per visit |

*Asterisk = pricing may vary based on property size/condition

### Services Offered
Lawn Care & Mowing, Landscape Design & Installation, Tree & Shrub Care, Hardscaping, Irrigation & Drainage, Seasonal Cleanup, Pressure Washing

---

## Supabase Schema

### Table: `quote_submissions`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
first_name    text NOT NULL
last_name     text NOT NULL
email         text NOT NULL
phone         text NOT NULL
address       text NOT NULL
property_type text
property_size text
services      text[] DEFAULT '{}'
timeline      text
details       text
status        text DEFAULT 'new' CHECK (status IN ('new','contacted','quoted','closed'))
created_at    timestamptz DEFAULT now()
```
**RLS policies:** anon can INSERT; service role has full access; authenticated can SELECT, UPDATE, DELETE
**Script:** scripts/001_create_submissions.sql + scripts/003_fix_admin_rls.sql

### Table: `contact_messages`
```sql
id         uuid PRIMARY KEY DEFAULT gen_random_uuid()
name       text NOT NULL
email      text NOT NULL
phone      text
subject    text
message    text NOT NULL
read       boolean NOT NULL DEFAULT false
created_at timestamptz NOT NULL DEFAULT now()
```
**RLS policies:** anon can INSERT; service role has full access; authenticated can SELECT, UPDATE, DELETE
**Script:** scripts/004_create_contact_messages.sql ✅ created and run in Supabase

### Which Supabase client to use
| Use case | Client | Key used |
|---|---|---|
| Public form submission (Server Action) | `createAdminClient()` | SUPABASE_SERVICE_ROLE_KEY |
| Admin dashboard reads | `createAdminClient()` | SUPABASE_SERVICE_ROLE_KEY |
| Browser-side future features | `createClient()` from supabase/client.ts | NEXT_PUBLIC_SUPABASE_ANON_KEY |

---

## Environment Variables

| Variable | Required | Where Used | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | All Supabase clients | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Browser + server client | Public key, safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Admin client only | **Server-only — never expose to browser** |
| `ADMIN_EMAIL` | Yes | lib/admin-auth.ts | Login email. Defaults to `admin@test.com` if unset |
| `ADMIN_PASSWORD` | Yes | lib/admin-auth.ts | Login password. Defaults to `test123456` if unset |
| `NODE_ENV` | Auto | lib/admin-auth.ts | Sets cookie `secure` flag in production |

Set in: **Vercel → Project Settings → Environment Variables**
Local dev: create `.env.local` in project root

---

## Deployment Notes / Common Gotchas

1. **TypeScript errors are suppressed at build** — `next.config.mjs` has `ignoreBuildErrors: true`. The build will succeed with TS errors. Fix them anyway.

2. **Image optimization is disabled** — `images: { unoptimized: true }`. All images serve at original file size. Remove this after optimizing/compressing image files.

3. **Admin token is in two places** — If you ever change the session token (`lm5-admin-authenticated-2026`), update it in BOTH `middleware.ts` AND `lib/admin-auth.ts` or you'll break authentication.

4. **Default admin credentials are insecure** — If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are not set in Vercel, anyone can log in with `admin@test.com` / `test123456`. Set these env vars immediately on production.

5. **Campaign file is named spring-rush** — `lib/spring-rush-content.ts` and route `/spring-rush` are named after the old campaign (Spring Rush). Content now says "Summer Special". Don't rename the route without checking for ad links pointing to it.

6. **Two CSS files exist** — `app/globals.css` (active, imported in app/layout.tsx) and `styles/globals.css` (legacy duplicate, not imported anywhere). The one in `app/` is the real one.

7. **SQL script order matters** — Run 001 first (creates table), then 003 (adds extra policies), then 004 (contact_messages). Script 002 creates a Supabase Auth user the site doesn't use — skip it. All three have been run on the live Supabase project.

8. **Admin nav button is desktop-only** — `hidden md:inline-flex` — does not appear in mobile menu. If needed on mobile, add a link inside the mobile drawer in components/navigation.tsx.

9. **Session expires after 24 hours** — Admin is logged out automatically. This is intentional.

10. **`npm install` requires `--legacy-peer-deps`** — `vaul@0.9.9` (shadcn Drawer) has a peer dep on React `^0.14–^18` but the project uses React 19. Every `npm install <package>` without `--legacy-peer-deps` throws `ERESOLVE` and aborts. Always use the flag.

11. **Cypress requires the dev server running first** — `npm run cypress:run` connects to `localhost:3000`. It does not start the dev server automatically. Run `npm run dev` in a separate terminal before running tests, or all 26 tests will fail with connection refused.

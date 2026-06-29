[![Production](https://img.shields.io/badge/Production-LIVE-success?style=flat-square&logo=vercel)](https://lawnmastersv5.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

# 🌿 Lawn Masters V5 — Website

Production marketing website for **Lawn Masters V5 INC**, a lawn care and landscaping company serving Covington, GA and surrounding Newton County. The site generates customer leads via a quote request form and a contact form. All submissions are stored in Supabase and reviewed in a protected admin dashboard.

**Live:** [lawnmastersv5.com](https://lawnmastersv5.com)  
**Repo:** github.com/Cret0r/lawnmastersv5-website (`master` branch)  
**Hosting:** Vercel — auto-deploys on push to `master`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| 🧱 Framework | Next.js 16 — App Router |
| 💬 Language | TypeScript 5 |
| 🎨 Styling | Tailwind CSS v4 + shadcn/ui (Radix UI) |
| 🗄️ Database | Supabase (PostgreSQL + Row Level Security) |
| 🔐 Auth | Custom cookie session (not Supabase Auth) |
| ☁️ Hosting | Vercel |
| 📊 Analytics | Vercel Analytics |
| 🔤 Fonts | Inter (sans), DM Serif Display (serif) via `next/font` |
| 🎯 Icons | lucide-react |
| 📝 Forms | Native HTML + React Server Actions + `useTransition` |
| ✅ E2E Testing | Cypress | 26/26 tests — `npm run cypress:run` |
| 🔍 Form Validation | Zod | Schema validation in both form Server Actions |
| ⚡ Performance | Vercel Speed Insights | Auto-injected in `app/layout.tsx` |
| 🛡️ Rate Limiting | Custom in-memory | 3 requests / IP / 15 min on form submissions |

---

## 💻 Running Locally

```bash
npm install --legacy-peer-deps
```

> **Note:** `--legacy-peer-deps` is required. `vaul@0.9.9` (used by shadcn's Drawer component) declares a peer dependency on React `^0.14–^18`, but this project runs React 19. Without the flag, `npm install` throws `ERESOLVE`. Use it for every package install.

Create `.env.local` in the project root (see Environment Variables below), then:

```bash
npm run dev       # dev server at localhost:3000
npm run build     # production build
npm run start     # production preview
npm run lint      # eslint
```

**Running E2E tests:**

```bash
npm run dev          # start dev server first (separate terminal)
npm run cypress:run  # run all 26 tests headless
npm run cypress:open # open Cypress UI
```

> Cypress connects to `localhost:3000`. The dev server must be running before starting tests — Cypress does not start it automatically.

---

## 🔐 Environment Variables

Create `.env.local` with these values. All five are required for full functionality.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-strong-password
```

| Variable | Notes |
|---|---|
| 🔗 `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| 🔑 `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key — safe to expose to browser |
| 🛡️ `SUPABASE_SERVICE_ROLE_KEY` | Server-only — bypasses RLS. Never expose to browser. |
| 📧 `ADMIN_EMAIL` | Admin dashboard login. Defaults to `admin@test.com` if unset — **always override in production** |
| 🔒 `ADMIN_PASSWORD` | Admin dashboard password. Defaults to `test123456` if unset — **always override in production** |

For production, set all variables in **Vercel → Project Settings → Environment Variables**.

---

## 🗄️ Database Setup

The site uses two Supabase tables. Run these SQL scripts in the Supabase SQL Editor in order:

| Script | Purpose | Status |
|---|---|---|
| 1️⃣ `scripts/001_create_submissions.sql` | Creates `quote_submissions` table + RLS policies | Run this first |
| 2️⃣ `scripts/003_fix_admin_rls.sql` | Adds authenticated read/update/delete policies | Run after 001 |
| 3️⃣ `scripts/004_create_contact_messages.sql` | Creates `contact_messages` table + RLS policies | Run after 003 |

> **Skip** `scripts/002_create_admin_user.sql` — it creates a Supabase Auth user the site does not use.

### 📋 Tables

**`quote_submissions`** — populated by the `/quote` form  
Fields: `id`, `first_name`, `last_name`, `email`, `phone`, `address`, `property_type`, `property_size`, `services` (text[]), `timeline`, `details`, `status` (new/contacted/quoted/closed), `created_at`

**`contact_messages`** — populated by the `/contact` form  
Fields: `id`, `name`, `email`, `phone`, `subject`, `message`, `read` (boolean), `created_at`

---

## 📁 Folder Structure

```
app/                    Next.js pages (App Router)
  page.tsx              Homepage
  about/                /about
  services/             /services
  gallery/              /gallery
  contact/              /contact (Client Component + Server Action)
  quote/                /quote (Client Component + Server Action)
  service-policies/     /service-policies
  spring-rush/          /spring-rush — Summer campaign landing page
  admin/                /admin — Protected dashboard

components/             Shared UI components
  navigation.tsx        Fixed top nav, scroll-aware, mobile drawer
  footer.tsx            Site footer
  announcement-bar.tsx  Dismissable top promo bar
  before-after-slider.tsx  Drag-to-compare image slider
  floating-cta.tsx      Mobile-only fixed bottom Call + Text bar
  social-buttons.tsx    WhatsApp / FB / IG / SMS cluster
  ui/                   shadcn/ui component library (60+ components)

lib/
  spring-rush-content.ts   MASTER CONTENT FILE — all campaign copy, pricing, CTAs
  reviews-data.ts           Customer reviews array + Google review link
  admin-auth.ts             Cookie session helpers
  supabase/                 Supabase client factories (client / server / admin)

public/                 Static assets — logos, hero images, gallery photos
scripts/                SQL scripts for database setup
middleware.ts           Edge middleware — protects all /admin/* routes
```

---

## 🌐 Key Pages

| Route | Type | Purpose |
|---|---|---|
| 🏠 `/` | Server | Homepage — Summer campaign hero, pricing, reviews, services |
| 👤 `/about` | Server | Company story, values, service area |
| 🌿 `/services` | Server | Full service catalog (7 services) |
| 🖼️ `/gallery` | Server | 12 before/after transformation sliders |
| 📬 `/contact` | Client | Contact form → `contact_messages` table |
| 💰 `/quote` | Client | Free estimate form → `quote_submissions` table |
| 📋 `/service-policies` | Server | Pricing policy, weather policy, guarantee terms |
| ☀️ `/spring-rush` | Server | Standalone campaign landing page (URL is still `/spring-rush`, content says "Summer Special") |
| 🔒 `/admin` | Server | Protected dashboard — view and manage quote requests + messages |
| 🔑 `/admin/login` | Server | Admin login (dark-themed, cookie-based auth) |

---

## 🔒 Admin Portal

**URL:** `/admin/login`  
**Credentials:** Set via `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

The admin portal is protected by a custom cookie-based session (not Supabase Auth). Middleware runs on every `/admin/*` request and checks for a valid session cookie.

- Session cookie: `admin_session` — token `lm5-admin-authenticated-2026`, expires 24 hours, httpOnly
- The session token is checked in **two places**: `middleware.ts` and `lib/admin-auth.ts`. If you ever change the token string, update both files.
- The login form uses `type="text"` (not `type="email"`) — it accepts any string as the username input.

**Admin features:**
- View all quote submissions with status tracking (new → contacted → quoted → closed)
- View all contact messages with read/unread state
- Delete submissions and messages
- Route planning tab (Leaflet map)

---

## 🚀 Deployment

1. Push to `master` — Vercel auto-deploys
2. Set all 5 environment variables in Vercel project settings
3. Run Supabase SQL scripts 001 → 003 → 004 in the Supabase SQL Editor
4. Verify forms work end-to-end at `/contact` and `/quote`
5. Verify admin login works at `/admin/login`

**Important config notes:**
- TypeScript errors are suppressed at build time (`ignoreBuildErrors: true` in `next.config.mjs`) — the build will pass with TS errors. Fix them anyway.
- Image optimization is disabled (`unoptimized: true`) — all images serve at original file size.

---

## 🌿 Branch Workflow

- `master` — production branch, auto-deploys to lawnmastersv5.com on every push
- Feature branches — use for new pages or major changes (e.g. `summer-campaign`)
- Never build directly on master for new features
- Test locally at localhost:3000 before merging to master

---

## 🎨 Brand & Content Notes

**Business:** Lawn Masters V5 INC  
**Phone:** (407) 600-0301  
**Email:** lawnmastersv5@gmail.com  
**Instagram:** @lawnmasters_v5  
**Service area:** Covington, Conyers, Oxford, Porterdale, Social Circle, Monroe, GA (Newton County)  
**Languages:** English + Spanish (Se Habla Español)

### ✏️ Content update rules

- **Campaign copy** (announcement bar text, hero headlines, pricing, SMS pre-fill, guarantee, referral, service area) — edit `lib/spring-rush-content.ts` first. This is the single source of truth consumed by the homepage and `/spring-rush` landing page.
- **Customer reviews** — edit `lib/reviews-data.ts`.
- **Phone number** — appears in ~9 files. Search for `14076000301` before editing. See `ARCHITECTURE.md § 4` for the full list.
- **Logo files** — do not modify `public/logo-color.png` or `public/logo-contrast.png`.

### ⚠️ Known issues

| Issue | File | Fix |
|---|---|---|
| 🐛 Campaign route still named `/spring-rush` | `app/spring-rush/` | Do not rename without checking ad campaign links |
| 🐛 Admin button is desktop-only | `components/navigation.tsx` | Add to mobile drawer if needed |

---

For full technical reference, see `ARCHITECTURE.md`. For AI agent rules and content update procedures, see `AGENTS.md`.

---

## 📝 Changelog

**Session 1 — June 2026**
- Migrated site from V0 to Vercel free hosting
- Full Georgia rebrand (Florida → Covington, GA)
- Supabase setup — quote_submissions + contact_messages tables
- Admin portal built with custom cookie auth
- ARCHITECTURE.md, AGENTS.md, HANDOFF.md, claude-mem installed

**Session 2 — June 27–28, 2026**
- SUMMER_CAMPAIGN_2026.md rebuilt with full Hormozi framework analysis + dual-strategy
- output/HORMOZI_SUMMER_OFFER.md created — 10 Hormozi skills applied to the campaign
- Cypress E2E test suite added — 26/26 tests passing
- Zod schema validation added to both form Server Actions
- In-memory IP rate limiting (lib/rate-limit.ts) — 3 req/IP/15 min
- Vercel Speed Insights added to app/layout.tsx
- README.md created with full developer onboarding docs
- Gallery "15+ years" stat fixed to "5+"

---

## 🗺️ Roadmap

- [ ] Build /summer campaign landing page (summer-campaign branch)
- [ ] Replace hero background with real Georgia lawn photo
- [ ] Replace before/after photos with real Newton County job photos
- [ ] Add 5+ real customer reviews
- [ ] Enable image optimization once images are compressed
- [x] Cypress testing + tech stack additions — 26/26 passing ✅
- [ ] Add Admin button to mobile nav

# Lawn Masters V5 — Architecture Reference

> Last updated: June 2026
> Domain: lawnmastersv5.com | Location: Covington, GA | Phone: (407) 600-0301

---

## 0. TECH STACK

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | React 19, Server + Client Components |
| Language | TypeScript 5 | Build errors suppressed — `ignoreBuildErrors: true` |
| Styling | Tailwind CSS v4 | CSS custom properties, no tailwind.config.ts needed |
| Component Library | shadcn/ui (Radix UI) | Full library installed, most unused |
| Database | Supabase | PostgreSQL + Row Level Security |
| Auth | Custom cookie session | NOT Supabase Auth — hardcoded token + env var credentials |
| Hosting | Vercel | Auto-deploys from GitHub `master` |
| Analytics | Vercel Analytics | `<Analytics />` in app/layout.tsx |
| Performance | Vercel Speed Insights | `<SpeedInsights />` in app/layout.tsx |
| Fonts | Inter (sans), DM Serif Display (serif) | Google Fonts via next/font |
| Icons | lucide-react | Used throughout site |
| Forms | Server Actions + useTransition | No API routes — see app/contact/actions.ts |
| Form Validation | Zod | `quoteSchema` + `contactSchema` in both form Server Actions |
| Rate Limiting | Custom in-memory (lib/rate-limit.ts) | 3 requests per IP per 15 min on both form actions |
| E2E Testing | Cypress | 26/26 tests — `npm run cypress:run` |
| CSS Modules | Used for admin components | login.module.css, admin-nav-button.module.css |

---

## 1. PROJECT STRUCTURE

```
landscaping-business-website/
│
├── app/                          # Next.js App Router — all pages live here
│   ├── layout.tsx                # Root layout: fonts, metadata, Schema.org JSON-LD, FloatingCTA, Analytics
│   ├── page.tsx                  # Homepage (/)
│   ├── globals.css               # Tailwind v4 imports + CSS custom properties (design tokens)
│   ├── favicon.ico               # Browser favicon
│   ├── apple-icon.png            # Apple touch icon
│   │
│   ├── about/
│   │   └── page.tsx              # /about — Company story, values, service area
│   │
│   ├── services/
│   │   └── page.tsx              # /services — Full service catalog with feature lists
│   │
│   ├── gallery/
│   │   └── page.tsx              # /gallery — 12 before/after transformation sliders
│   │
│   ├── contact/
│   │   ├── page.tsx              # /contact — Contact form + service area grid (CLIENT)
│   │   ├── actions.ts            # Server Action: submitContactMessage → Supabase insert
│   │   └── layout.tsx            # Contact page layout wrapper
│   │
│   ├── quote/
│   │   ├── page.tsx              # /quote — Free estimate multi-step form (CLIENT)
│   │   ├── actions.ts            # Server Action: submitQuote → Supabase insert
│   │   └── layout.tsx            # Quote page layout wrapper
│   │
│   ├── service-policies/
│   │   └── page.tsx              # /service-policies — Policy docs (pricing, weather, guarantee)
│   │
│   ├── spring-rush/
│   │   └── page.tsx              # /spring-rush — Summer Special campaign landing page
│   │
│   └── admin/
│       ├── page.tsx              # /admin — Protected dashboard (SERVER, requires auth)
│       ├── login/
│       │   └── page.tsx          # /admin/login — Login form
│       ├── actions.ts            # Server Actions: login, logout
│       ├── admin-tabs.tsx        # Tab switcher for Quotes/Messages (CLIENT)
│       ├── client-actions.ts     # Client-side admin utilities
│       ├── clients-tab.tsx       # Clients tab component
│       ├── message-actions.tsx   # Mark-read / delete actions for messages (CLIENT)
│       ├── route-planner-tab.tsx # Route planning tab (Leaflet map)
│       ├── sign-out-button.tsx   # Sign-out button (CLIENT)
│       └── submission-actions.tsx # Status update actions for quote submissions (CLIENT)
│
├── components/
│   ├── announcement-bar.tsx      # Fixed top banner — Summer Special promo (CLIENT, dismissable)
│   ├── before-after-slider.tsx   # Drag-to-reveal before/after image comparison (CLIENT)
│   ├── floating-cta.tsx          # Mobile-only fixed bottom bar: Call + Text buttons (CLIENT)
│   ├── footer.tsx                # Site footer: logo, nav links, contact info, social buttons
│   ├── loading-waves.tsx         # Loading animation component
│   ├── navigation.tsx            # Fixed top nav: scroll-aware, mobile drawer (CLIENT)
│   ├── review-card.tsx           # Single customer review display card
│   ├── social-buttons.tsx        # WhatsApp, Facebook, Instagram, SMS button cluster (CLIENT)
│   ├── theme-provider.tsx        # next-themes provider (dark mode ready, not yet toggled)
│   └── ui/                       # shadcn/ui component library (Radix UI wrappers)
│       ├── button.tsx            # Primary button component
│       ├── card.tsx              # Card + CardContent containers
│       ├── badge.tsx             # Status badge (used in admin)
│       ├── tabs.tsx              # Tab navigation
│       ├── ... (60+ components)  # Full shadcn/ui library — most unused, available if needed
│
├── lib/
│   ├── spring-rush-content.ts    # MASTER CONTENT FILE — all campaign copy, pricing, CTAs
│   ├── reviews-data.ts           # Customer reviews array + Google review link
│   ├── admin-auth.ts             # Cookie-based admin auth helpers (verify, create, destroy session)
│   ├── utils.ts                  # Tailwind cn() merge utility
│   ├── rate-limit.ts             # In-memory IP rate limiter (3 req/IP/15 min window)
│   └── supabase/
│       ├── client.ts             # Browser Supabase client (anon key)
│       ├── server.ts             # Server Supabase client (anon key, cookie-aware)
│       ├── admin.ts              # Admin Supabase client (service role key, bypasses RLS)
│       └── proxy.ts              # Supabase proxy configuration
│
├── hooks/
│   ├── use-mobile.ts             # Breakpoint hook: returns true if viewport < 768px
│   └── use-toast.ts              # Toast notification state hook
│
├── public/                       # Static assets (served at root URL)
│   ├── logo-color.png            # Color logo (used on scrolled/white nav)
│   ├── logo-contrast.png         # White/contrast logo (used on dark/transparent nav + footer)
│   ├── icon.svg                  # SVG icon
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-icon.png
│   ├── hero-lawn-care-new.jpg    # Homepage hero background (Spring Rush section)
│   ├── hero-landscaping-lush-garden.jpg # Secondary hero (About, Spring Rush page)
│   ├── backyard-transformation-complete.jpg # Featured portfolio image (Gallery hero, Quote hero)
│   ├── lawn-care-mowing-stripes.jpg  # Contact hero background
│   ├── hardscaping-stone-patio-walkway.jpg
│   ├── landscape-design-garden-planting.jpg  # Services hero
│   ├── landscaping-section-bg.jpg
│   ├── tree-shrub-care-pruning.jpg   # Homepage CTA section background
│   ├── real-before-backyard.jpg  # Homepage before/after #1
│   ├── real-after-backyard.jpg
│   ├── real-before-sideyard.jpg  # Homepage before/after #2
│   ├── real-after-sideyard.jpg
│   └── gallery/                  # Gallery-specific before/after image pairs
│       ├── front-yard-before.jpg / front-yard-after.jpg
│       ├── brick-paver-before.jpg / brick-paver-after.jpg
│       ├── driveway-before.jpg / driveway-after.jpg
│       ├── mailbox-before.jpg / mailbox-after.jpg
│       ├── sideyard2-before.jpg / sideyard2-after.jpg
│       ├── backyard2-before.jpg / backyard2-after.jpg
│       ├── fenced-backyard-before.jpg / fenced-backyard-after.jpg
│       ├── ac-unit-before.jpg / ac-unit-after.jpg
│       ├── mulch-before.jpg / mulch-after.jpg
│       └── lot-clearing-before.jpg / lot-clearing-after.jpg
│
├── styles/
│   └── globals.css               # Duplicate/mirror of app/globals.css (legacy, app/ version takes precedence)
│
├── cypress/
│   ├── e2e/                          # End-to-end tests (26 tests total, all passing)
│   │   ├── admin.cy.ts               # Admin portal auth (5 tests)
│   │   ├── contact.cy.ts             # Contact form (5 tests)
│   │   ├── homepage.cy.ts            # Homepage load + content (4 tests)
│   │   ├── navigation.cy.ts          # Nav links (5 tests)
│   │   └── quote.cy.ts               # Quote form (7 tests)
│   └── support/
│       └── e2e.ts                    # Uncaught exception handler (hydration + Supabase errors)
│
├── scripts/
│   ├── 001_create_submissions.sql  # Creates quote_submissions table + RLS policies
│   ├── 002_create_admin_user.sql   # Admin user setup
│   ├── 003_fix_admin_rls.sql       # RLS policy fixes
│   ├── development/              # Dev workflow scripts
│   ├── testing/                  # Build verification scripts
│   ├── monitoring/               # Site health checks
│   ├── maintenance/              # Code quality scripts
│   └── automation/               # Documentation reminders
│
├── cypress.config.ts              # Cypress config: baseUrl http://localhost:3000 (dev server must be running)
├── middleware.ts                  # Edge middleware: protects /admin/* routes via cookie session
├── next.config.mjs               # Next.js config: TypeScript error bypass, unoptimized images
├── tsconfig.json                 # TypeScript config with path alias @/ → root
├── tailwind.config.ts            # (Tailwind v4 — config is in CSS, this may be minimal)
├── postcss.config.mjs            # PostCSS with Tailwind CSS plugin
├── components.json               # shadcn/ui configuration
├── package.json                  # Dependencies and npm scripts
├── pnpm-lock.yaml                # pnpm lockfile
├── ARCHITECTURE.md               # This file
└── AGENTS.md                     # AI agent instructions
```

### Architecture Pattern: Server vs Client Components

This project uses the **Next.js App Router** with a deliberate split:

| Type | Components |
|---|---|
| **Server Components** (default) | `app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, `app/services/page.tsx`, `app/gallery/page.tsx`, `app/service-policies/page.tsx`, `app/spring-rush/page.tsx`, `app/admin/page.tsx` |
| **Client Components** (`"use client"`) | `Navigation`, `AnnouncementBar`, `BeforeAfterSlider`, `FloatingCTA`, `SocialButtons`, `app/contact/page.tsx`, `app/quote/page.tsx`, all `app/admin/*-actions.tsx` |
| **Server Actions** | `app/contact/actions.ts`, `app/quote/actions.ts`, `app/admin/actions.ts` |

**Data flow for forms:** Client Component form → Server Action → Supabase insert → return result to client

---

## 2. PAGES & ROUTES

### `/` — Homepage
- **File:** `app/page.tsx` (Server Component)
- **Layout sections (top to bottom):**
  1. `AnnouncementBar` — "Summer Special — Now booking weekly routes" (dismissable)
  2. `Navigation` — Transparent initially, white on scroll
  3. **Summer Special Hero** — Big CTA with Call/Text buttons, "Covington & Conyers" headline
  4. **Trust Strip** — Locally Owned, Reliable Scheduling, Se Habla Español
  5. **Before & After Proof** — 3 `BeforeAfterSlider` instances from `springRush.proof`
  6. **Pricing** — 3 cards: Biweekly ($90), Weekly ($120, highlighted), One-Time ($45–$55)
  7. **Guarantee** — "If we miss, next cut is free"
  8. **Reviews** — 3 `ReviewCard` instances + Google Review link button
  9. **Referral** — "$20 off for every friend" promotion
  10. **Service Area (compact)** — Text + link to /contact
  11. **Secondary Hero** — Full-width landscape image with general landscaping CTA
  12. **Stats Strip** — 130+ projects, 5+ years, 100% satisfaction
  13. **Services Grid** — 7 service cards
  14. **Portfolio Gallery** — 4 images in mosaic grid
  15. **Final CTA** — Dark section with call/estimate buttons
  16. `Footer`

### `/about` — About Us
- **File:** `app/about/page.tsx` (Server Component)
- **Content:** Hero, Our Story narrative, 4 core values cards, 4 "Why Choose Us" cards, CTA section, Service Area bullet list
- **Service Area listed:** Covington, Conyers, Oxford, Porterdale, Social Circle, Monroe GA

### `/services` — Services
- **File:** `app/services/page.tsx` (Server Component)
- **Content:** Hero, 7 service cards (each with 5 feature bullets), CTA
- **Services:** Lawn Care & Mowing, Landscape Design, Tree & Shrub Care, Hardscaping, Irrigation & Drainage, Seasonal Cleanup, Pressure Washing

### `/gallery` — Gallery
- **File:** `app/gallery/page.tsx` (Server Component)
- **Content:** Hero, 12 named before/after `BeforeAfterSlider` entries with descriptions and service tags, stats section (2,500+ properties, 15+ years, 100% satisfaction), CTA
- **Note:** Stats on this page ("15+ Years") differ from homepage ("5+ Years") — inconsistency to resolve

### `/contact` — Contact
- **File:** `app/contact/page.tsx` (`"use client"`)
- **Content:** Hero, 4 info cards (Phone, Email, Hours, Service Area), estimate button, contact form (name/email/phone/subject/message), service area grid
- **Service Area displayed:** Covington, Conyers, Oxford, Porterdale, Social Circle, Monroe
- **Form → Action:** `submitContactMessage` → inserts into `contact_messages` Supabase table

### `/quote` — Free Estimate
- **File:** `app/quote/page.tsx` (`"use client"`)
- **Content:** Hero, multi-section form (personal info, property details, service selection grid, timeline/notes), "What Happens Next" trust card
- **Service options include:** summer-special (Summer Special Weekly/Biweekly/One-Time)
- **Form → Action:** `submitQuote` → inserts into `quote_submissions` Supabase table

### `/service-policies` — Service Policies
- **File:** `app/service-policies/page.tsx` (Server Component)
- **Content:** 6 policy sections: Pricing & Property Condition, Service Access, Weather Delays, Overgrowth/First-Cut, Referral Credits, Guarantee Terms, Scheduling Changes

### `/spring-rush` — Summer Special Campaign Landing Page
- **File:** `app/spring-rush/page.tsx` (Server Component)
- **Content:** Minimal nav (logo + phone only), Hero, Trust strip, 3 before/after sliders, Pricing (same 3 cards), Guarantee, Referral, Service Area, Final CTA, Simple footer
- **Note:** File and route are still named `spring-rush` but all displayed content says "Summer Special"
- **Purpose:** Standalone conversion page for ads/campaigns — no main nav distractions

### `/admin` — Admin Dashboard (Protected)
- **File:** `app/admin/page.tsx` (Server Component)
- **Access:** Requires `admin_session` cookie with token `lm5-admin-authenticated-2026`
- **Content:** Two tabs — Quote Requests (from `quote_submissions` table) and Messages (from `contact_messages` table)
- **Status workflow for quotes:** new → contacted → quoted → completed
- **Features:** Unread message count badge, new quote count badge, sign-out

### `/admin/login` — Admin Login
- **File:** `app/admin/login/page.tsx`
- **Auth:** Checks credentials against `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars, sets httpOnly cookie

---

## 3. KEY PATTERNS & RULES

### Content Configuration Pattern
All campaign/marketing copy is centralized in **`lib/spring-rush-content.ts`** (`springRush` export). Never hardcode campaign text into components — pull from this file. This allows one-file campaign updates.

```
lib/spring-rush-content.ts → AnnouncementBar, app/page.tsx, app/spring-rush/page.tsx
lib/reviews-data.ts → app/page.tsx (ReviewCard instances)
```

### Page Layout Pattern
Every public page follows this shell:
```tsx
<div className="min-h-screen bg-background">
  <Navigation />
  <section className="relative pt-32 pb-20 overflow-hidden"> {/* Hero */}
    <Image fill /> + gradient overlay + centered text
  </section>
  {/* Content sections alternating bg-background / bg-secondary / bg-primary */}
  <Footer />
</div>
```

### Hero Section Pattern
```tsx
<section className="relative pt-32 pb-20 overflow-hidden">
  {/* Background image with gradient overlay */}
  <div className="absolute inset-0 z-0">
    <Image src="..." fill className="object-cover" />
    <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/60 to-background" />
  </div>
  {/* Centered content on top */}
  <div className="relative z-10 container mx-auto px-4 text-center">
    <span className="text-primary text-sm font-semibold uppercase tracking-wider">Label</span>
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-primary-foreground ...">Heading</h1>
    <p className="text-lg text-primary-foreground/80 ...">Subtext</p>
  </div>
</section>
```

### Section Background Alternation
| Section type | Background class |
|---|---|
| Default content | `bg-background` |
| Alternate / highlighted | `bg-secondary` |
| Dark CTA | `bg-primary` |
| Overlay CTA | `bg-foreground` |

### Button Styles
```tsx
// Primary green button
className="bg-primary hover:bg-primary/90 text-primary-foreground"

// Outline button (on light background)
className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"

// Outline button (on dark background)
className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"

// Inverted (on green bg)
className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
```

### Card Pattern
```tsx
<Card className="bg-card border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
  <CardContent className="p-6">...</CardContent>
</Card>
```

### Design System — Colors

| Token | Value (oklch) | Visual | Usage |
|---|---|---|---|
| `primary` | `0.45 0.12 145` | Forest green | Brand color, CTAs, icons, borders on focus |
| `primary-foreground` | `0.99 0 0` | Near white | Text on green elements |
| `background` | `0.97 0.005 90` | Warm off-white | Page background |
| `foreground` | `0.20 0.02 50` | Near black | Body text, dark sections bg |
| `secondary` | `0.92 0.01 90` | Light warm gray | Alternating section bg |
| `card` | `0.99 0.003 90` | Almost white | Card backgrounds |
| `muted-foreground` | `0.50 0.015 50` | Medium gray | Secondary/helper text |
| `accent` | `0.55 0.10 55` | Warm amber | Accent (currently unused in UI) |
| `destructive` | `0.577 0.245 27.325` | Red | Error states, required asterisks |
| `border` | `0.88 0.01 90` | Light warm gray | Borders, dividers |

### Design System — Typography

| Font | Variable | Usage |
|---|---|---|
| **Inter** | `--font-inter` / `font-sans` | Body text, UI labels, buttons |
| **DM Serif Display** | `--font-dm-serif` / `font-serif` | All headings (h1–h3), hero titles |
| **Geist Mono** | `font-mono` | Code blocks (rarely used) |

### Typography Scale Pattern
```
h1 page: text-4xl sm:text-5xl md:text-6xl font-serif
h2 section: text-3xl sm:text-4xl md:text-5xl font-serif
h3 card: text-lg sm:text-xl font-semibold (sometimes font-serif)
label/eyebrow: text-sm uppercase tracking-wider font-semibold text-primary
body: text-base sm:text-lg text-muted-foreground
small: text-sm text-muted-foreground
```

### Spacing Pattern
- Container: `container mx-auto px-4 sm:px-6`
- Section padding: `py-16 sm:py-20` (standard), `py-14 sm:py-18` (campaign sections)
- Grid gaps: `gap-4 sm:gap-6`
- Card padding: `p-6` or `p-6 sm:p-8`

### Animation
```css
.animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
/* Stagger via style={{ animationDelay: `${index * 80}ms` }} */
```
All `[data-slot="button"]` elements have a letter-spacing hover effect + green box shadow.

### Known Issues / Watch Out For

1. **`next.config.mjs` ignores TypeScript errors at build time** — `ignoreBuildErrors: true`. The site will build even with TS errors. Fix errors anyway; don't rely on this.

2. **All images are unoptimized** — `images: { unoptimized: true }` means no automatic WebP/resize. Images serve at full original size. Consider removing this flag after optimizing image files.

3. **Admin auth is a static token** — Not Supabase Auth. The cookie value is hardcoded as `lm5-admin-authenticated-2026`. Middleware checks this token. Default credentials (`admin@test.com` / `test123456`) will be used if env vars are not set in production.

4. **Route still named `/spring-rush`** — The campaign was renamed to "Summer Special" but the URL route is still `/spring-rush`. Not a bug but may confuse future editors. The `lib/spring-rush-content.ts` file is similarly named.

6. **`leaflet` / `react-leaflet` installed** — Used in `app/admin/route-planner-tab.tsx` for the admin route planner. The package requires `"use client"` and dynamic imports to avoid SSR issues with `window`.

7. **Two CSS files** — `app/globals.css` and `styles/globals.css`. The `app/globals.css` is the active one (imported in `app/layout.tsx`). The `styles/` version appears to be a legacy duplicate.

---

## 4. CONTENT & COPY

### Phone Number
**Current number: (407) 600-0301 / +14076000301**

Every place it appears:
| File | Context |
|---|---|
| `app/layout.tsx:33` | Schema.org `telephone` field |
| `app/page.tsx:259,562` | `<a href="tel:+14076000301">` in pricing cards and CTA section |
| `app/spring-rush/page.tsx:37,188,250` | Top nav, pricing cards, final CTA |
| `app/contact/page.tsx:85,301` | Phone info card + "Don't see your area?" note |
| `app/quote/page.tsx:255` | "For fastest booking, call..." note |
| `app/service-policies/page.tsx:119` | "Call Us" CTA link |
| `components/floating-cta.tsx:10,16` | `tel:` and `sms:` mobile bottom bar |
| `components/social-buttons.tsx:6` | WhatsApp + SMS buttons (as variable `whatsappNumber`) |
| `lib/spring-rush-content.ts:21,23` | `ctaCall.href` and `ctaText.href` |

**To change the phone number:** Update `lib/spring-rush-content.ts` first (controls most CTAs), then update the hardcoded instances in `app/page.tsx`, `app/contact/page.tsx`, `app/quote/page.tsx`, `app/service-policies/page.tsx`, `components/floating-cta.tsx`, `components/social-buttons.tsx`, and `app/layout.tsx` (Schema.org).

### City / Location References

**Primary service area:** Covington, GA (HQ) — Newton County

| City | Files where it appears |
|---|---|
| Covington | `app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, `app/services/page.tsx`, `app/contact/page.tsx`, `app/gallery/page.tsx`, `app/spring-rush/page.tsx`, `lib/spring-rush-content.ts`, `lib/reviews-data.ts`, `components/footer.tsx` |
| Conyers | `app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/gallery/page.tsx`, `lib/spring-rush-content.ts`, `lib/reviews-data.ts` |
| Oxford | `app/layout.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `lib/spring-rush-content.ts` |
| Porterdale | `app/layout.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `lib/spring-rush-content.ts` |
| Social Circle | `app/layout.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `lib/spring-rush-content.ts` |
| Monroe | `app/layout.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `lib/spring-rush-content.ts` |
| Newton County | `app/layout.tsx` (Schema.org), `app/services/page.tsx` |

**To update the service area list**, the canonical source is:
- `app/layout.tsx` — Schema.org `areaServed` array
- `lib/spring-rush-content.ts` — `serviceArea.text` string
- `app/contact/page.tsx` — `serviceAreas` array (line 13–21)
- `app/about/page.tsx` — `<ul>` bullet list

### Seasonal Campaign References

| Reference | File | Notes |
|---|---|---|
| "Summer Special — Now booking weekly routes" | `lib/spring-rush-content.ts:9` | Announcement bar text |
| "Summer Special — Now Booking" | `components/announcement-bar.tsx:29` | Mobile-only shortened version |
| "Summer Special" (metadata) | `app/spring-rush/page.tsx:19` | Page title |
| "Summer Special weekly plan" | `lib/spring-rush-content.ts:23` | SMS pre-fill message |
| "Summer Special weekly plan" | `components/floating-cta.tsx:17` | Mobile SMS button |
| "Summer Special (Weekly / Biweekly...)" | `app/quote/page.tsx:21` | Quote form service option |
| "this summer" / "summer" | `app/spring-rush/page.tsx:241,243` | Final CTA copy |
| "Spring cleanup" / "fall cleanup" | `app/services/page.tsx:98,99` | Service feature bullet (generic, not campaign-specific) |
| "Spring and fall cleanup" | `app/page.tsx:73` | Services section card description |

**To update the campaign name**, the primary file is `lib/spring-rush-content.ts` (announcement, SMS messages). Secondary: `app/spring-rush/page.tsx` metadata and copy, `components/floating-cta.tsx` SMS message, `app/quote/page.tsx` service option label.

### Other Key Copy Locations

| Item | Location |
|---|---|
| Business email | `app/layout.tsx:34`, `components/footer.tsx:93`, `app/contact/page.tsx:104` |
| Instagram handle | `app/layout.tsx:74`, `components/social-buttons.tsx:50` |
| Facebook URL | `components/social-buttons.tsx:33` |
| Google Review link | `lib/reviews-data.ts:37` |
| Pricing ($90, $120, $45–$55) | `lib/spring-rush-content.ts:69,81,95` |
| Guarantee copy | `lib/spring-rush-content.ts:111–113` |
| Referral offer ($20 off) | `lib/spring-rush-content.ts:116–117` |
| Business stats (130+ projects, 5+ years) | `app/page.tsx:415,421` (inline, not centralized) |

---

## 5. ENVIRONMENT VARIABLES

Required in `.env.local` for development; set in Vercel dashboard for production.

| Variable | Required | Used In | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/admin.ts` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | `lib/supabase/server.ts`, `lib/supabase/client.ts` | Public anon key (safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (admin only) | `lib/supabase/admin.ts` | Service role key — bypasses RLS. Never expose to browser. |
| `ADMIN_EMAIL` | Yes (production) | `lib/admin-auth.ts` | Admin dashboard login email. Defaults to `admin@test.com` if unset — **change this in production** |
| `ADMIN_PASSWORD` | Yes (production) | `lib/admin-auth.ts` | Admin dashboard login password. Defaults to `test123456` if unset — **change this in production** |
| `NODE_ENV` | Auto-set | `lib/admin-auth.ts` | Controls cookie `secure` flag (true in production) |

**Create `.env.local` in project root:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-strong-password
```

---

## 6. DEPLOYMENT

### Current Setup
| Item | Value |
|---|---|
| Hosting | Vercel |
| Domain | lawnmastersv5.com |
| Git remote | GitHub — user `Cret0r`, branch `master` |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Analytics | Vercel Analytics (injected in `app/layout.tsx`) |

### Database Schema
Two tables (see `scripts/001_create_submissions.sql`):
- `quote_submissions` — Fields: id, first_name, last_name, email, phone, address, property_type, property_size, services (text[]), timeline, details, status, created_at
- `contact_messages` — Fields: id, name, email, phone, subject, message, read (boolean), created_at

### Deploy Checklist
1. Set all 5 environment variables in Vercel project settings
2. Connect GitHub repo to Vercel (auto-deploys on push to `master`)
3. Set custom domain `lawnmastersv5.com` in Vercel dashboard
4. Run Supabase SQL scripts in order: `001_` → `002_` → `003_`
5. Verify admin login at `lawnmastersv5.com/admin/login`

### Build Command
```bash
npm run build     # next build
npm run dev       # next dev (localhost:3000)
npm run start     # next start (production preview)
npm run lint      # eslint .
```

### Key Config Notes
- **`next.config.mjs`** — TypeScript errors are suppressed at build time (`ignoreBuildErrors: true`). Image optimization is disabled (`unoptimized: true`). Remote images from `hebbkx1anhila5yf.public.blob.vercel-storage.com` (v0.dev) are allowed.
- **`middleware.ts`** — Runs at the edge on every `/admin/*` request. Protects all admin routes. Login page is excluded. Token: `lm5-admin-authenticated-2026`.
- **Admin session** — Cookie-based, expires in 24 hours, httpOnly + secure in production.

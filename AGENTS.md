# AGENTS.md — AI Agent Instructions for Lawn Masters V5 Website

> Read this file before making any changes to this project.
> This project is a production lawn care business website for a real company.

---

## What This Project Is

A Next.js 16 marketing website for **Lawn Masters V5 INC**, a lawn care and landscaping company serving **Covington, GA and surrounding areas** (Newton County). The site generates customer leads via quote forms and a contact form. All submissions are stored in Supabase and reviewed in a protected admin dashboard.

**Live URL:** lawnmastersv5.com  
**Business phone:** (407) 600-0301  
**Business email:** lawnmastersv5@gmail.com  
**Instagram:** @lawnmasters_v5

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 — App Router |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix UI) |
| Database | Supabase (PostgreSQL + RLS) |
| Hosting | Vercel |
| Analytics | Vercel Analytics |
| Fonts | Inter (sans), DM Serif Display (serif) |
| Icons | lucide-react |
| Forms | Native HTML + React Server Actions + useTransition |

---

## Folder Structure (Quick Reference)

```
app/                   Next.js pages (App Router)
  page.tsx             Homepage
  about/               /about
  services/            /services
  gallery/             /gallery
  contact/             /contact (CLIENT)
  quote/               /quote (CLIENT)
  service-policies/    /service-policies
  spring-rush/         /spring-rush — Summer Special landing page
  admin/               /admin — Protected dashboard

components/            Shared UI components
  announcement-bar     Top promo bar (CLIENT)
  before-after-slider  Drag-to-compare (CLIENT)
  floating-cta         Mobile bottom bar (CLIENT)
  footer               Site footer
  navigation           Fixed nav (CLIENT)
  review-card          Customer review
  social-buttons       WhatsApp/FB/IG/SMS (CLIENT)
  ui/                  shadcn/ui library

lib/
  spring-rush-content.ts   MASTER CONTENT FILE — all campaign copy
  reviews-data.ts           Customer reviews
  admin-auth.ts             Admin session helpers
  supabase/                 Supabase client factories
```

---

## Design System

### Brand Colors (Tailwind tokens — oklch values)

| Token | Color | Use |
|---|---|---|
| `primary` | Forest green (`0.45 0.12 145`) | Brand color: buttons, icons, accents |
| `primary-foreground` | Near white | Text/icons on green backgrounds |
| `background` | Warm off-white (`0.97 0.005 90`) | Page background |
| `foreground` | Near black (`0.20 0.02 50`) | Body text; also used as dark section bg |
| `secondary` | Light warm gray (`0.92 0.01 90`) | Alternating section backgrounds |
| `card` | Almost white | Card backgrounds |
| `muted-foreground` | Medium gray | Secondary text |
| `destructive` | Red | Errors, required field markers |

### Typography

- **Headings:** `font-serif` (DM Serif Display)
- **Body/UI:** `font-sans` (Inter)
- **Scale:** h1 `text-4xl sm:text-5xl md:text-6xl`, h2 `text-3xl sm:text-4xl`, h3 `text-xl font-semibold`
- **Eyebrow labels:** `text-sm uppercase tracking-wider font-semibold text-primary`

### Button Patterns

```tsx
// Primary (use on light backgrounds)
bg-primary hover:bg-primary/90 text-primary-foreground

// Outline (use on light backgrounds)
border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent

// Outline (use on DARK/image backgrounds)
border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent

// Inverted (use on green bg sections)
bg-primary-foreground text-primary hover:bg-primary-foreground/90
```

---

## Rules — Read Before Editing

### NEVER change without explicit owner confirmation:

1. **The logo files** — `/public/logo-color.png` and `/public/logo-contrast.png`
   - Do not resize, replace, or modify logo files
   - `logo-color.png` = used on scrolled (white) nav
   - `logo-contrast.png` = used on dark/transparent nav and footer

2. **The phone number** — `(407) 600-0301` / `+14076000301`
   - This is the real business number
   - It appears in ~12 places across the codebase (see ARCHITECTURE.md § 4)
   - Do not change it without the owner saying "update the phone number to..."
   - If updating: start with `lib/spring-rush-content.ts`, then check all files listed in ARCHITECTURE.md

3. **The service area cities** — Covington, Conyers, Oxford, Porterdale, Social Circle, Monroe, GA
   - These are the real cities served by this business
   - Do not add or remove cities without owner confirmation
   - The canonical list lives in 4 places: `app/layout.tsx`, `lib/spring-rush-content.ts`, `app/contact/page.tsx`, `app/about/page.tsx`

4. **Supabase credentials** — Never read, log, or output `.env.local` values

5. **The admin password/email** — `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars — never reveal, log, or output these

### Always do:

- **Update `lib/spring-rush-content.ts`** when changing any campaign copy (announcement bar text, hero headlines, SMS pre-fill messages, pricing, guarantee, referral offer, service area text). This is the single source of truth for the homepage and `/spring-rush` landing page.

- **Match the existing section pattern** when adding new sections: alternate `bg-background` / `bg-secondary` / `bg-primary`. Use the hero pattern with full-bleed image + gradient overlay for hero sections.

- **Use `font-serif` for headings** (DM Serif Display) and `font-sans` for body/UI text.

- **Add `"use client"` at the top** for any component that uses hooks, browser APIs, event handlers, or `useState`/`useEffect`.

- **Use Server Actions** for form submissions — not API routes. See `app/contact/actions.ts` for the pattern.

- **Check ARCHITECTURE.md § 4** (Content & Copy) before adding a new instance of the phone number, city name, or campaign phrase so you know all locations to keep in sync.

---

## Content Update Quick Reference

| Want to change | Edit this file first |
|---|---|
| Announcement bar text | `lib/spring-rush-content.ts` → `announcement.text` |
| Hero headlines / CTAs | `lib/spring-rush-content.ts` → `hero.*` |
| Pricing plans | `lib/spring-rush-content.ts` → `pricing.plans` |
| Guarantee text | `lib/spring-rush-content.ts` → `guarantee.*` |
| Referral offer | `lib/spring-rush-content.ts` → `referral.*` |
| Service area text (compact) | `lib/spring-rush-content.ts` → `serviceArea.text` |
| Before/after proof images | `lib/spring-rush-content.ts` → `proof.transformations` |
| Customer reviews | `lib/reviews-data.ts` → `reviews` array |
| Google review link | `lib/reviews-data.ts` → `googleReviewLink` |
| Footer contact info | `components/footer.tsx` |
| Site-wide metadata | `app/layout.tsx` |
| Schema.org structured data | `app/layout.tsx` → `jsonLd` object |

---

## Common Tasks

### Adding a new review
Edit `lib/reviews-data.ts` — add an object to the `reviews` array with: `id`, `rating`, `text`, `customerName` (First + Last Initial), `location` (City, GA).

### Adding a new gallery image pair
Edit `app/gallery/page.tsx` — add an entry to the `transformations` array with `title`, `description`, `beforeImage`, `afterImage` (paths relative to `/public/`), and `services` tags. Drop the image files into `/public/gallery/`.

### Updating the campaign (seasonal rebrand)
1. Edit `lib/spring-rush-content.ts` — update `announcement.text`, `hero.*`, `ctaText.href` (SMS body), `serviceArea.text`
2. Edit `components/announcement-bar.tsx:29` — update the mobile short version
3. Edit `components/floating-cta.tsx:17` — update SMS body in the href
4. Edit `app/quote/page.tsx:21` — update the service option label
5. Edit `app/spring-rush/page.tsx` metadata title/description if this page is used in ads

### Changing the phone number
Run a project-wide search for `14076000301` and `407` to find all instances before editing. See the complete list in ARCHITECTURE.md § 4.

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL        Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   Supabase public anon key
SUPABASE_SERVICE_ROLE_KEY       Supabase service key (server-only, never expose)
ADMIN_EMAIL                     Admin login email
ADMIN_PASSWORD                  Admin login password
```

All must be set in Vercel project settings for production. For local dev, create `.env.local`.

---

## Known Issues to Be Aware Of

1. **Gallery page shows "15+ Years" but homepage shows "5+ Years"** — the correct number is 5+. The gallery stats section needs updating.

2. **`next.config.mjs` ignores TypeScript errors at build** — `ignoreBuildErrors: true`. Fix TS errors anyway; this is a safety net, not a license to ignore them.

3. **Route `/spring-rush` still named after old campaign** — all content says "Summer Special" but the URL and file stay `spring-rush`. Don't rename the route without checking for any ad campaign links pointing to it.

4. **Image optimization is disabled** — `images: { unoptimized: true }` in `next.config.mjs`. All images serve at full original file size.

5. **Admin auth uses a static cookie token** — not Supabase Auth. Simple but means only one admin account. Token is `lm5-admin-authenticated-2026`. This is checked in both `middleware.ts` and `lib/admin-auth.ts` — if you ever update the token, change it in both files.

# Roadmap — Everything Pending or Planned

> Each item has enough context to start cold. Ordered within sections roughly by leverage, but the owner sorts priorities. Cross-references: docs/GROWTH.md (reasoning), docs/DECISIONS.md (constraints), docs/sops/ (procedures).

---

## 🔴 Owner actions blocking shipped features (do these first)

> ✅ **RESOLVED (July 2026):** `005_fix_rls_scoping.sql` has been run in production Supabase and verified with a live curl test against the anon key (returned `[]`) — the lead-data leak is confirmed closed.

| Item | Why it's blocking | How |
|---|---|---|
| Run `scripts/006_create_gallery_items.sql` | Admin Gallery tab uploads fail without the table + bucket | SQL Editor → paste → run → verify queries at file bottom (docs/sops/gallery-migration.md) |
| Set `NEXT_PUBLIC_SENTRY_DSN` in Vercel | Error tracking is silently off | sentry.io → create Next.js project → copy DSN → Vercel env vars (Prod+Preview) → redeploy |
| Set `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` | Speed-to-lead emails are silently off — leads wait for an /admin check | Sign up at resend.com **with lawnmastersv5@gmail.com** (onboarding sender only delivers to account owner), create key, set vars, redeploy. Later: verify lawnmastersv5.com domain |
| Google Business Profile buildout | #1 growth lever, gates the review flywheel and LSA | docs/GROWTH.md § 1 |
| Send "First 15" review texts | 3 placeholder reviews are hurting trust; blocks AggregateRating schema + LSA | docs/GROWTH.md § 4 |

## 🟠 Engineering — ready to build (Claude can start immediately)

- **City pages ×3** — Porterdale, Social Circle, Monroe. Template: `lib/city-pages.ts` + `app/lawn-care/[city]/page.tsx`; neighborhood hooks in BUSINESS_PLAYBOOK § 2. Follow docs/sops/adding-a-city-page.md. Add to sitemap automatically (it maps cityPages).
- **FAQ sections + FAQPage schema** on city pages + /services. Answer real local queries (cost, contracts, scheduling, Spanish service). Keep answers consistent with service-policies page.
- **Open Graph tags/images** — root metadata has no `openGraph`; add og:image (brand card or hero), og:title/description per page. Matters for Nextdoor/Facebook sharing (growth channel).
- **Per-visit pricing math on cards** — "≈ $28/cut" on the weekly plan (springRush.pricing consumers: homepage, /summer, city pages). Highest-leverage copy change identified by the pricing analysis.
- **Premium anchor tier card** ("Full Property Care") — needs owner's price (~$199–249/mo) before shipping.
- **"Refresh + Keep" bundle on /summer** (~$297 PW + first month weekly) — needs owner price approval.
- **Review/referral SMS template bank (EN+ES)** + printable QR review card — deliver as docs or a small /admin reference page.
- **Georgia Lawn Calendar page** + seasonal upsell SMS templates (retention system, docs/GROWTH.md § 6).
- **Admin upsell flags** — clients tab: flag e.g. "3+ months active, no PW recorded". Data already in `clients` table.
- **Seasonal GA lawn-content pages** (4–6 long-tail guides) — owner fact-checks agronomy before publish.
- **Swap real reviews into lib/reviews-data.ts** as they arrive (First name + last initial + city format), then add AggregateRating schema (gated — see DECISIONS.md).

## 🟡 Engineering — maintenance / hardening

- **Next.js upgrade** — repo pinned to next@16.0.10, which had HIGH advisories (middleware bypass, server-action CSRF) flagged in the session-6 audit. `pnpm add next@latest` → full Cypress suite → deploy. Mitigated meanwhile by per-action auth guards, but do it.
- **Delete dead code:** `styles/globals.css` (unused duplicate), `scripts/002_create_admin_user.sql` (dev-only, confusing auth story), possibly `lib/supabase/proxy.ts` + `server.ts` + `client.ts` (unused Supabase-auth wiring — verify no imports first), orphaned leaflet packages.
- **Admin Messages tab is now historic-only** — the contact form was replaced by the quick-lead flow (writes to quote_submissions), so no new contact_messages rows arrive. Once old messages are handled, consider hiding/removing the tab (and eventually the table).
- **CI (GitHub Actions):** lint + `tsc --noEmit` + Cypress on push. Removes the "run tests locally before pushing" honor system; the repeated pattern of Claude sessions running the suite manually is the cost of not having this.
- **Rate limiter durability** — in-memory Map resets per serverless instance/cold start. Fine at current traffic; move to Upstash/Vercel KV if abuse appears.
- **Timing-safe credential compare** in `lib/admin-auth.ts` (`crypto.timingSafeEqual`) — low severity, cheap fix.
- **Image optimization migration** — longer term: flip off `images.unoptimized`, remove the manual variant system. Decide against Vercel image-transform pricing.
- **`006` follow-ups:** gallery item edit/reorder UI (sort_order exists in schema, no UI), publish/unpublish toggle (column exists).

## 🔵 Separate repo / out of scope here

- **Dashboard UI fix (separate repo)** — noted as pending from a prior session's list; the admin-facing operations dashboard work lives outside this website repo. Confirm repo name with owner before starting.

## 🟣 GBP housekeeping (owner — new since the Georgia profile went live)

- **Decide the fate of the old Orlando/Florida GBP** (same account: successblueprint90@gmail.com). Options: mark it "permanently closed" or update it as moved — leaving two active profiles under one brand risks review-splitting and confusing local-ranking signals. If the Florida profile holds valuable old reviews, weigh that before closing (reviews don't transfer). Decide before pushing hard on review collection.
- **Optional review-link upgrade:** the current `share.google` link opens the business panel (visitor clicks Reviews → Write a review). GBP dashboard → "Ask for reviews" generates a link that opens the rating dialog directly — one less click. One-line swap in `lib/reviews-data.ts` when grabbed **from the Georgia profile**.

## 🟢 Campaign operations (owner, from SUMMER_CAMPAIGN_2026.md)

- Print door hangers; first 150 in Covington Hwy 278 + Conyers (week-by-week plan in campaign doc § 9)
- Real Newton County before/after photos → replace gallery placeholders on /summer proof section
- Instagram content calendar start date; move "Se Habla Español" into IG bio
- First-neighborhoods priority order (only unfilled owner decision in campaign doc § 10)
- Yard signs, HOA letters, realtor one-pagers once drafted (🔨 available on request)

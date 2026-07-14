# Roadmap — Everything Pending or Planned

> Each item has enough context to start cold. Ordered within sections roughly by leverage, but the owner sorts priorities. Cross-references: docs/GROWTH.md (reasoning), docs/DECISIONS.md (constraints), docs/sops/ (procedures).

---

## 🔴 Owner actions blocking shipped features (do these first)

> ✅ **RESOLVED (July 2026):** `005_fix_rls_scoping.sql` has been run in production Supabase and verified with a live curl test against the anon key (returned `[]`) — the lead-data leak is confirmed closed.

| Item | Why it's blocking | How |
|---|---|---|
| Run `scripts/006_create_gallery_items.sql` | Admin Gallery tab uploads fail without the table + bucket | SQL Editor → paste → run → verify queries at file bottom (docs/sops/gallery-migration.md) |
| Set `NEXT_PUBLIC_SENTRY_DSN` in Vercel | Error tracking is silently off | sentry.io → create Next.js project → copy DSN → Vercel env vars (Prod+Preview) → redeploy |
| ~~Set `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL`~~ ✅ **DONE 7/6/2026** | Speed-to-lead email is LIVE — keys were added to Vercel by the owner | Remaining polish: verify lawnmastersv5.com as a Resend sending domain (DNS records go in **Vercel DNS**, not Hostinger) |
| Google Business Profile buildout | Profile is **verified & approved (7/10/2026)** ✅ — now needs photos, categories, service area, weekly posts; gates the review flywheel and LSA | docs/GROWTH.md § 1 |
| ★ **Set the GEORGIA price sheet** | Every dollar on the site + docs is Florida-era and known-underpriced for GA lot sizes (weekly likely $150+/mo, ~$50/cut, Refresh tiers $349/$749/$1,499 proposals). Blocks the repricing pass AND the site repositioning below | Owner decides numbers; then edit the pricing locations list below in one pass |
| **Google Search Console setup** | Nothing tells us what searches the FAQ/city pages are winning until this exists | Follow docs/sops/google-search-console.md exactly (~15 min; TXT record goes in VERCEL DNS) |
| **Supply your first name** | Unblocks the founder/E-E-A-T schema (already wired, dormant) + a named-owner line on /about | One line: `ownerFirstName` in `lib/business-info.ts` — tell Claude the name and it ships |
| Ask for a review at every GA job's walk-through | Cold start: zero GA clients — reviews come one job at a time (the old "text the First 15" plan assumed the Florida client list) | Script in docs/NOTEBOOK.md § 5 |

## 🟠 Engineering — ready to build (Claude can start immediately)

- **★ REPOSITION THE SITE to transformation-first (new top item, session 12)** — homepage + /summer currently sell mowing plans first; the business now leads with Refresh packages (docs/OFFERS.md). Blocked ONLY on owner confirming tier names/prices ($349/$749/$1,499 proposals). Drafted hero: *"Covington's Property Refresh Specialists — we transform overgrown, dirty, and neglected yards into clean, beautiful properties. ✓ Yard Cleanups ✓ Mulch Installation ✓ Pressure Washing ✓ Shrub Trimming ✓ Lawn Maintenance (last, on purpose) — Free On-Site Estimate."* Scope: hero + pricing sections to tier cards, quick-lead flow options already fit, keep maintenance plans as the visible back end, update affected Cypress specs.

- **City pages ×3** — Porterdale, Social Circle, Monroe. Template: `lib/city-pages.ts` + `app/lawn-care/[city]/page.tsx`; neighborhood hooks in BUSINESS_PLAYBOOK § 2. Follow docs/sops/adding-a-city-page.md. Add to sitemap automatically (it maps cityPages). **New cities must include 2 unique `faqs` entries** (the interface requires them).
- ~~**FAQ sections + FAQPage schema**~~ ✅ **DONE (session 14):** dedicated /faq (12 Q&As, FAQPage schema, nav+footer+sitemap) + per-city Q&As with question headings + FAQPage schema + HowTo schema on /quote + canonical tags on every page. Remaining optional: a small FAQ block on /services itself.
- ~~**Open Graph tags/images**~~ ✅ **DONE (session 13):** root `openGraph` + `twitter` metadata + `metadataBase` + `public/og-image.jpg` (1200×630). Optional polish: per-page og:title/description overrides.
- **★ SITE-WIDE REPRICING PASS (blocked on the owner's GA price sheet — do it in ONE commit).** Every place a price renders or is declared:
  1. `lib/spring-rush-content.ts` → `hero.subheadline` ("$120/month*") + `pricing.plans` ($90 / $120 / $45–$55) — consumed by BOTH the homepage pricing cards and the /summer mowing-plan cards
  2. `app/page.tsx` → metadata description ("Starting at $120/mo")
  3. `app/layout.tsx` → root metadata description ("Weekly mowing from $120/mo") + `jsonLd.priceRange` ("$45–$120/mo")
  4. `lib/summer-content.ts` → `meta.description` ("from $197"), `pressureWashing.packages` ($197/$250/$400/$300/$1.50-ft), `landscaping.packages` ($300/$150/$250/$125/$125)
  5. `lib/city-pages.ts` → all three `description` fields ("from $90/mo") AND the per-city `faqs` answers (quote $90/$120/$197/$300)
  6. `app/faq/page.tsx` → the cost answer ($90–$120/$45/$197) + the pressure-washing answer ($197)
  7. Docs that quote prices: SUMMER_CAMPAIGN_2026.md, docs/BUSINESS_PLAYBOOK.md § 3, docs/OFFERS.md, docs/NOTEBOOK.md § 3
  ⚠️ Prices are owner-locked — do not change any of these until the owner hands over the GA numbers.
- **Per-visit pricing math on cards** — superseded until repricing: the old "≈ $28/cut" math was Florida-priced and is WRONG for GA. Re-derive from the GA sheet, then ship.
- **Premium anchor tier card** ("Full Property Care") — needs owner's GA price before shipping.
- **"Refresh + Keep" bundle on /summer** (PW + first month weekly) — needs owner's GA price before shipping.
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

# Growth Knowledge Base

> Distilled from the session-9 six-category growth analysis (Hormozi pricing-strategy, value-perception, objection-destroyer, and productize frameworks applied against real numbers), plus SUMMER_CAMPAIGN_2026.md and output/HORMOZI_SUMMER_OFFER.md.
> Status legend: ✅ done · 🔨 Claude-buildable on request · 👤 owner-only action · 💰 owner decision + money

---

## The Two Strategic Truths (read these before any growth work)

1. **Route density is the filter.** The unit economics require multiple clients per street. Any channel that produces scattered leads 20 minutes apart is a bad channel *even if the leads are cheap*. Physical/hyperlocal beats broad digital for this business at this stage.
2. **Google Business Profile beats everything else in this file.** "Lawn care covington ga" is won in the map pack (proximity + reviews + profile activity), not by on-site schema. Until the GBP is verified, categorized, photographed, and accumulating reviews, every other SEO effort is the second-most-important thing. 👤

---

## 1. SEO & Organic

**Done ✅:** valid LocalBusiness/HomeAndConstructionBusiness JSON-LD with `@id`, Service ItemList on /services, 3 city pages (covington/conyers/oxford) with unique neighborhood copy + Service/Offer schema, sitemap.xml, robots.txt, canonicals, footer crawl links.

**Pending:**
- 👤 **GBP setup** (see truth #2) — all 7 service categories, 6-city service area, weekly photo uploads, offer posts. ~1 hour. Highest-ROI item in this document.
- 🔨 City pages for Porterdale, Social Circle, Monroe (template + neighborhood hooks exist — new cities must include `faqs` entries).
- ✅ FAQ built (July 2026): dedicated /faq (12 Q&As + FAQPage schema, nav+footer linked) AND per-city Q&As with question-phrased headings + FAQPage schema on all city pages. /quote carries HowTo schema. Canonical tags on every page. This was the AEO 3/10 fix.
- 🔨 Seasonal Georgia content (4–6 guides: pre-emergent timing in Newton County, Bermuda vs Zoysia heights) — compounding long-tail; owner fact-checks agronomy.
- ✅ Open Graph + Twitter card tags shipped July 2026 (root layout, `public/og-image.jpg` 1200×630). Per-page og:title/description overrides remain 🔨 optional polish.
- 👤 Citations: consistent NAP on Yelp, Angi, Thumbtack, BBB, Nextdoor Business (~2 hrs, free).
- 👤 Google Search Console verification + sitemap submission — **exact steps ready: docs/sops/google-search-console.md** (TXT record goes in VERCEL DNS, sitemap submitted as the www URL).
- 🔨(gated) AggregateRating schema — ONLY after real reviews exist. Never on placeholders (manual-action risk).

## 2. Local & Community Marketing

Stacks on the existing door-hanger system (weekly targets + neighborhood-specific hooks in SUMMER_CAMPAIGN_2026.md § 6, reproduced in docs/BUSINESS_PLAYBOOK.md § 2).

- 👤 **Nextdoor** — claim business page; the real win is personal-profile responses to "anyone know a lawn guy?" threads (weekly occurrence; first credible answer + before/after photo wins the street). 🔨 response-template bank.
- 👤💰 **Yard signs at serviced homes** ("Lawn by Lawn Masters V5 + QR → /summer", ~$4/sign, $10-off sweetener for permission) — the route-density flywheel made physical. 🔨 sign copy/QR design.
- 🔨👤 **HOA outreach** (Hwy 138 Conyers corridor): letter offering a street rate — 3+ homes on one street, $10/mo off each. Turns HOA pressure into distribution.
- 🔨👤 **Realtor partnerships**: "Listing-Ready Package" (~$297 cleanup + driveway PW) one-pager for Covington agents.
- 👤 **Spanish-first posts** weekly in Newton County Facebook/community groups — the bilingual moat, exercised. 🔨 post drafts.

## 3. Paid Advertising — the honest position

**Not yet.** Three reasons (recorded in docs/DECISIONS.md so future sessions don't re-litigate):
1. Ads amplify what exists — landing paid traffic on 3 placeholder reviews burns money and trust.
2. Broad-radius digital leads violate route density (truth #1).
3. Free channels (GBP/Nextdoor/signs/hangers) are nowhere near saturated; paying to skip compounding free work is a bad trade.

**The one exception — Google Local Services Ads (LSA):** pay-per-lead (~$25–50/lead lawn care), budget-cappable, "Google Guaranteed" badge substitutes for a thin review profile. **Trigger: 10+ real reviews AND unfilled route capacity.** Requires background check + license/insurance verification to enroll — confirm Georgia requirements before applying. 💰
**If testing Meta despite advice:** $5–10/day boosted before/after reel, geo-fenced to Covington+Conyers only, → /summer. Treat as a $150 experiment. 💰

## 4. Reviews & Referrals (objection-destroyer output)

**Problem:** 3 placeholder reviews actively signal filler — and the Georgia client base is ZERO (the ~13 recurring clients were Florida; they can't review the Georgia GBP). Reviews must be earned one Georgia job at a time: the ask happens at every walk-through, at peak wow, starting with job #1.

**Objection map:**
| Client's hidden belief | Counter |
|---|---|
| "Effort / I'll do it later" | Direct g.page link texted within 2 h of a service — one tap while the lawn smells cut |
| "Don't know what to write" | Prompt them: "one line about the crew showing up on time helps" |
| "Only had one cut, too soon" | Ask after 2nd–3rd cut, or right after a transformation reveal (peak wow) |
| "Privacy" | "First name + neighborhood is all anyone sees" |
| Referral: "awkward selling friends" | Two-sided gift reframe: friend gets $30 off, you get $30 off — "you're saving them the flaky-lawn-guy lottery" |

**The First 15 plan (rewritten July 2026 — cold start, no client list to text):** 👤 the review ask is built into EVERY job's walk-through (script in docs/NOTEBOOK.md § 5), EN+ES, link texted on the spot; QR card after every high-ticket reveal. **Never incentivize reviews** (Google prohibition — profile-nuke risk); incentivize referrals instead ("Good Neighbor Program": $30 off both sides — **no free cuts or free months; the owner gives no free service**).
🔨 buildable: SMS/WhatsApp template bank (EN+ES), printable QR card, site referral section, swapping real reviews into `lib/reviews-data.ts` as they land.

## 5. Offers & Pricing (pricing-strategy + value-perception output)

> ⚠️ **SUPERSEDED IN PART (July 2026):** this analysis was run against the FLORIDA price sheet ($90/$120/$45–55). The owner has since flagged those numbers as **too low for Georgia property sizes** — weekly likely $150+/mo, per-visit ~$50/cut territory, priced per property. The *structural* advice below (anchoring, tiers, per-visit framing) survives; **every dollar figure needs re-running against the GA sheet once the owner sets it.** Also: the old "$28/visit" math is dead — do not resurrect it.

Recommendations (all copy 🔨 buildable; numbers 💰 owner decisions):
1. **Show per-visit math on the pricing cards** — highest-leverage copy change available (with GA numbers, once set).
2. **Add a premium anchor tier** — "Full Property Care" (weekly mow + quarterly bed touch-up + annual PW) — repositions the weekly plan as the value pick; occasional buyers become multi-service clients.
3. **Credit-back trial:** flat one-time cut that converts into the $20-off Starter Cut if they join a plan within 7 days (no free cuts — owner rule).
4. **Bridge bundle "Refresh + Keep":** driveway PW + first month weekly — one purchase decision instead of an upsell conversation. 💰 price it off the GA sheet.
5. **Price integrity:** grandfather early GA clients at their signup rate (the retention rate-lock); raise for NEW clients once 10+ reviews exist.
6. **Naming/framing:** make hidden value explicit on every card — no contracts · missed-cut guarantee · same crew every visit · priority scheduling · English/Español.

## 6. Retention (productize output)

**Insight:** the admin `clients` table already tracks frequency + next-due — the retention DATA exists; the SYSTEM doesn't. Churn killer = winter; growth killer = mow-only clients.

1. 🔨 **"Georgia Lawn Calendar"** — productize the year: Mar pre-emergent/spring cleanup → Apr–Oct mowing → Jun PW → Sep aeration/overseed → Nov leaves → Dec gutters. Publish as a page + one seasonal upsell text per slot. Clients buying 2+ service types churn dramatically less.
2. 💰 **Winter Keeper downsell** (~$45/mo, one visit: leaves/gutter/lookover) offered at cancellation attempts Nov–Feb — keeps the route slot and the relationship.
3. 💰 **Rate-lock loyalty:** "your price never rises while continuously subscribed" — costs nothing today, makes leaving permanently expensive, pairs with new-client price raise.
4. 💰 **Milestone perk:** 6 continuous months = free add-on (shrub trim) — high perceived value, ~20 min marginal cost on an existing route.
5. 🔨 **Communication cadence:** day-after-first-cut check-in text; monthly one-line "what we did" summary (nobody local does this — it makes invisible work visible).
6. 🔨 **Admin upsell flags:** surface "client 3+ months, no PW on record" style prompts in the clients tab.
7. 💰 **Annual prepay** ~10% off — cash now, churn-proof by definition.

---

## Campaign Reference (from SUMMER_CAMPAIGN_2026.md — owner-locked decisions)

Campaign: **Summer Refresh** · Hero: "Your Property Deserves More Than a Mow" · Lead services: Driveway PW from $197, Full Bed Refresh from $300 · Bonus: **The Summer Starter Cut** ($20 OFF the first mow — never free, owner directive July 2026; the $20 is a starting number to validate after 10 quotes; named, featured — never buried) · Guarantee: "Not satisfied? We redo it. No questions asked." · Honest scarcity: route-density waitlist language · Se Habla Español at hero level · Door hangers: neighborhood-specific front hooks (table in BUSINESS_PLAYBOOK § 2) + mowing-conversion back panel with QR → /summer · Instagram: 8 post concepts + reels, Spanish-first weekly, hashtag bank in campaign doc § 7 · Follow-up cadence: same-day upsell → Day 3 text → Day 10 text → Day 30 re-engage (scripts in campaign doc § 4).

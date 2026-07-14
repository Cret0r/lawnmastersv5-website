# SOP: Google Search Console Setup (owner action, ~15 minutes)

> Goal: verify lawnmastersv5.com in Google Search Console (GSC) and submit the sitemap so Google indexes every page — including the FAQ and city pages built for search.
> Key facts before you start: the **primary host is `www.lawnmastersv5.com`** (the apex redirects to it). The domain is registered at **Hostinger**, but **DNS is managed in VERCEL** — any verification DNS record goes into Vercel, NOT Hostinger (Hostinger's DNS panel does nothing while the nameservers point at Vercel).

---

## Part 1 — Verify the domain (one time)

1. Go to **https://search.google.com/search-console** and sign in.
   ⚠️ Use the **successblueprint90@gmail.com** account (the one that owns the Google Business Profile) so GBP and Search Console live under one login.
2. Click **Add property**. You'll see two options — pick **Domain** (the left box). Enter exactly: `lawnmastersv5.com` (no www, no https — Domain properties cover every variant automatically).
3. Google shows a **TXT record** to copy (looks like `google-site-verification=xxxxxxxx`). Copy it.
4. Open **vercel.com** (log in with your GitHub account) → your team → the **lawnmastersv5-website** project → **Settings → Domains** → click `lawnmastersv5.com` → **DNS Records** (or use the team-level "Domains" tab → lawnmastersv5.com → DNS).
5. Add a record:
   - **Type:** TXT
   - **Name:** leave blank (or `@`)
   - **Value:** paste the whole `google-site-verification=...` string
   - Save.
6. Back in Search Console, click **Verify**. If it fails, wait 10–15 minutes (DNS propagation) and click Verify again — do NOT re-add the record.
7. Done — the property never needs re-verifying as long as the TXT record stays in Vercel DNS.

## Part 2 — Submit the sitemap (one time)

1. In Search Console, left menu → **Sitemaps**.
2. Enter: `https://www.lawnmastersv5.com/sitemap.xml` (use the **www** URL — the apex version just redirects).
3. Click **Submit**. Status should turn to "Success" within a day; it lists ~13 discovered URLs (home, services, quote, summer, gallery, faq, about, contact, service-policies + 3 city pages).

## Part 3 — Weekly check (2 minutes, do it with the Sunday scorecard)

1. **Performance** tab → set the date range to "Last 28 days":
   - **Queries:** what people typed to find you. Watch for "lawn care covington ga", "pressure washing covington", and the FAQ-style questions.
   - **Pages:** which pages get impressions. The /faq and city pages should start appearing within a few weeks.
2. **Indexing → Pages:** the "Not indexed" count should shrink over time. New pages can take 1–2 weeks — that's normal. If a page you care about says "Crawled — currently not indexed," give it a month before worrying.
3. **One-off boost:** paste any new page's URL into the top search bar → **Request indexing**. Do this once for /faq and each city page after setup.
4. Red flags worth telling Claude about: a sudden drop to zero impressions, "Page with redirect" on www URLs, or any **Manual actions** entry (left menu — should always say "No issues").

## Notes

- GSC data lags ~2 days; day-of-launch zeros are normal.
- This pairs with the GBP: Search Console = the website's search performance; business.google.com = the map-pack listing. Both matter, GBP more (docs/GROWTH.md truth #2).
- If Vercel ever stops managing DNS (nameserver change), the TXT record must be recreated wherever DNS moves, or verification silently lapses.

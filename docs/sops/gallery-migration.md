# SOP: Running the Gallery Migrations (006, 007, 008)

The admin Gallery tab fails soft until these run — actions error with a message pointing at whichever script is missing, and the public pages fall back gracefully (never broken, just missing the feature that depends on the missing column/table).

## 006 — base table (if not already run)
Supabase Dashboard → SQL Editor → New Query → paste ALL of `scripts/006_create_gallery_items.sql` → Run.
Creates: `gallery_items` table (RLS: service_role only) + public `gallery` storage bucket. Idempotent.

## 007 — featured/order/single-image support (if not already run)
Paste ALL of `scripts/007_gallery_migration_and_features.sql` → Run. Idempotent.
Adds `featured`, `item_type` columns, relaxes `after_url` to nullable, and migrates the 12 originally-hardcoded gallery items into real, admin-editable rows (fixed IDs, safe to re-run).

## 008 — independent /gallery ordering (session 18 — **run this now**)
Paste ALL of `scripts/008_gallery_independent_order.sql` → Run. Idempotent.
Adds `gallery_order`, backfilled from the current `sort_order` so /gallery's display order is **unchanged** the moment this runs. From then on:
- `sort_order` → **homepage** featured order only
- `gallery_order` → **/gallery page** order only, fully independent

Verify:
```sql
select id, title, sort_order, gallery_order from public.gallery_items order by gallery_order;
```

## End-to-end test (covers all three)
1. Log into /admin → Gallery tab.
2. Add a before/after item — thumbnail previews appear under each photo input before you submit.
3. Add a single-image item — only one photo input shows.
4. **Feature** an item (star button) → confirm it appears on the homepage. Unfeature → confirm it disappears.
5. **Gallery order**: use the "Gallery" Up/Down arrows (always visible, ChevronUp/Down icons) → confirm /gallery's item order changes to match.
6. **Homepage order**: use the "Home" Up/Down arrows (only visible on featured items, ArrowUp/Down icons) → confirm the homepage's order changes, and confirm the /gallery order is **unaffected** by this.
7. **Portfolio grid**: visit /gallery → confirm a 2-column (desktop) / 1-column (mobile) grid of compact cards, not a long scroll. Click a card → the full interactive before/after slider (or enlarged photo for single-image items) opens in a modal with the full description and services. Press Escape or click outside → it closes.
8. Edit an item (including one of the originally-migrated 12) → title/description/services/photos update in place, no duplicate row.
9. Delete → row and Storage objects (for real uploads; migrated items point at /public files, nothing to clean up there) are gone.
10. Confirm every control above is invisible/unreachable when logged out.

## Leak check (RLS)
`curl "https://<project>.supabase.co/rest/v1/gallery_items?select=*" -H "apikey: <ANON_KEY>"` → expect `[]`/permission error. No policy changes were needed in 007 or 008 — the app never reads this table with the anon key, always the server-side service-role client in `lib/gallery.ts`.

## Notes
- `serverActions.bodySizeLimit: "20mb"` in next.config.mjs — required for two-photo uploads, don't remove.
- The homepage's before/after section and /gallery's grid are both admin-controlled with no hardcoded fallback — see docs/DECISIONS.md for why (Florida-photo mislabeling incident).
- Filter tabs on /gallery are derived live from real service tags (any tag on 2+ items, top 6 by frequency) — not a hand-picked category list, so they never drift out of sync with the data.
- Cypress (`cypress/e2e/gallery-admin.cy.ts`) covers public/admin isolation and the grid/lightbox unconditionally, and the full logged-in CRUD/reorder flow when the sandbox running it can actually reach a live Supabase connection (some can't — see docs/GOTCHAS.md — in which case those tests skip cleanly rather than fail).

# SOP: Running the Gallery Migrations (006–009)

The admin Gallery tab fails soft until these run — actions error with a message pointing at whichever script is missing, and the public pages fall back gracefully (never broken, just missing the feature that depends on the missing column/table).

## 006 — base table (if not already run)
Supabase Dashboard → SQL Editor → New Query → paste ALL of `scripts/006_create_gallery_items.sql` → Run.
Creates: `gallery_items` table (RLS: service_role only) + public `gallery` storage bucket. Idempotent.

## 007 — featured/order/single-image support (if not already run)
Paste ALL of `scripts/007_gallery_migration_and_features.sql` → Run. Idempotent.
Adds `featured`, `item_type` columns, relaxes `after_url` to nullable, and migrates the 12 originally-hardcoded gallery items into real, admin-editable rows (fixed IDs, safe to re-run).

## 008 — independent /gallery ordering (if not already run)
Paste ALL of `scripts/008_gallery_independent_order.sql` → Run. Idempotent.
Adds `gallery_order`, backfilled from the current `sort_order` so /gallery's display order is unchanged the moment this runs.
- `sort_order` → **homepage** featured order only
- `gallery_order` → **/gallery page** order only, fully independent

## 009 — admin-assigned categories (session 19 — **run this now**)
Paste ALL of `scripts/009_gallery_categories.sql` → Run. Idempotent.
Adds `category` (text, defaults to `'Other'`), with a one-time best-guess backfill for existing rows based on their services (keyword matching — a starting point, not a final answer). The category list itself lives in `lib/gallery-categories.ts` — edit that file to add/rename/remove categories; if you do, keep the SQL's keyword guesses roughly in sync for future backfills (existing rows are unaffected either way, since category is plain text per row, not a DB enum).

Verify:
```sql
select title, services, category from public.gallery_items order by category, title;
```
Spot-check the guesses — fix any wrong ones from /admin's Gallery tab (one dropdown per item, no need to re-run the script).

## End-to-end test (covers all four)
1. Log into /admin → Gallery tab.
2. Add a before/after item — thumbnail previews appear under each photo input before you submit, and pick a Category from the dropdown.
3. Add a single-image item — only one photo input shows.
4. **Feature** an item (star button) → confirm it appears on the homepage. Unfeature → confirm it disappears.
5. **Gallery order**: use the "Gallery" Up/Down arrows (always visible) → confirm /gallery's item order changes to match.
6. **Homepage order**: use the "Home" Up/Down arrows (only visible on featured items) → confirm the homepage's order changes, and confirm the /gallery order is **unaffected** by this.
7. **Category**: change an existing item's category using the dropdown directly in its row (no need to open Edit) → confirm it saves (toast + persists after a page reload).
8. **Portfolio grid**: visit /gallery → confirm a 2-column (desktop) / 1-column (mobile) grid, each card showing the FULL interactive slider inline (drag the handle right there in the grid — no click, no modal). Single-image items show as a plain enlarged photo, no slider handle.
9. **Filter tabs**: confirm tabs match the categories actually assigned to published items (not service tags) — click one, confirm only matching items show.
10. Edit an item (including one of the originally-migrated 12) → title/description/services/photos update in place, no duplicate row.
11. Delete → row and Storage objects (for real uploads; migrated items point at /public files, nothing to clean up there) are gone.
12. Confirm every control above is invisible/unreachable when logged out.

## Leak check (RLS)
`curl "https://<project>.supabase.co/rest/v1/gallery_items?select=*" -H "apikey: <ANON_KEY>"` → expect `[]`/permission error. No policy changes were needed in 007, 008, or 009 — the app never reads this table with the anon key, always the server-side service-role client in `lib/gallery.ts`.

## Notes
- `serverActions.bodySizeLimit: "20mb"` in next.config.mjs — required for two-photo uploads, don't remove.
- The homepage's before/after section and /gallery's grid are both admin-controlled with no hardcoded fallback — see docs/DECISIONS.md for why (Florida-photo mislabeling incident).
- **Filter tabs read the admin-assigned `category` field** (session 19) — not auto-derived service tags anymore. "All" plus whatever categories currently have at least one published item.
- The click-to-expand lightbox/modal was removed (session 19) — every grid card IS the full interactive slider now, no separate expanded view.
- Cypress (`cypress/e2e/gallery-admin.cy.ts`) covers public/admin isolation and the grid unconditionally, and the full logged-in CRUD/reorder/category flow when the sandbox running it can actually reach a live Supabase connection (some can't — see docs/GOTCHAS.md — in which case those tests skip cleanly rather than fail).

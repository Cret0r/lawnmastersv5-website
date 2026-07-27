# SOP: Running the Gallery Migrations (006, 007) & Verifying the Admin Gallery Manager

The admin Gallery tab fails soft until 006 runs — uploads error with "Has scripts/006 been run?", and /gallery shows only the hardcoded items. 007 (session 16) adds homepage featuring, ordering, and single-image support — until it runs, Feature/single-image actions error with "Has scripts/007 been run?" and the homepage's before/after section stays empty (by design — see docs/GOTCHAS.md).

## 006 — base table (if not already run)
1. Supabase Dashboard → SQL Editor → New Query → paste ALL of `scripts/006_create_gallery_items.sql` → Run.
   Creates: `gallery_items` table (RLS: service_role only) + public `gallery` storage bucket. Idempotent — safe to re-run.
2. Verify:
   ```sql
   select * from pg_policies where tablename = 'gallery_items';  -- expect service_role_all_gallery_items
   select id, public from storage.buckets where id = 'gallery';  -- expect public = true
   ```

## 007 — featured / ordering / single-image support (session 16 — **run this now**)
1. Supabase Dashboard → SQL Editor → New Query → paste ALL of `scripts/007_gallery_enhancements.sql` → Run. Idempotent — safe to re-run.
   Adds: `featured` boolean, `item_type` ('before_after' | 'single'), relaxes `after_url` to nullable for single-image items, a partial index on featured items. No new RLS policies needed (see notes below).
2. Verify:
   ```sql
   select column_name, is_nullable from information_schema.columns
     where table_name = 'gallery_items' and column_name in ('featured','item_type','after_url');
   select conname from pg_constraint where conrelid = 'public.gallery_items'::regclass;
   ```

## End-to-end test (covers both migrations)
1. Log into /admin → Gallery tab.
2. **Before/after item:** pick photos for Before and After — a thumbnail preview appears under each input before you submit. Add it. It appears in the list.
3. **Single-image item:** switch the type toggle to "Single Image" — only one photo input shows. Add it. It appears with one thumbnail (no slider) on /gallery.
4. **Feature it:** click the star/Feature button on either item → badge shows "Featured" → open `/` (homepage) → confirm it renders in the "Real Before & After Transformations" section. Click Feature again to unfeature → confirm it disappears from the homepage (but stays on /gallery if still published).
5. **Reorder:** use the ↑/↓ buttons — order changes on both /gallery and the homepage's featured list (same `sort_order` column drives both).
6. **Publish/unpublish:** the eye-icon toggle hides an item from /gallery without deleting it (and auto-unfeatures it, since a hidden item has no business on the homepage).
7. **Edit:** click Edit → change title/description/services, optionally replace one or both photos → Save → confirm it updates in place (no duplicate row) and, if you replaced a photo, the old Storage object is gone (Storage → gallery bucket).
8. **Delete:** confirm it removes the row and both Storage objects.
9. Confirm every step above is invisible/unreachable when logged out (no Add/Edit/Delete/Feature controls anywhere on the public site, `/gallery` and `/` are read-only).

## Leak check (RLS)
`curl "https://<project>.supabase.co/rest/v1/gallery_items?select=*" -H "apikey: <ANON_KEY>"` → expect `[]`/permission error. The photos themselves are public by design via the bucket CDN URL; the table rows are not. This is intentionally stricter than "anon may read published items" — the app never uses the anon key to read this table (always the server-side service-role client in `lib/gallery.ts`), so there's nothing for an anon SELECT policy to grant that the app actually needs. No new policies were added in 007.

## Notes
- `serverActions.bodySizeLimit: "20mb"` in next.config.mjs is what makes two-photo uploads possible — don't remove it.
- The homepage's "Real Before & After Transformations" section is fully admin-controlled (session 16) — it renders zero items and hides itself entirely until you feature at least one real item. There is no hardcoded fallback (the old one was Florida-era photos mislabeled as Covington/Conyers — removed).
- Number of homepage items = however many you've featured; order = the same `sort_order` the ↑/↓ buttons write. No separate "max N" setting.
- Cypress (`cypress/e2e/gallery-admin.cy.ts`) covers public/admin isolation unconditionally, and the full create/edit/feature/delete flow when it can actually log in **and** reach the dashboard (some sandboxed environments can't — see docs/GOTCHAS.md — in which case those tests skip cleanly rather than fail).

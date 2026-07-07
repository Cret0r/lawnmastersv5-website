# SOP: Running the Gallery Migration (006) & Verifying Uploads

The admin Gallery tab (session 8) fails soft until this runs — uploads error with "Has scripts/006 been run?", and /gallery shows only the hardcoded items.

1. Supabase Dashboard → SQL Editor → New Query → paste ALL of `scripts/006_create_gallery_items.sql` → Run.
   Creates: `gallery_items` table (RLS: service_role only) + public `gallery` storage bucket. Idempotent — safe to re-run.
2. Verify:
   ```sql
   select * from pg_policies where tablename = 'gallery_items';  -- expect service_role_all_gallery_items
   select id, public from storage.buckets where id = 'gallery';  -- expect public = true
   ```
3. End-to-end test: log into /admin → Gallery tab → upload a title + before + after (JPG/PNG/WebP, ≤8 MB each) → item appears in the list → open /gallery: the item renders ABOVE the hardcoded transformations → delete it from the tab → confirm gone from /gallery and the two objects removed from Storage → gallery bucket.
4. Leak check (RLS): `curl "https://<project>.supabase.co/rest/v1/gallery_items?select=*" -H "apikey: <ANON_KEY>"` → expect `[]`/permission error. (The photos themselves are public by design via the bucket CDN URL; the table rows are not.)

Notes: `serverActions.bodySizeLimit: "20mb"` in next.config.mjs is what makes two-photo uploads possible — don't remove it. Sort order and publish/unpublish exist in the schema but have no UI yet (roadmap).

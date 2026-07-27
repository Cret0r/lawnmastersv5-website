-- ============================================================
-- 007_gallery_migration_and_features.sql
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- Idempotent — safe to re-run.
--
-- Two things, in order:
--
-- PART A — new columns for full admin manageability (session 17):
--   - featured boolean       (drives the homepage's before/after section)
--   - item_type text         ('before_after' | 'single')
--   - after_url made nullable (single-image items have only one photo)
--
-- PART B — migrates the 12 gallery items that have been HARDCODED in
--   app/gallery/page.tsx since the original build into this table, so
--   they become real, admin-editable rows for the first time. Their
--   images are NOT re-uploaded to Storage — they keep pointing at the
--   existing files already committed under /public (e.g. "/gallery/
--   front-yard-before.jpg"), which is a perfectly valid, permanent URL
--   for this app; only NEW uploads/replacements go through Storage.
--
--   3 of the 12 + the one item you already uploaded through admin
--   (the Fence Line Cleanup photo) are marked featured=true with
--   sort_order 0-3, matching EXACTLY what the homepage shows today —
--   so the moment the matching code deploys, nothing visibly changes.
--   You control all of this from the admin panel from then on.
-- ============================================================

-- ---------- PART A: columns ----------

alter table public.gallery_items
  add column if not exists featured boolean not null default false;

alter table public.gallery_items
  add column if not exists item_type text not null default 'before_after';

alter table public.gallery_items
  drop constraint if exists gallery_items_item_type_check;
alter table public.gallery_items
  add constraint gallery_items_item_type_check
  check (item_type in ('before_after', 'single'));

alter table public.gallery_items
  alter column after_url drop not null;

alter table public.gallery_items
  drop constraint if exists gallery_items_photo_pair_check;
alter table public.gallery_items
  add constraint gallery_items_photo_pair_check
  check (
    (item_type = 'before_after' and before_url is not null and after_url is not null)
    or
    (item_type = 'single' and before_url is not null and after_url is null)
  );

create index if not exists idx_gallery_items_featured
  on public.gallery_items (featured, sort_order)
  where featured = true;

-- ---------- PART B: migrate the 12 hardcoded items ----------
-- Fixed, deterministic IDs (not gen_random_uuid()) so this insert is
-- idempotent — re-running the script never creates duplicates.

insert into public.gallery_items
  (id, title, description, services, item_type, before_url, after_url, published, featured, sort_order)
values
  ('00000000-0000-0000-0000-000000000001',
   'Complete Backyard Cleanup & Clearing',
   'This overgrown, neglected backyard was completely cleared of weeds, debris, and dead vegetation. We restored the entire yard to a clean, maintained state ready for the homeowner to enjoy their outdoor space again.',
   array['Lawn Care','Weed Removal','Debris Cleanup','Mowing'],
   'before_after', '/real-before-backyard.jpg', '/real-after-backyard.jpg',
   true, true, 0),

  ('00000000-0000-0000-0000-000000000002',
   'Side Yard Overgrowth Removal',
   'Waist-high grass and dense weeds had completely taken over this side yard. Our crew cleared all the overgrowth, cut everything down to ground level, and restored full access to the property.',
   array['Weed Removal','Mowing','Brush Clearing','Cleanup'],
   'before_after', '/real-before-sideyard.jpg', '/real-after-sideyard.jpg',
   true, true, 1),

  ('00000000-0000-0000-0000-000000000003',
   'Front Yard Lawn Restoration',
   'Overgrown front lawn with tall grass and weeds growing into the sidewalk transformed into a neatly mowed, clean-edged property. Professional mowing and edging restored the curb appeal.',
   array['Professional Mowing','Edging','Cleanup','Lawn Care'],
   'before_after', '/gallery/front-yard-before.jpg', '/gallery/front-yard-after.jpg',
   true, true, 2),

  ('00000000-0000-0000-0000-000000000004',
   'Brick Paver Walkway Pressure Washing',
   'Years of moss and algae buildup had darkened this brick paver walkway. Our pressure washing service restored the bright red color and removed all organic growth from between the pavers.',
   array['Pressure Washing','Paver Cleaning','Moss Removal'],
   'before_after', '/gallery/brick-paver-before.jpg', '/gallery/brick-paver-after.jpg',
   true, false, 4),

  ('00000000-0000-0000-0000-000000000005',
   'Mailbox Lawn Strip Maintenance',
   'Overgrown grass around the mailbox area was professionally mowed and edged. Clean lines along the sidewalk and curb restored the neat appearance of the property entrance.',
   array['Professional Mowing','Edging','Lawn Care'],
   'before_after', '/gallery/mailbox-before.jpg', '/gallery/mailbox-after.jpg',
   true, false, 5),

  ('00000000-0000-0000-0000-000000000006',
   'Driveway Pressure Washing',
   'Heavy moss and algae staining had turned this concrete driveway dark and slippery. Professional pressure washing removed all buildup and restored the clean gray concrete surface.',
   array['Pressure Washing','Driveway Cleaning','Surface Restoration'],
   'before_after', '/gallery/driveway-before.jpg', '/gallery/driveway-after.jpg',
   true, false, 6),

  ('00000000-0000-0000-0000-000000000007',
   'Side Yard Lawn Restoration',
   'Weeds and overgrown grass had taken over this narrow side yard between properties. Professional mowing and cleanup restored the space to a well-maintained condition.',
   array['Mowing','Weed Removal','Cleanup','Edging'],
   'before_after', '/gallery/sideyard2-before.jpg', '/gallery/sideyard2-after.jpg',
   true, false, 7),

  ('00000000-0000-0000-0000-000000000008',
   'Large Backyard Mowing',
   'This spacious fenced backyard had tall, uneven grass with debris scattered throughout. Our team mowed the entire area to a uniform height and cleaned up all debris.',
   array['Professional Mowing','Debris Cleanup','Lawn Care'],
   'before_after', '/gallery/backyard2-before.jpg', '/gallery/backyard2-after.jpg',
   true, false, 8),

  ('00000000-0000-0000-0000-000000000009',
   'AC Unit Side Yard Cleanup',
   'Tall overgrown grass along the white vinyl fence near the AC unit was professionally mowed and trimmed. The area is now neat and accessible for maintenance.',
   array['Mowing','Trimming','Side Yard Cleanup'],
   'before_after', '/gallery/ac-unit-before.jpg', '/gallery/ac-unit-after.jpg',
   true, false, 9),

  ('00000000-0000-0000-0000-000000000010',
   'Mulch Bed Refresh & Edging',
   'Sparse, weedy mulch bed around the agave and sago palms was refreshed with fresh mulch and clean edging along the driveway for a polished look.',
   array['Mulching','Bed Edging','Weed Removal','Landscaping'],
   'before_after', '/gallery/mulch-before.jpg', '/gallery/mulch-after.jpg',
   true, false, 10),

  ('00000000-0000-0000-0000-000000000011',
   'Fenced Backyard Restoration',
   'Overgrown and uneven grass in this spacious fenced backyard was professionally mowed to a uniform height with clean lines along the paver walkway.',
   array['Professional Mowing','Lawn Care','Edging'],
   'before_after', '/gallery/fenced-backyard-before.jpg', '/gallery/fenced-backyard-after.jpg',
   true, false, 11),

  ('00000000-0000-0000-0000-000000000012',
   'Overgrown Lot Clearing',
   'Severely overgrown lot with waist-high weeds and debris was completely cleared down to bare ground. Brush was piled and removed to prepare the property for future use.',
   array['Lot Clearing','Brush Removal','Weed Removal','Debris Cleanup'],
   'before_after', '/gallery/lot-clearing-before.jpg', '/gallery/lot-clearing-after.jpg',
   true, false, 12)
on conflict (id) do nothing;

-- Feature the item you already uploaded through admin (the Fence Line
-- Cleanup photo) as the 4th homepage item, matching the live site today.
-- No-op (updates 0 rows) if that id doesn't exist in your table for any
-- reason — harmless either way.
update public.gallery_items
  set featured = true, sort_order = 3
  where id = 'fa9c8a7c-4368-440d-afcd-2b14fc0f465d';

-- RLS is unchanged and needs no new policy: the table stays service-role
-- only. The app never reads gallery_items with the anon key — both
-- /gallery and the homepage read it server-side via the service-role
-- client in lib/gallery.ts — so there is nothing for a public SELECT
-- policy to grant that's actually used.

-- ---------- VERIFY ----------
-- select id, title, featured, sort_order, item_type from public.gallery_items order by sort_order;
--   Expect 13+ rows: the 12 seeded items + your existing upload(s), 4 with featured = true.
-- select column_name, is_nullable from information_schema.columns
--   where table_name = 'gallery_items' and column_name in ('featured','item_type','after_url');

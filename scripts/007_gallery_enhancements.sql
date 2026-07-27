-- ============================================================
-- 007_gallery_enhancements.sql
-- Adds admin-controlled homepage featuring, ordering, and
-- single-image (no before/after pair) support to gallery_items.
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
-- Idempotent — safe to re-run.
--
-- Depends on 006_create_gallery_items.sql having already been run.
-- ============================================================

-- 1. "Feature on homepage" flag. Homepage pulls items where featured = true,
--    ordered by the existing sort_order column (admin controls order via
--    the Move Up/Down buttons — no new order column needed).
alter table public.gallery_items
  add column if not exists featured boolean not null default false;

-- 2. Item type: 'before_after' (slider, needs both photos) or
--    'single' (one photo, plain image card, no slider).
alter table public.gallery_items
  add column if not exists item_type text not null default 'before_after';

alter table public.gallery_items
  drop constraint if exists gallery_items_item_type_check;
alter table public.gallery_items
  add constraint gallery_items_item_type_check
  check (item_type in ('before_after', 'single'));

-- 3. Single-image items only have one photo — relax after_url so it can
--    be null for item_type = 'single'. before_url is always required and,
--    for single items, holds the one photo.
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

-- 4. Index to make the homepage's featured-items query cheap.
create index if not exists idx_gallery_items_featured
  on public.gallery_items (featured, sort_order)
  where featured = true;

-- RLS is unchanged and does not need new policies: the table stays
-- service_role-only (see 006). Public reads of gallery data (both /gallery
-- and the homepage) go through lib/gallery.ts, which uses the server-side
-- service-role client — the anon key never touches this table directly, so
-- there is nothing for an anon SELECT policy to expose or protect.

-- ---------- VERIFY ----------
-- select column_name, is_nullable from information_schema.columns
--   where table_name = 'gallery_items' and column_name in ('featured','item_type','after_url');
-- select conname from pg_constraint where conrelid = 'public.gallery_items'::regclass;

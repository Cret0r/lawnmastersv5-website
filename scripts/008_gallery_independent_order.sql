-- ============================================================
-- 008_gallery_independent_order.sql
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- Idempotent — safe to re-run.
--
-- Gives the /gallery page its own display order, independent of the
-- existing `sort_order` column (which now exclusively drives the
-- homepage's featured order — see docs/DECISIONS.md).
--
-- New column: gallery_order int. Backfilled from the current sort_order
-- so /gallery's display order is UNCHANGED the moment this runs — the
-- admin's Gallery-order Move Up/Down buttons (session 18) are what let
-- you diverge it from the homepage order after that.
-- ============================================================

alter table public.gallery_items
  add column if not exists gallery_order int not null default 0;

-- One-time backfill: only touches rows still at the column default (0),
-- so re-running this script after you've started customizing gallery_order
-- won't clobber your changes.
update public.gallery_items
  set gallery_order = sort_order
  where gallery_order = 0;

create index if not exists idx_gallery_items_published_order
  on public.gallery_items (published, gallery_order)
  where published = true;

-- RLS is unchanged and needs no new policy — same reasoning as 007: the
-- app only ever reads/writes gallery_items through the server-side
-- service-role client, never the anon key.

-- ---------- VERIFY ----------
-- select id, title, sort_order, gallery_order from public.gallery_items order by gallery_order;
--   Expect gallery_order to currently match sort_order for every row.

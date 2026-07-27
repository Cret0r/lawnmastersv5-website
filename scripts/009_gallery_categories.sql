-- ============================================================
-- 009_gallery_categories.sql
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- Idempotent — safe to re-run.
--
-- Adds admin-assigned categories to gallery_items, replacing the old
-- auto-derived-from-service-tags filter on /gallery. The category list
-- itself lives in code (lib/gallery-categories.ts) — keep that file and
-- the keyword guesses below in sync if you ever change the list.
--
-- Existing rows get a one-time best-guess backfill from their services
-- array (keyword matching), landing on 'Other' if nothing matches. This
-- is a STARTING POINT, not a final answer — re-check each item's category
-- from /admin's Gallery tab afterward and correct any that guessed wrong.
-- ============================================================

alter table public.gallery_items
  add column if not exists category text not null default 'Other';

-- Only touches rows still at the default, so re-running this after you've
-- started assigning categories by hand won't undo your choices.
update public.gallery_items
set category = case
  when exists (
    select 1 from unnest(services) s
    where s ilike '%pressure washing%' or s ilike '%moss%' or s ilike '%paver%' or s ilike '%surface restoration%'
  ) then 'Pressure Washing'
  when exists (
    select 1 from unnest(services) s
    where s ilike '%cleanup%' or s ilike '%clearing%' or s ilike '%debris%' or s ilike '%weed%'
       or s ilike '%brush%' or s ilike '%overgrowth%'
  ) then 'Cleanups'
  when exists (
    select 1 from unnest(services) s
    where s ilike '%mowing%' or s ilike '%edging%' or s ilike '%trimming%'
  ) then 'Mowing'
  when exists (
    select 1 from unnest(services) s
    where s ilike '%mulch%' or s ilike '%landscap%' or s ilike '%garden%' or s ilike '%bed%'
  ) then 'Landscaping'
  else 'Other'
end
where category = 'Other';

create index if not exists idx_gallery_items_category
  on public.gallery_items (category)
  where published = true;

-- RLS is unchanged and needs no new policy — same reasoning as 007/008.

-- ---------- VERIFY ----------
-- select title, services, category from public.gallery_items order by category, title;
--   Spot-check the guesses — fix any wrong ones from /admin's Gallery tab
--   (one dropdown per item, no need to re-run this script).

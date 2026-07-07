-- ============================================================
-- 006_create_gallery_items.sql
-- Admin-uploadable before/after gallery.
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
--
-- Creates:
--   1. public.gallery_items table (RLS: service_role only — the app
--      reads and writes exclusively through the service-role client)
--   2. a public "gallery" storage bucket for the before/after photos
--      (public read via CDN URL; uploads happen server-side with the
--      service-role key, so no storage.objects policies are needed)
-- ============================================================

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  description text,
  services text[] not null default '{}',
  before_url text not null,
  after_url text not null,
  published boolean not null default true,
  sort_order int not null default 0
);

alter table public.gallery_items enable row level security;

drop policy if exists "service_role_all_gallery_items" on public.gallery_items;
create policy "service_role_all_gallery_items" on public.gallery_items
  for all
  to service_role
  using (true)
  with check (true);

-- Public storage bucket for gallery photos (safe to re-run)
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- ---------- VERIFY ----------
-- select * from pg_policies where tablename = 'gallery_items';
-- select id, public from storage.buckets where id = 'gallery';

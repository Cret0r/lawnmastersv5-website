-- ============================================================
-- 005_fix_rls_scoping.sql
-- SECURITY FIX — tighten Row Level Security so the public anon key
-- cannot read, update, or delete rows.
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
--
-- WHY THIS IS NEEDED
-- ------------------
-- scripts/001_create_submissions.sql created this policy:
--
--   create policy "Allow service role full access" on public.quote_submissions
--     for all using (true) with check (true);
--
-- It has NO `to` clause, so Postgres applies it to the PUBLIC role group
-- (which includes `anon` and `authenticated`). Combined with RLS being ON,
-- that means anyone holding the public anon key (it ships in the browser
-- bundle) can SELECT / UPDATE / DELETE every lead in quote_submissions via
-- the Supabase REST API — full names, emails, phone numbers, home addresses.
--
-- The app itself never relies on that policy: every form insert and every
-- admin read/write goes through the SERVICE ROLE key (createAdminClient),
-- which bypasses RLS entirely. So locking these policies down to
-- `service_role` does NOT break the site.
-- ============================================================

-- ---------- quote_submissions ----------
alter table public.quote_submissions enable row level security;

-- Remove the over-permissive policy that leaks to anon/authenticated.
drop policy if exists "Allow service role full access" on public.quote_submissions;

-- Recreate it scoped to service_role only (service role bypasses RLS anyway,
-- but keeping an explicit, correctly-scoped policy documents intent).
create policy "service_role_all_quote_submissions" on public.quote_submissions
  for all
  to service_role
  using (true)
  with check (true);

-- Keep public form submissions working: anon may INSERT only.
drop policy if exists "Allow anonymous inserts" on public.quote_submissions;
create policy "anon_insert_quote_submissions" on public.quote_submissions
  for insert
  to anon
  with check (true);

-- The app does NOT use Supabase Auth (admin uses a custom cookie session +
-- service role). The "authenticated" policies from 003_fix_admin_rls.sql are
-- dead weight and would grant access to any future Supabase-Auth JWT holder.
-- Drop them so the table is service_role + anon-insert only.
drop policy if exists "Allow authenticated select" on public.quote_submissions;
drop policy if exists "Allow authenticated update" on public.quote_submissions;
drop policy if exists "Allow authenticated delete" on public.quote_submissions;

-- ---------- clients ----------
-- The `clients` table holds highly sensitive operational data (gate codes,
-- site hazards, whether pets are present, customer addresses). There is no
-- migration for it in this repo, so its RLS state is unverified. This block
-- is defensive: it enables RLS and restricts all access to the service role.
-- Safe to run whether or not the table already has RLS on.
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'clients'
  ) then
    execute 'alter table public.clients enable row level security';
    execute 'drop policy if exists "service_role_all_clients" on public.clients';
    execute 'create policy "service_role_all_clients" on public.clients
               for all to service_role using (true) with check (true)';
  end if;
end $$;

-- ---------- VERIFY ----------
-- After running, confirm no policy targets anon/authenticated with broad access:
--   select tablename, policyname, roles, cmd
--   from pg_policies
--   where schemaname = 'public'
--   order by tablename, policyname;
-- Expected: quote_submissions -> service_role (all) + anon (insert);
--           contact_messages  -> service_role (all) + anon (insert);
--           clients           -> service_role (all) only.

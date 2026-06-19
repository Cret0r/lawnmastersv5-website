-- Create the quote_submissions table for storing form submissions
create table if not exists public.quote_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  property_type text,
  property_size text,
  services text[] default '{}',
  timeline text,
  details text,
  status text default 'new' check (status in ('new', 'contacted', 'quoted', 'closed')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.quote_submissions enable row level security;

-- Allow anonymous inserts (public form submissions)
create policy "Allow anonymous inserts" on public.quote_submissions
  for insert
  with check (true);

-- Allow service role full access (for admin dashboard)
create policy "Allow service role full access" on public.quote_submissions
  for all
  using (true)
  with check (true);

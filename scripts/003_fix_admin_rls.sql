-- Add RLS policies for authenticated users (admin) to read, update, and delete submissions
create policy "Allow authenticated select" on public.quote_submissions
  for select
  to authenticated
  using (true);

create policy "Allow authenticated update" on public.quote_submissions
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated delete" on public.quote_submissions
  for delete
  to authenticated
  using (true);

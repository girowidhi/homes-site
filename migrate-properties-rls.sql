-- Fix: Allow public SELECT on properties table (required for public site to read listings)
alter table public.properties enable row level security;

drop policy if exists "properties_select_anon" on public.properties;
create policy "properties_select_anon" on public.properties
  for select using (true);

-- Allow authenticated admin to INSERT/UPDATE/DELETE
drop policy if exists "properties_insert_admin" on public.properties;
create policy "properties_insert_admin" on public.properties
  for insert with check (
    auth.role() = 'authenticated'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "properties_update_admin" on public.properties;
create policy "properties_update_admin" on public.properties
  for update using (
    auth.role() = 'authenticated'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "properties_delete_admin" on public.properties;
create policy "properties_delete_admin" on public.properties
  for delete using (
    auth.role() = 'authenticated'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

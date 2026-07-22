-- Unrestrict the properties table for public read and admin write access
-- Run this ONCE in your Supabase SQL Editor.

-- Drop all existing policies on properties
drop policy if exists "Allow public read access to properties" on public.properties;
drop policy if exists "Allow admins full access to properties" on public.properties;
drop policy if exists "properties_select_anon" on public.properties;
drop policy if exists "properties_insert_admin" on public.properties;
drop policy if exists "properties_update_admin" on public.properties;
drop policy if exists "properties_delete_admin" on public.properties;

-- Allow anyone (even anonymous) to read properties
create policy "properties_select_anon" on public.properties
  for select using (true);

-- Allow authenticated admin users to insert/update/delete
create policy "properties_insert_admin" on public.properties
  for insert with check (
    auth.role() = 'authenticated'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "properties_update_admin" on public.properties
  for update using (
    auth.role() = 'authenticated'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "properties_delete_admin" on public.properties
  for delete using (
    auth.role() = 'authenticated'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

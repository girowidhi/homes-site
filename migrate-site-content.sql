-- Create site_content table if not exists
create table if not exists public.site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Enable RLS but allow anonymous read
alter table public.site_content enable row level security;

-- Allow anyone to SELECT (public read for brand/hero/content)
drop policy if exists "site_content_select_anon" on public.site_content;
create policy "site_content_select_anon" on public.site_content
  for select using (true);

-- Allow only authenticated admin to INSERT/UPDATE
drop policy if exists "site_content_insert_admin" on public.site_content;
create policy "site_content_insert_admin" on public.site_content
  for insert with check (
    auth.role() = 'authenticated' 
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "site_content_update_admin" on public.site_content;
create policy "site_content_update_admin" on public.site_content
  for update using (
    auth.role() = 'authenticated'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Insert default brand values (prevents 406 errors)
insert into public.site_content (key, value) values
  ('brand', '{"name":"TobillionHomes","logo":"","favicon":"","logo_size":40,"logo_bg_transparent":false}')
on conflict (key) do nothing;

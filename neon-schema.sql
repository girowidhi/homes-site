-- TobillionHomes — Neon Database Schema
-- Run this ONCE in your Neon SQL Editor.

create extension if not exists pgcrypto;

-- ── 1. USERS (replaces Supabase auth.users) ────────────────
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  encrypted_password text not null,
  full_name text default '',
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default now() not null
);

-- ── 2. PROFILES (compatible view for existing code) ───────
create or replace view profiles as
select id, full_name, null::text as phone, null::text as location, role, created_at from users;

-- ── 3. USER SESSIONS ──────────────────────────────────────
create table if not exists user_sessions (
  id uuid primary key,
  user_id uuid references users(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null
);

-- ── 3. PROPERTIES TABLE ───────────────────────────────────
create table if not exists properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  location_county text not null,
  location_estate text not null,
  type text not null,
  price numeric not null,
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,
  description text,
  image_url text,
  status text default 'For Sale' check (status in ('For Sale', 'For Rent', 'Sold', 'Pending', 'Draft')),
  features text[],
  images text[],
  featured boolean default false,
  latitude text,
  longitude text,
  meta_title text,
  meta_description text,
  videos text[],
  created_at timestamp with time zone default now() not null
);

create index if not exists idx_properties_created_at on properties (created_at desc);
create index if not exists idx_properties_location_county on properties (location_county);
create index if not exists idx_properties_type on properties (type);
create index if not exists idx_properties_status on properties (status);
create index if not exists idx_properties_price on properties (price);

-- ── 4. INQUIRIES / LEADS TABLE ────────────────────────────
create table if not exists inquiries (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references properties(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text default 'Pending' check (status in ('Pending', 'Contacted', 'Closed')),
  created_at timestamp with time zone default now() not null
);

-- ── 5. SITE CONTENT TABLE ─────────────────────────────────
create table if not exists site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default now() not null
);

-- Default brand values
insert into site_content (key, value) values
  ('brand', '{"name":"TobillionHomes","logo":"","favicon":"","logo_size":40,"logo_bg_transparent":false}')
on conflict (key) do nothing;

-- ── 6. MEDIA ITEMS TABLE ──────────────────────────────────
create table if not exists media_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  url text not null,
  size integer,
  type text,
  created_at timestamp with time zone default now() not null
);

-- ── 7. SEED ADMIN USER ────────────────────────────────────
-- Password: Admin@2024Secure!
-- Run: select seed_admin();
create or replace function seed_admin() returns void as $$
begin
  if exists (select 1 from users where email = 'admin@tobillionhomes.com') then
    raise notice 'Admin user already exists, skipping.';
    return;
  end if;
  insert into users (email, encrypted_password, full_name, role)
  values ('admin@tobillionhomes.com', crypt('Admin@2024Secure!', gen_salt('bf', 10)), 'Super Admin', 'admin');
  raise notice 'Admin user created: admin@tobillionhomes.com / Admin@2024Secure!';
end;
$$ language plpgsql;

-- ── 8. SEED SAMPLE PROPERTIES ─────────────────────────────
create or replace function seed_properties() returns void as $$
begin
  insert into properties (title, location_county, location_estate, type, price, bedrooms, bathrooms, area_sqft, description, image_url, status, features)
  values
  ('Luxury 4 Bedroom Villa in Karen', 'Nairobi', 'Karen', 'Villa', 120000000, 4, 5, 4500, 'A beautiful 4 bedroom villa located in the prestigious Karen area of Nairobi.', '', 'For Sale', array['Swimming Pool', 'Gated Community', 'Backup Generator']),
  ('Westlands Sky Penthouse', 'Nairobi', 'Westlands', 'Apartment', 85000000, 3, 3, 3200, 'Spacious penthouse with stunning views of the city skyline.', '', 'For Sale', array['Gym', 'City Views', 'Elevator', '24/7 Security']),
  ('Nyali Beach Executive Villa', 'Mombasa', 'Nyali', 'Villa', 150000000, 5, 6, 6000, 'Oceanfront property featuring direct beach access.', '', 'For Sale', array['Ocean View', 'Infinity Pool', 'Beach Access']);
end;
$$ language plpgsql;

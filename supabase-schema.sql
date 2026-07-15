-- TobillionHomes Database Schema & Security Configuration
-- Run this in your Supabase SQL Editor to set up all tables and Row Level Security (RLS).

-- 1. Create Profiles Table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  location text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- Profiles Policies
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to automatically create a profile entry on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce(new.raw_user_meta_data->>'role', 'user'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Create Properties Table
create table if not exists public.properties (
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
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Properties
alter table public.properties enable row level security;

-- Properties Policies
drop policy if exists "Allow public read access to properties" on public.properties;
create policy "Allow public read access to properties" on public.properties
  for select using (true);

drop policy if exists "Allow admins full access to properties" on public.properties;
create policy "Allow admins full access to properties" on public.properties
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- 3. Create Inquiries/Leads Table
create table if not exists public.inquiries (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text default 'Pending' check (status in ('Pending', 'Contacted', 'Closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Inquiries
alter table public.inquiries enable row level security;

-- Inquiries Policies
drop policy if exists "Allow anyone to submit inquiries" on public.inquiries;
create policy "Allow anyone to submit inquiries" on public.inquiries
  for insert with check (true);

drop policy if exists "Allow admins full access to inquiries" on public.inquiries;
create policy "Allow admins full access to inquiries" on public.inquiries
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- 4. Create Saved Listings Table
create table if not exists public.saved_listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, property_id)
);

-- Enable RLS on Saved Listings
alter table public.saved_listings enable row level security;

-- Saved Listings Policies
drop policy if exists "Users can view their own saved listings" on public.saved_listings;
create policy "Users can view their own saved listings" on public.saved_listings
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own saved listings" on public.saved_listings;
create policy "Users can insert their own saved listings" on public.saved_listings
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own saved listings" on public.saved_listings;
create policy "Users can delete their own saved listings" on public.saved_listings
  for delete using (auth.uid() = user_id);


-- 5. Create Site Content Table (Key-Value Content)
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Site Content
alter table public.site_content enable row level security;

-- Site Content Policies
drop policy if exists "Allow public read access to site content" on public.site_content;
create policy "Allow public read access to site content" on public.site_content
  for select using (true);

drop policy if exists "Allow admins full access to site content" on public.site_content;
create policy "Allow admins full access to site content" on public.site_content
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- Seed data helper functions
-- Run this block if you want to initialize some sample data
create or replace function seed_sample_properties() returns void as $$
begin
  insert into public.properties (title, location_county, location_estate, type, price, bedrooms, bathrooms, area_sqft, description, image_url, status, features)
  values 
  ('Luxury 4 Bedroom Villa in Karen', 'Nairobi', 'Karen', 'Villa', 120000000, 4, 5, 4500, 'A beautiful 4 bedroom villa located in the prestigious Muthaiga/Karen area of Nairobi, featuring ultra-modern concrete lines and floor-to-ceiling glass.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkhNz4AEf3rBh-Fuch5l51fotpvwtZ228e4hvyoDT5zN2BGeXSImzYZQbTE90DpSPmzDRQFbeYkxVSbmRkg_m7FzSxviGSSKa1KymiOsrZAyhtEf1e5pzRIyO-2QLkfwrzxwRgvb244xQAEaoC_KvUj0h7QIWsK4_TNgw4wkXSTF7GHPLBJ4IY7ZX35eCfxSqtKw14kaQ3tYQ7LkzMHPuAFUM_L6GHK_lKHWNGfzoYVnOAy7xxWEIqO3K2aHcmB8fM0G5CLVWoYjo', 'For Sale', array['Swimming Pool', 'Manicured Lawn', 'Gated Community', 'Backup Generator']),
  ('Westlands Sky Penthouse', 'Nairobi', 'Westlands', 'Apartment', 85000000, 3, 3, 3200, 'Spacious penthouse with stunning views of the city skyline, high-end marble finishes, and designer furnishings.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRMdMhWZ4KBeHA8u0z2ZMBRsFMOpEVcC7_TVFfEyF_UkpS2l_4YLHjsHp93YWYWEWsi85CJ8IY_K130qLsTGmG2-ZOLLkixmnR5FraD7i66Uisu0-axgRLSUd8DZPr_UqI1MVX67C9TIvFbJnWx7_p2qeZCL5EFNYTKED5t969ib7YAsE1jLexndGjMyl4nK887prQZug9zhiumA3_-zc9IAxQrRbohjX1HIYVNKAz6_Ebo-3UrUEs--DByPNSDDHR3zaCh4n2qtM', 'For Sale', array['Gym', 'City Views', 'Elevator', '24/7 Security']),
  ('Nyali Beach Executive Villa', 'Mombasa', 'Nyali', 'Villa', 150000000, 5, 6, 6000, 'Oceanfront property featuring direct beach access, traditional Swahili architecture with modern details, and private infinity pool.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuANujteNGZFT-VlMGxIlEhFzrFs1n2_wI6YsXTmt5ofXiVIdlQ5bSEX-BUwmIFfM4rsIU9GJPy0CLgTY0gF4vcAywcSmN65eAaarJbM8q_LVeSJztzIYAS5E3bORNb_4rMAZQ5tVjh1VLabx6z1DGD7UMMz3Xz8vq7V7UHby3uMtJtEf3tMlXv9SP1NEkv6Ku5Ejm5hztI11K-3La4Pr9xbugEa5TQ6vB2F8_ktqyv48J0WYN-ALcHRvdMN_xu83KaEipsa41UW_Io', 'For Sale', array['Ocean View', 'Infinity Pool', 'Beach Access', 'AC Systems']);
end;
$$ language plpgsql;


-- ═══════════════════════════════════════════════════════════════════════
-- ADMIN SEED FUNCTION
-- Creates a Super Admin user in auth.users + public.profiles.
-- Run this once after schema setup to bootstrap admin access.
-- 
-- Credentials after seeding:
--   Email:    admin@tobillionhomes.com
--   Password: Admin@2024Secure!
-- ═══════════════════════════════════════════════════════════════════════
create or replace function seed_admin_user() returns void as $$
declare
  _uid uuid;
  _encrypted_pw text;
begin
  -- Check if admin already exists
  if exists (select 1 from auth.users where email = 'admin@tobillionhomes.com') then
    raise notice 'Admin user already exists, skipping seed.';
    return;
  end if;

  -- Generate a UUID for the admin user
  _uid := gen_random_uuid();
  
  -- Encrypt the password (bcrypt hash of 'Admin@2024Secure!')
  -- Supabase uses PostgreSQL's pgcrypto for password hashing
  _encrypted_pw := crypt('Admin@2024Secure!', gen_salt('bf', 10));

  -- Insert into auth.users (requires service_role or superuser privileges)
  insert into auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    _uid,
    'authenticated',
    'authenticated',
    'admin@tobillionhomes.com',
    _encrypted_pw,
    now(),
    jsonb_build_object('full_name', 'Super Admin', 'role', 'admin'),
    now(),
    now(),
    '', '', '', ''
  );

  -- Insert corresponding profile with admin role
  insert into public.profiles (id, full_name, phone, location, role, created_at)
  values (
    _uid,
    'Super Admin',
    '+254700000000',
    'Nairobi, Kenya',
    'admin',
    now()
  );

  raise notice 'Admin user created successfully. Email: admin@tobillionhomes.com';
end;
$$ language plpgsql security definer;

-- ═══════════════════════════════════════════════════════════════════════
-- RUN THIS TO APPLY THE ADMIN SEED:
--   select seed_admin_user();
-- 
-- If you prefer to bypass SQL and use the app's signup flow instead,
-- sign up with email: admin@tobillionhomes.com, password: Admin@2024Secure!
-- then run:
--   update public.profiles set role = 'admin' where email = 'admin@tobillionhomes.com';
-- ═══════════════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════════════════════════════
-- STORAGE BUCKET + RLS POLICIES
-- Creates the property-media bucket (if missing) and allows uploads.
-- ═══════════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('property-media', 'property-media', true)
on conflict (id) do nothing;

-- Allow public to view/download files
drop policy if exists "Public can view property-media" on storage.objects;
create policy "Public can view property-media" on storage.objects
  for select using (bucket_id = 'property-media');

-- Allow authenticated users to upload
drop policy if exists "Authenticated can upload to property-media" on storage.objects;
create policy "Authenticated can upload to property-media" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'property-media');

-- Allow authenticated users to update
drop policy if exists "Authenticated can update property-media" on storage.objects;
create policy "Authenticated can update property-media" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'property-media');

-- Allow authenticated users to delete
drop policy if exists "Authenticated can delete from property-media" on storage.objects;
create policy "Authenticated can delete from property-media" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'property-media');

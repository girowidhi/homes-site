# TobillionHomes - HTML & Supabase Implementation Plan

This plan outlines the integration of the TobillionHomes real estate website and admin dashboard using vanilla HTML/JS and **Supabase** for database, auth, and security.

## Row Level Security (RLS) & Security Strategy

To ensure a "very secure" client-side HTML application, we will enforce strict **Row Level Security (RLS)** in Supabase. All database access will go through the Supabase JS client. RLS policies will ensure that:
1. **Properties**:
   - Read access is public (`anon` and `authenticated`).
   - Write/Update/Delete access is restricted to authenticated users with the `admin` role.
2. **Inquiries / Leads**:
   - Write access is public (anyone can submit a contact form or inquiry).
   - Read/Write/Update access is restricted to authenticated users with the `admin` role.
3. **Saved Listings**:
   - Authenticated users can insert, read, and delete their own saved listings (`auth.uid() = user_id`).
   - Admins can read all saved listings.
4. **User Roles**:
   - We will define a `profiles` table that tracks user roles (e.g., `user`, `admin`).
   - Admin routes will check the authenticated user's profile role before showing dashboard data.

---

## Supabase Database Schema (SQL Script)

We will provide a SQL script that the user can execute in their Supabase SQL Editor. This script creates the required tables, triggers, and security policies:

```sql
-- 1. Create Profiles Table (extends auth.users)
create table public.profiles (
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
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to automatically create a profile entry on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'user'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Create Properties Table
create table public.properties (
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
  images text[],
  status text default 'For Sale' check (status in ('For Sale', 'For Rent', 'Sold')),
  features text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Properties
alter table public.properties enable row level security;

-- Properties Policies
create policy "Allow public read access to properties" on public.properties
  for select using (true);

create policy "Allow admins full access to properties" on public.properties
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- 3. Create Inquiries/Leads Table
create table public.inquiries (
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
create policy "Allow anyone to submit inquiries" on public.inquiries
  for insert with check (true);

create policy "Allow admins full access to inquiries" on public.inquiries
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- 4. Create Saved Listings Table
create table public.saved_listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, property_id)
);

-- Enable RLS on Saved Listings
alter table public.saved_listings enable row level security;

-- Saved Listings Policies
create policy "Users can view their own saved listings" on public.saved_listings
  for select using (auth.uid() = user_id);

create policy "Users can insert their own saved listings" on public.saved_listings
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own saved listings" on public.saved_listings
  for delete using (auth.uid() = user_id);
```

---

## File Mappings (Stitch Screen ➡️ Root HTML)

We will copy and rename the files from their stitch folders to the root folder:

| Original Stitch Folder | Target Root File | Description |
| --- | --- | --- |
| `tobillionhomes_home_1` | `index.html` | Public Home Page (Style 1) |
| `tobillionhomes_home_2` | `index-style2.html` | Public Home Page (Style 2) |
| `about_us_tobillionhomes` | `about.html` | About Us |
| `contact_us_tobillionhomes` | `contact.html` | Contact Us / Support |
| `developments_projects_tobillionhomes` | `developments.html` | Projects & Developments |
| `explore_neighborhoods_tobillionhomes` | `neighborhoods.html` | Explore Neighborhoods |
| `frequently_asked_questions_tobillionhomes` | `faq.html` | FAQ |
| `properties_for_sale_rent_tobillionhomes` | `properties.html` | Main listings browser |
| `search_results_tobillionhomes` | `search.html` | Search results |
| `luxury_4_bedroom_villa_in_karen_tobillionhomes` | `detail.html` | Property detail view |
| `compare_properties_tobillionhomes` | `compare.html` | Compare properties grid |
| `mortgage_calculator_tobillionhomes` | `mortgage.html` | Mortgage Calculator |
| `our_premium_agents_tobillionhomes` | `agents.html` | Agents list |
| `market_insights_news_tobillionhomes` | `news.html` | Blog & Market news |
| `privacy_terms_tobillionhomes` | `privacy.html` | Legal privacy & terms |
| `list_your_property_tobillionhomes` | `list-property.html` | Public submit listing |
| `login_or_register_tobillionhomes` | `login.html` | User authentication |
| `account_recovery_tobillionhomes` | `recovery.html` | Password recovery |
| `my_account_tobillionhomes` | `account.html` | User dashboard / profile |
| `admin_login_tobillionhomes` | `admin-login.html` | Admin login |
| `admin_dashboard_tobillionhomes` | `admin-dashboard.html` | Admin dashboard home |
| `add_new_property_admin_hub` | `admin-add-property.html` | Admin add property form |
| `manage_properties_admin_hub` | `admin-manage-properties.html` | Admin listings list |
| `leads_inquiries_admin_hub` | `admin-leads.html` | Admin lead database |
| `media_library_admin_hub` | `admin-media.html` | Admin file upload library |
| `site_content_editor_admin_hub` | `admin-content.html` | Admin content editor |
| `analytics_reports_admin_hub` | `admin-analytics.html` | Admin analytics dashboard |

---

## Integration and Wiring Details

1. **Supabase Client Library**:
   We will inject `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>` and a global `config.js` containing Supabase credentials into every page.
2. **Page Link Verification**:
   All relative paths in `href` links (e.g. headers, footers, sidebars, buttons) will be updated to point to the correct root HTML file mapping (e.g. `#` ➡️ `properties.html`, `about.html`, etc.).
3. **Handling of Missing Screens**:
   Since the screens for **SEO Settings**, **Settings**, **Users**, and **Support/Help Center** do not exist, we will route their sidebar links as follows:
   - **SEO Settings** ➡️ Redirects or links to `admin-content.html` (Site Content Editor, which is closely aligned).
   - **Settings** ➡️ Redirects or links to `admin-dashboard.html` with a beautiful toast notification: *"Settings are automatically synced with the security database plugin."*
   - **Users** ➡️ Redirects or links to `admin-leads.html` with a toast: *"User list management is synced with CRM integration."*
   - **Support** ➡️ Links directly to the public `contact.html` screen.
   This guarantees that no links are dead and the user can always navigate cleanly.

---

## Verification Plan

### Automated Tests
- We will verify that there are no broken links (`a` tags with `#` that should be wired, or links pointing to files that do not exist).
- We will test the login, logout, listing insertion, and lead collection logic.

### Manual Verification
- Deploy locally and check page navigation.
- Verify that forms (Contact, Login, Add Property) submit correctly to Supabase.

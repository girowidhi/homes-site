-- Performance indexes for properties table
-- Run this in Supabase SQL Editor

-- Index for ORDER BY created_at DESC (used by fetchProperties and searchProperties)
create index if not exists idx_properties_created_at on public.properties (created_at desc);

-- Index for common filter columns used in searchProperties
create index if not exists idx_properties_location_county on public.properties (location_county);
create index if not exists idx_properties_location_estate on public.properties (location_estate);
create index if not exists idx_properties_type on public.properties (type);
create index if not exists idx_properties_status on public.properties (status);
create index if not exists idx_properties_price on public.properties (price);

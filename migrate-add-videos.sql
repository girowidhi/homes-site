-- Add videos column to properties table
alter table public.properties
add column if not exists videos text[];

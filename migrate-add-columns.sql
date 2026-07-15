-- Migration: Add new columns to properties table
-- Run this in your Supabase SQL Editor if you get column errors

alter table public.properties
  add column if not exists latitude text,
  add column if not exists longitude text,
  add column if not exists featured boolean default false,
  add column if not exists meta_title text,
  add column if not exists meta_description text;

-- Also widen the status check constraint to include Pending and Draft
alter table public.properties
  drop constraint if exists properties_status_check;

alter table public.properties
  add constraint properties_status_check
  check (status in ('For Sale', 'For Rent', 'Sold', 'Pending', 'Draft'));

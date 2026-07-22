-- Create admin user for TobillionHomes on Neon
-- Run this ONCE in your Neon SQL Editor.

create extension if not exists pgcrypto;

insert into users (email, encrypted_password, full_name, role)
values ('admin@tobillionhomes.com', crypt('Admin@2024Secure!', gen_salt('bf', 10)), 'Super Admin', 'admin')
on conflict (email) do nothing;

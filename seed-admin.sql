-- ═══════════════════════════════════════════════════════════════════════
-- TobillionHomes — Admin User Seed Script
-- Run this ONCE in your Supabase SQL Editor after the schema is set up.
--
-- Credentials after seeding:
--   Email:    admin@tobillionhomes.com
--   Password: Admin@2024Secure!
-- ═══════════════════════════════════════════════════════════════════════

do $$
declare
  _uid uuid;
  _encrypted_pw text;
begin
  -- Skip if admin already exists
  if exists (select 1 from auth.users where email = 'admin@tobillionhomes.com') then
    raise notice 'Admin user already exists. Nothing to do.';
    return;
  end if;

  _uid := gen_random_uuid();
  _encrypted_pw := crypt('Admin@2024Secure!', gen_salt('bf', 10));

  -- Insert into auth.users — the trigger on_auth_user_created will fire
  -- and create a profile row with role = 'user' automatically
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

  -- Upgrade the auto-created profile from 'user' to 'admin'
  update public.profiles
  set role = 'admin',
      full_name = 'Super Admin',
      phone = '+254700000000',
      location = 'Nairobi, Kenya'
  where id = _uid;

  raise notice 'Admin user created successfully!';
  raise notice '  Email:    admin@tobillionhomes.com';
  raise notice '  Password: Admin@2024Secure!';
end;
$$;

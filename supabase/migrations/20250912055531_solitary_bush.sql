/*
  # Create Authentication Accounts for Admin Users

  This migration creates the actual Supabase Auth accounts that are needed for login.
  The previous migration only created user profiles, but not the auth accounts.

  1. Creates auth accounts for:
     - Super Admin (owner@brixel.com)
     - Admin (tcfadmin@brixel.com)
  
  2. Links them to existing user profiles
  
  Note: This uses the auth.users table directly which requires service role permissions.
*/

-- Create Super Admin auth account
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'owner@brixel.com',
  crypt('BrixelOwner@2024', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Super Admin"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('BrixelOwner@2024', gen_salt('bf')),
  updated_at = now();

-- Create Admin auth account  
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'tcfadmin@brixel.com',
  crypt('Mostaganem@27', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "TCF Admin"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('Mostaganem@27', gen_salt('bf')),
  updated_at = now();

-- Update user profiles to match auth IDs
UPDATE users SET id = '00000000-0000-0000-0000-000000000001'::uuid 
WHERE email = 'owner@brixel.com';

UPDATE users SET id = '00000000-0000-0000-0000-000000000002'::uuid 
WHERE email = 'tcfadmin@brixel.com';
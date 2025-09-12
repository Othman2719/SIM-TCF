/*
  # Create Admin User

  This migration creates an admin user with the specified credentials:
  - Email: tcfadmin@brixel.com
  - Password: Mostaganem@27
  - Role: admin
  - Username: Tcfadmin
*/

-- First, we need to create the auth user
-- Note: This requires the auth.users table to be accessible
-- In production, you would typically do this through the Supabase dashboard

-- Create the user profile in the public.users table
-- We'll use a fixed UUID for the admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Fixed UUID for admin
  'authenticated',
  'authenticated',
  'tcfadmin@brixel.com',
  crypt('Mostaganem@27', gen_salt('bf')), -- Encrypted password
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create the user profile
INSERT INTO public.users (
  id,
  email,
  username,
  full_name,
  role,
  is_active,
  subscription_type,
  created_at,
  updated_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Same UUID as auth user
  'tcfadmin@brixel.com',
  'Tcfadmin',
  'TCF Administrator',
  'admin',
  true,
  'enterprise',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  subscription_type = EXCLUDED.subscription_type,
  updated_at = NOW();

-- Create default subscription for admin
INSERT INTO public.user_subscriptions (
  user_id,
  subscription_type,
  starts_at,
  expires_at,
  is_active,
  payment_status,
  created_at,
  updated_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'enterprise',
  NOW(),
  NOW() + INTERVAL '10 years', -- Long-term admin access
  true,
  'paid',
  NOW(),
  NOW()
) ON CONFLICT (user_id, subscription_type) DO UPDATE SET
  is_active = true,
  expires_at = NOW() + INTERVAL '10 years',
  updated_at = NOW();
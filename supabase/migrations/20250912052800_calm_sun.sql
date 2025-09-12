/*
  # Create Admin User Manually

  This migration creates an admin user directly in the users table.
  You'll need to create the auth user separately in Supabase dashboard.

  1. Steps to follow:
     - First run this migration
     - Then go to Supabase Dashboard > Authentication > Users
     - Click "Add user" and create user with:
       - Email: tcfadmin@brixel.com  
       - Password: Mostaganem@27
     - Copy the generated UUID from the auth user
     - Update the users table with that UUID

  2. Admin Details:
     - Email: tcfadmin@brixel.com
     - Username: Tcfadmin
     - Role: admin
     - Full access to system
*/

-- First, let's ensure we have the admin user in our users table
-- We'll use a placeholder UUID that you'll need to replace
INSERT INTO public.users (
  id,
  email,
  username,
  full_name,
  role,
  is_active,
  subscription_type,
  subscription_expires_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- REPLACE THIS WITH ACTUAL AUTH USER UUID
  'tcfadmin@brixel.com',
  'Tcfadmin',
  'TCF Administrator',
  'admin',
  true,
  'enterprise',
  '2035-01-01 00:00:00+00',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  subscription_type = EXCLUDED.subscription_type,
  subscription_expires_at = EXCLUDED.subscription_expires_at,
  updated_at = now();

-- Create a subscription for the admin
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
  '00000000-0000-0000-0000-000000000000', -- REPLACE THIS WITH ACTUAL AUTH USER UUID
  'enterprise',
  now(),
  '2035-01-01 00:00:00+00',
  true,
  'paid',
  now(),
  now()
) ON CONFLICT (user_id, subscription_type) DO UPDATE SET
  is_active = EXCLUDED.is_active,
  payment_status = EXCLUDED.payment_status,
  updated_at = now();
/*
  # Simple Admin User Creation
  
  Creates admin user profile only (auth user must be created via Supabase dashboard)
  
  Admin Credentials:
  - Email: tcfadmin@brixel.com  
  - Username: Tcfadmin
  - Role: admin
*/

-- Create the admin user profile
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
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Fixed UUID for admin
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

-- Create admin subscription
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
  NOW() + INTERVAL '10 years',
  true,
  'paid',
  NOW(),
  NOW()
) ON CONFLICT (user_id, subscription_type) DO UPDATE SET
  is_active = true,
  expires_at = NOW() + INTERVAL '10 years',
  updated_at = NOW();
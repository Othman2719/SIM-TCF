/*
  # Create Admin User

  1. New User
    - Creates admin user with email tcfadmin@brixel.com
    - Sets role to 'admin'
    - Sets active status to true
    - Provides default values for all required fields

  2. Security
    - User will be able to access admin panel
    - Active status allows login
*/

-- Insert admin user (this will work if the auth user already exists)
INSERT INTO users (
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
  '550e8400-e29b-41d4-a716-446655440000', -- Fixed UUID for admin
  'tcfadmin@brixel.com',
  'tcfadmin',
  'TCF Administrator',
  'admin',
  true,
  'enterprise',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  is_active = true,
  subscription_type = 'enterprise',
  updated_at = now();

-- Also update any existing user with this email to be admin
UPDATE users 
SET 
  role = 'admin',
  is_active = true,
  subscription_type = 'enterprise',
  updated_at = now()
WHERE email = 'tcfadmin@brixel.com';
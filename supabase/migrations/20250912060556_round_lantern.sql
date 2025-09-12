/*
  # Add Super Admin Role and Owner Account

  1. New Role
    - Add `super_admin` role to user_role enum
    - Create owner account with super_admin privileges
  
  2. Security
    - Add RLS policies for super admin access
    - Allow super admin to manage all users and content
*/

-- Add super_admin to the user_role enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'super_admin' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
        ALTER TYPE user_role ADD VALUE 'super_admin';
    END IF;
END $$;

-- Commit the enum change
COMMIT;

-- Start a new transaction for the rest of the changes
BEGIN;

-- Create or update the owner account
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
  '00000000-0000-0000-0000-000000000001',
  'owner@brixel.com',
  'brixel_owner',
  'Brixel Owner',
  'super_admin',
  true,
  'enterprise',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  is_active = true,
  subscription_type = 'enterprise',
  updated_at = now();

-- Update RLS policies to allow super_admin access
DROP POLICY IF EXISTS "Super admin can manage all users" ON users;
CREATE POLICY "Super admin can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'super_admin'
    )
  );

-- Allow super_admin to manage exam sets
DROP POLICY IF EXISTS "Super admin can manage exam sets" ON exam_sets;
CREATE POLICY "Super admin can manage exam sets"
  ON exam_sets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- Allow super_admin to manage questions
DROP POLICY IF EXISTS "Super admin can manage questions" ON questions;
CREATE POLICY "Super admin can manage questions"
  ON questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

COMMIT;
/*
  # Fix infinite recursion in RLS policies

  1. Problem
    - RLS policies on users table are causing infinite recursion
    - Policies reference the users table within their conditions, creating circular dependency

  2. Solution
    - Drop problematic policies that query users table within their conditions
    - Create simple, direct policies using auth.uid() without subqueries
    - Ensure policies don't create circular references

  3. Changes
    - Remove policies that query users table in their conditions
    - Add simple, direct policies for user access control
*/

-- Drop all existing policies on users table to start fresh
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Super admin can manage all users" ON users;

-- Create simple, non-recursive policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create a simple policy for service role (used by server-side operations)
CREATE POLICY "Service role full access"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
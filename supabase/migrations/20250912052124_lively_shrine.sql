/*
  # Fix RLS Infinite Recursion

  1. Policy Updates
    - Simplify user policies to avoid circular references
    - Fix exam_sets policies to use direct auth checks
    - Remove complex EXISTS clauses that cause recursion
  
  2. Security
    - Maintain proper access control
    - Use direct auth.uid() checks instead of user table lookups
    - Ensure policies are efficient and non-recursive
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can manage exam sets" ON exam_sets;
DROP POLICY IF EXISTS "Everyone can read active exam sets" ON exam_sets;

-- Create simplified user policies without recursion
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create simplified exam_sets policies
CREATE POLICY "Everyone can read active exam sets"
  ON exam_sets
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Service role can manage exam sets"
  ON exam_sets
  FOR ALL
  TO service_role
  USING (true);

-- Fix other table policies to avoid user table lookups
DROP POLICY IF EXISTS "Admins can manage questions" ON questions;
DROP POLICY IF EXISTS "Everyone can read questions from active exam sets" ON questions;

CREATE POLICY "Everyone can read questions from active exam sets"
  ON questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM exam_sets 
      WHERE exam_sets.id = questions.exam_set_id 
      AND exam_sets.is_active = true
    )
  );

CREATE POLICY "Service role can manage questions"
  ON questions
  FOR ALL
  TO service_role
  USING (true);

-- Fix test_sessions policies
DROP POLICY IF EXISTS "Admins can read all test sessions" ON test_sessions;
DROP POLICY IF EXISTS "Users can manage own test sessions" ON test_sessions;

CREATE POLICY "Users can manage own test sessions"
  ON test_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix test_answers policies
DROP POLICY IF EXISTS "Admins can read all test answers" ON test_answers;
DROP POLICY IF EXISTS "Users can manage own test answers" ON test_answers;

CREATE POLICY "Users can manage own test answers"
  ON test_answers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM test_sessions 
      WHERE test_sessions.id = test_answers.session_id 
      AND test_sessions.user_id = auth.uid()
    )
  );

-- Fix test_results policies
DROP POLICY IF EXISTS "Admins can read all test results" ON test_results;
DROP POLICY IF EXISTS "Users can read own test results" ON test_results;
DROP POLICY IF EXISTS "System can insert test results" ON test_results;

CREATE POLICY "Users can read own test results"
  ON test_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test results"
  ON test_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix certificates policies
DROP POLICY IF EXISTS "Admins can manage all certificates" ON certificates;
DROP POLICY IF EXISTS "Users can read own certificates" ON certificates;
DROP POLICY IF EXISTS "System can insert certificates" ON certificates;

CREATE POLICY "Users can read own certificates"
  ON certificates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certificates"
  ON certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix user_subscriptions policies
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can read own subscriptions" ON user_subscriptions;

CREATE POLICY "Users can read own subscriptions"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix analytics policies
DROP POLICY IF EXISTS "Admins can read analytics" ON analytics;
DROP POLICY IF EXISTS "System can insert analytics" ON analytics;

CREATE POLICY "System can insert analytics"
  ON analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can read analytics"
  ON analytics
  FOR SELECT
  TO service_role
  USING (true);
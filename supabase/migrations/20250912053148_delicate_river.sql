/*
  # Fix user subscriptions RLS policies

  1. Security Updates
    - Add INSERT policy for user_subscriptions table
    - Allow authenticated users to create their own subscriptions
    - Ensure users can manage their own subscription data

  2. Changes
    - Add policy for authenticated users to insert their own subscriptions
    - Update existing policies if needed
*/

-- Allow authenticated users to insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own subscriptions
CREATE POLICY "Users can update own subscriptions" 
  ON user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
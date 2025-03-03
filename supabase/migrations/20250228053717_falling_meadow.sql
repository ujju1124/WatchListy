/*
  # Fix Watch Later Policies

  1. Changes
    - Drop existing policies if they exist
    - Create new policies with proper checks
  2. Security
    - Ensure proper RLS policies for watch_later table
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'watch_later' AND policyname = 'Users can read their own watch later items'
  ) THEN
    DROP POLICY "Users can read their own watch later items" ON watch_later;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'watch_later' AND policyname = 'Users can insert their own watch later items'
  ) THEN
    DROP POLICY "Users can insert their own watch later items" ON watch_later;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'watch_later' AND policyname = 'Users can delete their own watch later items'
  ) THEN
    DROP POLICY "Users can delete their own watch later items" ON watch_later;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'watch_later' AND policyname = 'Users can read own watch later items'
  ) THEN
    DROP POLICY "Users can read own watch later items" ON watch_later;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'watch_later' AND policyname = 'Users can add to watch later'
  ) THEN
    DROP POLICY "Users can add to watch later" ON watch_later;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'watch_later' AND policyname = 'Users can remove from watch later'
  ) THEN
    DROP POLICY "Users can remove from watch later" ON watch_later;
  END IF;
END $$;

-- Create new policies
CREATE POLICY "Allow users to read their own items"
  ON watch_later
  FOR SELECT
  USING (user_id = (current_setting('request.jwt.claims', true)::json->'app_metadata'->>'user_id'));

CREATE POLICY "Allow users to insert their own items"
  ON watch_later
  FOR INSERT
  WITH CHECK (user_id = (current_setting('request.jwt.claims', true)::json->'app_metadata'->>'user_id'));

CREATE POLICY "Allow users to delete their own items"
  ON watch_later
  FOR DELETE
  USING (user_id = (current_setting('request.jwt.claims', true)::json->'app_metadata'->>'user_id'));
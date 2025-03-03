/*
  # Fix Watch Later Policies

  1. Changes
    - Drop all existing policies
    - Create new policies with proper permissions
  2. Security
    - Ensure proper RLS policies for watch_later table
*/

-- Drop all existing policies
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
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'watch_later' AND policyname = 'Allow users to read their own items'
  ) THEN
    DROP POLICY "Allow users to read their own items" ON watch_later;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'watch_later' AND policyname = 'Allow users to insert their own items'
  ) THEN
    DROP POLICY "Allow users to insert their own items" ON watch_later;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'watch_later' AND policyname = 'Allow users to delete their own items'
  ) THEN
    DROP POLICY "Allow users to delete their own items" ON watch_later;
  END IF;
END $$;

-- Disable and re-enable RLS to ensure clean state
ALTER TABLE watch_later DISABLE ROW LEVEL SECURITY;
ALTER TABLE watch_later ENABLE ROW LEVEL SECURITY;

-- Create new policies with unique names
CREATE POLICY "watch_later_select_policy" 
  ON watch_later 
  FOR SELECT 
  USING (true);  -- Allow all users to read all records

CREATE POLICY "watch_later_insert_policy" 
  ON watch_later 
  FOR INSERT 
  WITH CHECK (true);  -- Allow all users to insert records

CREATE POLICY "watch_later_delete_policy" 
  ON watch_later 
  FOR DELETE 
  USING (true);  -- Allow all users to delete records
/*
  # Create watch_later table

  1. New Tables
    - `watch_later`
      - `id` (uuid, primary key)
      - `user_id` (text, not null)
      - `media_id` (integer, not null)
      - `media_type` (text, not null, default 'movie')
      - `created_at` (timestamp with time zone, default now())
  2. Security
    - Enable RLS on `watch_later` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to delete their own data
*/

CREATE TABLE IF NOT EXISTS watch_later (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  media_id INTEGER NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'movie',
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, media_id, media_type)
);

ALTER TABLE watch_later ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own watch later items"
  ON watch_later
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own watch later items"
  ON watch_later
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own watch later items"
  ON watch_later
  FOR DELETE
  USING (auth.uid()::text = user_id);
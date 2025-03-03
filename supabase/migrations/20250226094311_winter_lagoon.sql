/*
  # Create Watch Later Table

  1. New Tables
    - `watch_later`
      - `id` (uuid, primary key)
      - `user_id` (text, from Clerk)
      - `media_id` (integer, from TMDB)
      - `media_type` (text, either 'movie' or 'tv')
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `watch_later` table
    - Add policies for authenticated users to:
      - Read their own watch later items
      - Add new items to their watch later list
      - Remove items from their watch later list
*/

CREATE TABLE IF NOT EXISTS watch_later (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  media_id integer NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('movie', 'tv')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, media_id, media_type)
);

ALTER TABLE watch_later ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own watch later items"
  ON watch_later
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can add to watch later"
  ON watch_later
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can remove from watch later"
  ON watch_later
  FOR DELETE
  USING (auth.uid()::text = user_id);
/*
  # Add Hidden Gems and Reviews tables

  1. New Tables
    - `hidden_gems`
      - `id` (uuid, primary key)
      - `user_id` (text, foreign key to auth.users)
      - `media_id` (integer)
      - `media_type` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
    - `reviews`
      - `id` (uuid, primary key)
      - `user_id` (text, foreign key to auth.users)
      - `media_id` (integer)
      - `media_type` (text)
      - `rating` (integer)
      - `review_text` (text)
      - `contains_spoilers` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `watch_status`
      - `id` (uuid, primary key)
      - `user_id` (text, foreign key to auth.users)
      - `media_id` (integer)
      - `media_type` (text)
      - `status` (text)
      - `notes` (text)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Hidden Gems Table
CREATE TABLE IF NOT EXISTS hidden_gems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  media_id INTEGER NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'movie',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, media_id, media_type)
);

ALTER TABLE hidden_gems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hidden_gems_select_policy" 
  ON hidden_gems 
  FOR SELECT 
  USING (true);

CREATE POLICY "hidden_gems_insert_policy" 
  ON hidden_gems 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "hidden_gems_update_policy" 
  ON hidden_gems 
  FOR UPDATE
  USING (true);

CREATE POLICY "hidden_gems_delete_policy" 
  ON hidden_gems 
  FOR DELETE 
  USING (true);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  media_id INTEGER NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'movie',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  review_text TEXT,
  contains_spoilers BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, media_id, media_type)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_policy" 
  ON reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "reviews_insert_policy" 
  ON reviews 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "reviews_update_policy" 
  ON reviews 
  FOR UPDATE
  USING (true);

CREATE POLICY "reviews_delete_policy" 
  ON reviews 
  FOR DELETE 
  USING (true);

-- Watch Status Table
CREATE TABLE IF NOT EXISTS watch_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  media_id INTEGER NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'movie',
  status TEXT NOT NULL CHECK (status IN ('planned', 'watched')),
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, media_id, media_type)
);

ALTER TABLE watch_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "watch_status_select_policy" 
  ON watch_status 
  FOR SELECT 
  USING (true);

CREATE POLICY "watch_status_insert_policy" 
  ON watch_status 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "watch_status_update_policy" 
  ON watch_status 
  FOR UPDATE
  USING (true);

CREATE POLICY "watch_status_delete_policy" 
  ON watch_status 
  FOR DELETE 
  USING (true);
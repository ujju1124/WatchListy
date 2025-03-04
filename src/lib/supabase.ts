import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface WatchLaterItem {
  id: string;
  user_id: string;
  media_id: number;
  media_type: 'movie' | 'tv';
  created_at: string;
}

export interface HiddenGemItem {
  id: string;
  user_id: string;
  media_id: number;
  media_type: 'movie' | 'tv';
  notes: string | null;
  created_at: string;
}

export interface ReviewItem {
  id: string;
  user_id: string;
  media_id: number;
  media_type: 'movie' | 'tv';
  rating: number;
  review_text: string | null;
  contains_spoilers: boolean;
  created_at: string;
  updated_at: string;
}

export interface WatchStatusItem {
  id: string;
  user_id: string;
  media_id: number;
  media_type: 'movie' | 'tv';
  status: 'planned' | 'watched';
  notes: string | null;
  updated_at: string;
}
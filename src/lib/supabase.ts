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
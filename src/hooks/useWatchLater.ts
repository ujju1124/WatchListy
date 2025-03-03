import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';
import type { WatchLaterItem } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function useWatchLater() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: watchLaterItems, isLoading } = useQuery<WatchLaterItem[]>(
    ['watchLater', user?.id],
    async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('watch_later')
          .select('*');

        if (error) {
          console.error('Error fetching watch later items:', error);
          throw error;
        }
        return data || [];
      } catch (error) {
        console.error('Error fetching watch later items:', error);
        return [];
      }
    },
    {
      enabled: !!user,
      retry: 3,
      onError: (error) => {
        console.error('Watch later query error:', error);
        toast.error('Failed to load your watch list');
      }
    }
  );

  const addToWatchLater = useMutation(
    async ({ mediaId, mediaType }: { mediaId: number; mediaType: string }) => {
      if (!user) throw new Error('Must be logged in');
      
      try {
        // First check if the item already exists to avoid duplicate errors
        const { data: existingItems } = await supabase
          .from('watch_later')
          .select('id')
          .eq('media_id', mediaId)
          .eq('media_type', mediaType || 'movie');
          
        if (existingItems && existingItems.length > 0) {
          // Item already exists, no need to insert
          return;
        }
        
        const { error } = await supabase
          .from('watch_later')
          .insert({
            user_id: user.id,
            media_id: mediaId,
            media_type: mediaType || 'movie',
          });
        
        if (error) {
          console.error('Error adding to watch later:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error adding to watch later:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['watchLater', user?.id]);
        toast.success('Added to Watch Later');
      },
      onError: (error: any) => {
        console.error('Add to watch later error:', error);
        toast.error(`Failed to add to Watch Later: ${error.message || 'Unknown error'}`);
      },
    }
  );

  const removeFromWatchLater = useMutation(
    async (mediaId: number) => {
      if (!user) throw new Error('Must be logged in');
      
      try {
        const { error } = await supabase
          .from('watch_later')
          .delete()
          .eq('media_id', mediaId);
        
        if (error) {
          console.error('Error removing from watch later:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error removing from watch later:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['watchLater', user?.id]);
        toast.success('Removed from Watch Later');
      },
      onError: (error: any) => {
        console.error('Remove from watch later error:', error);
        toast.error(`Failed to remove from Watch Later: ${error.message || 'Unknown error'}`);
      },
    }
  );

  return {
    watchLaterItems,
    isLoading,
    addToWatchLater,
    removeFromWatchLater,
  };
}
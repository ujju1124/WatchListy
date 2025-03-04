import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';
import type { HiddenGemItem } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function useHiddenGems() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: hiddenGems, isLoading } = useQuery<HiddenGemItem[]>(
    ['hiddenGems', user?.id],
    async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('hidden_gems')
          .select('*');

        if (error) {
          console.error('Error fetching hidden gems:', error);
          throw error;
        }
        return data || [];
      } catch (error) {
        console.error('Error fetching hidden gems:', error);
        return [];
      }
    },
    {
      enabled: !!user,
      retry: 3,
      onError: (error) => {
        console.error('Hidden gems query error:', error);
        toast.error('Failed to load your hidden gems');
      }
    }
  );

  const addToHiddenGems = useMutation(
    async ({ mediaId, mediaType, notes }: { mediaId: number; mediaType: string; notes?: string }) => {
      if (!user) throw new Error('Must be logged in');
      
      try {
        // First check if the item already exists to avoid duplicate errors
        const { data: existingItems } = await supabase
          .from('hidden_gems')
          .select('id')
          .eq('media_id', mediaId)
          .eq('media_type', mediaType || 'movie');
          
        if (existingItems && existingItems.length > 0) {
          // Item already exists, update notes if provided
          if (notes) {
            const { error } = await supabase
              .from('hidden_gems')
              .update({ notes })
              .eq('media_id', mediaId)
              .eq('media_type', mediaType || 'movie');
            
            if (error) throw error;
          }
          return;
        }
        
        const { error } = await supabase
          .from('hidden_gems')
          .insert({
            user_id: user.id,
            media_id: mediaId,
            media_type: mediaType || 'movie',
            notes: notes || null,
          });
        
        if (error) {
          console.error('Error adding to hidden gems:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error adding to hidden gems:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['hiddenGems', user?.id]);
        toast.success('Added to Hidden Gems');
      },
      onError: (error: any) => {
        console.error('Add to hidden gems error:', error);
        toast.error(`Failed to add to Hidden Gems: ${error.message || 'Unknown error'}`);
      },
    }
  );

  const updateHiddenGemNotes = useMutation(
    async ({ mediaId, notes }: { mediaId: number; notes: string }) => {
      if (!user) throw new Error('Must be logged in');
      
      try {
        const { error } = await supabase
          .from('hidden_gems')
          .update({ notes })
          .eq('media_id', mediaId)
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error updating hidden gem notes:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error updating hidden gem notes:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['hiddenGems', user?.id]);
        toast.success('Notes updated');
      },
      onError: (error: any) => {
        console.error('Update hidden gem notes error:', error);
        toast.error(`Failed to update notes: ${error.message || 'Unknown error'}`);
      },
    }
  );

  const removeFromHiddenGems = useMutation(
    async (mediaId: number) => {
      if (!user) throw new Error('Must be logged in');
      
      try {
        const { error } = await supabase
          .from('hidden_gems')
          .delete()
          .eq('media_id', mediaId)
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error removing from hidden gems:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error removing from hidden gems:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['hiddenGems', user?.id]);
        toast.success('Removed from Hidden Gems');
      },
      onError: (error: any) => {
        console.error('Remove from hidden gems error:', error);
        toast.error(`Failed to remove from Hidden Gems: ${error.message || 'Unknown error'}`);
      },
    }
  );

  return {
    hiddenGems,
    isLoading,
    addToHiddenGems,
    updateHiddenGemNotes,
    removeFromHiddenGems,
  };
}
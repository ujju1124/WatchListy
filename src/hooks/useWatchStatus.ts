import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';
import type { WatchStatusItem } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function useWatchStatus() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: watchStatusItems, isLoading } = useQuery<WatchStatusItem[]>(
    ['watchStatus', user?.id],
    async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('watch_status')
          .select('*');

        if (error) {
          console.error('Error fetching watch status items:', error);
          throw error;
        }
        return data || [];
      } catch (error) {
        console.error('Error fetching watch status items:', error);
        return [];
      }
    },
    {
      enabled: !!user,
      retry: 3,
      onError: (error) => {
        console.error('Watch status query error:', error);
        toast.error('Failed to load your watch status');
      }
    }
  );

  const updateWatchStatus = useMutation(
    async ({ 
      mediaId, 
      mediaType, 
      status, 
      notes 
    }: { 
      mediaId: number; 
      mediaType: string; 
      status: 'planned' | 'watched'; 
      notes?: string 
    }) => {
      if (!user) throw new Error('Must be logged in');
      
      try {
        // Check if status already exists
        const { data: existingStatus } = await supabase
          .from('watch_status')
          .select('id')
          .eq('media_id', mediaId)
          .eq('media_type', mediaType)
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (existingStatus) {
          // Update existing status
          const { error } = await supabase
            .from('watch_status')
            .update({
              status,
              notes: notes || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingStatus.id);
          
          if (error) throw error;
        } else {
          // Insert new status
          const { error } = await supabase
            .from('watch_status')
            .insert({
              user_id: user.id,
              media_id: mediaId,
              media_type: mediaType,
              status,
              notes: notes || null,
            });
          
          if (error) throw error;
        }
      } catch (error) {
        console.error('Error updating watch status:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['watchStatus', user?.id]);
        toast.success('Watch status updated');
      },
      onError: (error: any) => {
        console.error('Update watch status error:', error);
        toast.error(`Failed to update watch status: ${error.message || 'Unknown error'}`);
      },
    }
  );

  const removeWatchStatus = useMutation(
    async (mediaId: number) => {
      if (!user) throw new Error('Must be logged in');
      
      try {
        const { error } = await supabase
          .from('watch_status')
          .delete()
          .eq('media_id', mediaId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error removing watch status:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['watchStatus', user?.id]);
        toast.success('Watch status removed');
      },
      onError: (error: any) => {
        console.error('Remove watch status error:', error);
        toast.error(`Failed to remove watch status: ${error.message || 'Unknown error'}`);
      },
    }
  );

  return {
    watchStatusItems,
    isLoading,
    updateWatchStatus,
    removeWatchStatus,
  };
}
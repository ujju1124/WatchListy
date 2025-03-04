import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';
import type { ReviewItem } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export interface ReviewData {
  mediaId: number;
  mediaType: string;
  rating: number;
  reviewText?: string;
  containsSpoilers?: boolean;
}

export function useReviews() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: userReviews, isLoading: isLoadingUserReviews } = useQuery<ReviewItem[]>(
    ['userReviews', user?.id],
    async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user reviews:', error);
          throw error;
        }
        return data || [];
      } catch (error) {
        console.error('Error fetching user reviews:', error);
        return [];
      }
    },
    {
      enabled: !!user,
      retry: 3,
    }
  );

  const getMediaReviews = (mediaId: number, mediaType: string) => {
    return useQuery<ReviewItem[]>(
      ['mediaReviews', mediaId, mediaType],
      async () => {
        try {
          const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('media_id', mediaId)
            .eq('media_type', mediaType);

          if (error) {
            console.error('Error fetching media reviews:', error);
            throw error;
          }
          return data || [];
        } catch (error) {
          console.error('Error fetching media reviews:', error);
          return [];
        }
      },
      {
        retry: 3,
      }
    );
  };

  const getUserReviewForMedia = (mediaId: number, mediaType: string) => {
    return useQuery<ReviewItem | null>(
      ['userReview', user?.id, mediaId, mediaType],
      async () => {
        if (!user) return null;
        
        try {
          const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('user_id', user.id)
            .eq('media_id', mediaId)
            .eq('media_type', mediaType)
            .maybeSingle();

          if (error) {
            console.error('Error fetching user review for media:', error);
            throw error;
          }
          return data;
        } catch (error) {
          console.error('Error fetching user review for media:', error);
          return null;
        }
      },
      {
        enabled: !!user,
        retry: 3,
      }
    );
  };

  const addReview = useMutation(
    async (reviewData: ReviewData) => {
      if (!user) throw new Error('Must be logged in');
      
      try {
        // Check if review already exists
        const { data: existingReview } = await supabase
          .from('reviews')
          .select('id')
          .eq('user_id', user.id)
          .eq('media_id', reviewData.mediaId)
          .eq('media_type', reviewData.mediaType)
          .maybeSingle();
          
        if (existingReview) {
          // Update existing review
          const { error } = await supabase
            .from('reviews')
            .update({
              rating: reviewData.rating,
              review_text: reviewData.reviewText || null,
              contains_spoilers: reviewData.containsSpoilers || false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingReview.id);
          
          if (error) throw error;
          return;
        }
        
        // Insert new review
        const { error } = await supabase
          .from('reviews')
          .insert({
            user_id: user.id,
            media_id: reviewData.mediaId,
            media_type: reviewData.mediaType,
            rating: reviewData.rating,
            review_text: reviewData.reviewText || null,
            contains_spoilers: reviewData.containsSpoilers || false,
          });
        
        if (error) throw error;
      } catch (error) {
        console.error('Error adding/updating review:', error);
        throw error;
      }
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['userReviews', user?.id]);
        queryClient.invalidateQueries(['mediaReviews', variables.mediaId, variables.mediaType]);
        queryClient.invalidateQueries(['userReview', user?.id, variables.mediaId, variables.mediaType]);
        toast.success('Review saved successfully');
      },
      onError: (error: any) => {
        console.error('Review error:', error);
        toast.error(`Failed to save review: ${error.message || 'Unknown error'}`);
      },
    }
  );

  const deleteReview = useMutation(
    async ({ mediaId, mediaType }: { mediaId: number; mediaType: string }) => {
      if (!user) throw new Error('Must be logged in');
      
      try {
        const { error } = await supabase
          .from('reviews')
          .delete()
          .eq('user_id', user.id)
          .eq('media_id', mediaId)
          .eq('media_type', mediaType);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
      }
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['userReviews', user?.id]);
        queryClient.invalidateQueries(['mediaReviews', variables.mediaId, variables.mediaType]);
        queryClient.invalidateQueries(['userReview', user?.id, variables.mediaId, variables.mediaType]);
        toast.success('Review deleted');
      },
      onError: (error: any) => {
        console.error('Delete review error:', error);
        toast.error(`Failed to delete review: ${error.message || 'Unknown error'}`);
      },
    }
  );

  return {
    userReviews,
    isLoadingUserReviews,
    getMediaReviews,
    getUserReviewForMedia,
    addReview,
    deleteReview,
  };
}
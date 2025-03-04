import React from 'react';
import { useReviews } from '../hooks/useReviews';
import { Star, AlertTriangle, User } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ReviewListProps {
  mediaId: number;
  mediaType: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ mediaId, mediaType }) => {
  const { getMediaReviews } = useReviews();
  const { data: reviews, isLoading } = getMediaReviews(mediaId, mediaType);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <Skeleton height={24} width={150} baseColor="#1f2937" highlightColor="#374151" />
            <Skeleton height={16} width={100} className="mt-2" baseColor="#1f2937" highlightColor="#374151" />
            <Skeleton count={3} className="mt-4" baseColor="#1f2937" highlightColor="#374151" />
          </div>
        ))}
      </div>
    );
  }
  
  if (!reviews?.length) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
        <p className="text-gray-400">No reviews yet. Be the first to review!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {reviews.map(review => (
        <div key={review.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="bg-gray-700 rounded-full p-2 mr-3">
                <User size={20} className="text-gray-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">User</h4>
                <div className="flex items-center mt-1">
                  {[...Array(10)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-300">{review.rating}/10</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
          
          {review.review_text && (
            <div className="mt-3">
              {review.contains_spoilers && (
                <div className="flex items-center text-amber-500 mb-2">
                  <AlertTriangle size={16} className="mr-1" />
                  <span className="text-sm">Contains spoilers</span>
                </div>
              )}
              <p className="text-gray-300">{review.review_text}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
import React, { useState } from 'react';
import { useReviews } from '../hooks/useReviews';
import { Star, AlertTriangle } from 'lucide-react';
import type { ReviewItem } from '../lib/supabase';

interface ReviewFormProps {
  mediaId: number;
  mediaType: string;
  existingReview?: ReviewItem | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ 
  mediaId, 
  mediaType, 
  existingReview, 
  onCancel,
  onSuccess
}) => {
  const { addReview, deleteReview } = useReviews();
  
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(existingReview?.review_text || '');
  const [containsSpoilers, setContainsSpoilers] = useState(existingReview?.contains_spoilers || false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addReview.mutate({
      mediaId,
      mediaType,
      rating,
      reviewText: reviewText.trim() || undefined,
      containsSpoilers
    }, {
      onSuccess: () => {
        onSuccess();
      }
    });
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete your review?')) {
      deleteReview.mutate({
        mediaId,
        mediaType
      }, {
        onSuccess: () => {
          onSuccess();
        }
      });
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Rating
          </label>
          <div className="flex items-center">
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  size={28}
                  className={`${
                    (hoverRating || rating) > i
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-500"
                  } transition-colors`}
                />
              </button>
            ))}
            <span className="ml-2 text-white font-bold">{hoverRating || rating}/10</span>
          </div>
        </div>
        
        {/* Review Text */}
        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-gray-300 mb-2">
            Your Review (optional)
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your thoughts about this title..."
          />
        </div>
        
        {/* Spoiler Toggle */}
        {reviewText.trim() && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="containsSpoilers"
              checked={containsSpoilers}
              onChange={(e) => setContainsSpoilers(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="containsSpoilers" className="ml-2 text-sm text-gray-300 flex items-center">
              <AlertTriangle size={16} className="mr-1 text-amber-500" />
              Contains spoilers
            </label>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          {existingReview && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {addReview.isLoading ? 'Saving...' : 'Save Review'}
          </button>
        </div>
      </form>
    </div>
  );
};
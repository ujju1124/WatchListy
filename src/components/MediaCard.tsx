import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Bookmark, BookmarkCheck, Info, X, Tag, Gem, Eye, Clock } from 'lucide-react';
import { useWatchLater } from '../hooks/useWatchLater';
import { useHiddenGems } from '../hooks/useHiddenGems';
import { useWatchStatus } from '../hooks/useWatchStatus';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import type { MediaItem } from '../types/tmdb';
import { cn } from '../lib/utils';

interface MediaCardProps {
  item: MediaItem;
  genreMap?: Map<number, string>;
}

export const MediaCard = ({ item, genreMap }: MediaCardProps) => {
  const { user, isSignedIn } = useUser();
  const { watchLaterItems, addToWatchLater, removeFromWatchLater } = useWatchLater();
  const { hiddenGems, addToHiddenGems, removeFromHiddenGems } = useHiddenGems();
  const { watchStatusItems, updateWatchStatus } = useWatchStatus();
  const [showDetails, setShowDetails] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');

  const isInWatchLater = watchLaterItems?.some(
    (watchItem) => watchItem.media_id === item.id
  );

  const isHiddenGem = hiddenGems?.some(
    (gemItem) => gemItem.media_id === item.id
  );

  const watchStatus = watchStatusItems?.find(
    (statusItem) => statusItem.media_id === item.id
  );

  const handleWatchLater = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSignedIn) {
      toast.error('Please sign in to add to your watch list');
      return;
    }
    
    if (isInWatchLater) {
      removeFromWatchLater.mutate(item.id);
    } else {
      addToWatchLater.mutate({
        mediaId: item.id,
        mediaType: item.media_type || 'movie',
      });
    }
  };

  const handleHiddenGem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSignedIn) {
      toast.error('Please sign in to add to your hidden gems');
      return;
    }
    
    if (isHiddenGem) {
      removeFromHiddenGems.mutate(item.id);
    } else {
      setShowNotesModal(true);
    }
  };

  const handleAddHiddenGem = () => {
    addToHiddenGems.mutate({
      mediaId: item.id,
      mediaType: item.media_type || 'movie',
      notes: notes
    });
    setShowNotesModal(false);
    setNotes('');
  };

  const handleWatchStatus = (status: 'planned' | 'watched') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSignedIn) {
      toast.error('Please sign in to update watch status');
      return;
    }
    
    updateWatchStatus.mutate({
      mediaId: item.id,
      mediaType: item.media_type || 'movie',
      status
    });
  };

  const title = 'title' in item ? item.title : item.name;
  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  // Get genre names from IDs
  const genreNames = item.genre_ids?.map(id => genreMap?.get(id) || '').filter(Boolean) || [];
  
  // Get the first genre for the badge
  const primaryGenre = genreNames[0];

  // Determine the detail page URL
  const detailUrl = `/${item.media_type || 'movie'}/${item.id}`;

  return (
    <div className="relative group block">
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700">
        <div className="relative aspect-[2/3]">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Overlay that appears on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Primary genre badge */}
          {primaryGenre && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600/80 text-white text-xs rounded-md">
              {primaryGenre}
            </div>
          )}
          
          {/* Rating badge */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-600/80 text-white text-xs rounded-md flex items-center">
            <span className="mr-1">★</span>
            {item.vote_average?.toFixed(1) || 'N/A'}
          </div>
          
          {/* Watch status badge if exists */}
          {watchStatus && (
            <div className={`absolute top-10 right-2 px-2 py-1 text-white text-xs rounded-md flex items-center ${
              watchStatus.status === 'watched' ? 'bg-green-600/80' : 'bg-blue-600/80'
            }`}>
              {watchStatus.status === 'watched' ? (
                <>
                  <Eye size={12} className="mr-1" />
                  <span>Watched</span>
                </>
              ) : (
                <>
                  <Clock size={12} className="mr-1" />
                  <span>Planned</span>
                </>
              )}
            </div>
          )}
          
          {/* Action buttons that appear on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-between text-white">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDetails(true);
                }}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Info size={16} />
                <span>Details</span>
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={handleHiddenGem}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors",
                    isHiddenGem 
                      ? "bg-amber-600 hover:bg-amber-700" 
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                >
                  <Gem size={16} />
                </button>
                <button
                  onClick={handleWatchLater}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors",
                    isInWatchLater 
                      ? "bg-purple-600 hover:bg-purple-700" 
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                >
                  {isInWatchLater ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-1 truncate">{title}</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}</span>
            <span className="capitalize text-gray-400">{item.media_type || 'movie'}</span>
          </div>
        </div>
      </div>


      {/* Movie Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowDetails(false);
        }}>
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img
                src={item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : imageUrl}
                alt={title}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDetails(false);
                }}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                <span>{releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}</span>
                <span className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  {item.vote_average?.toFixed(1) || 'N/A'}
                </span>
                <span className="capitalize">{item.media_type || 'movie'}</span>
              </div>
              
              {/* Genres */}
              {genreNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {genreNames.map(genre => (
                    <span 
                      key={genre} 
                      className="px-2 py-1 bg-blue-900/50 text-blue-200 text-xs rounded-md flex items-center"
                    >
                      <Tag size={12} className="mr-1" />
                      {genre}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-gray-300 leading-relaxed mb-6">{item.overview || 'No description available.'}</p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleWatchLater}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isInWatchLater
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {isInWatchLater ? (
                    <>
                      <BookmarkCheck size={20} />
                      <span>Added to Watch Later</span>
                    </>
                  ) : (
                    <>
                      <Bookmark size={20} />
                      <span>Add to Watch Later</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleHiddenGem}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isHiddenGem
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  } text-white`}
                >
                  <Gem size={20} />
                  <span>{isHiddenGem ? 'Remove from Hidden Gems' : 'Add to Hidden Gems'}</span>
                </button>
              </div>
              
              {/* Watch Status Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Watch Status</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleWatchStatus('watched')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      watchStatus?.status === 'watched'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-700 hover:bg-gray-600'
                    } text-white`}
                  >
                    <Eye size={20} />
                    <span>Watched</span>
                  </button>
                  <button
                    onClick={handleWatchStatus('planned')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      watchStatus?.status === 'planned'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-700 hover:bg-gray-600'
                    } text-white`}
                  >
                    <Clock size={20} />
                    <span>Plan to Watch</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <Link
                  to={detailUrl}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info size={20} />
                  <span>View Full Details</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Gem Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowNotesModal(false);
        }}>
          <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-700 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Add to Hidden Gems</h3>
            <p className="text-gray-300 mb-4">Why do you consider this a hidden gem? (optional)</p>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What makes this special? (optional)"
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows={4}
            />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowNotesModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddHiddenGem();
                }}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
              >
                Add to Hidden Gems
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
  );
};
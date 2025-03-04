import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { tmdbApi } from '../lib/axios';
import { useHiddenGems } from '../hooks/useHiddenGems';
import { MediaCard } from './MediaCard';
import type { MediaItem, Genre } from '../types/tmdb';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useUser } from '@clerk/clerk-react';
import { SignInButton } from '@clerk/clerk-react';
import { Gem, X, Pencil } from 'lucide-react';

export const HiddenGemsPage = () => {
  const { isSignedIn } = useUser();
  const { hiddenGems, isLoading: isLoadingGems, updateHiddenGemNotes } = useHiddenGems();
  const [editingGem, setEditingGem] = useState<{ id: number, notes: string } | null>(null);

  // Fetch genres for both movies and TV shows
  const { data: movieGenres } = useQuery<{ genres: Genre[] }>(
    'movieGenres',
    async () => {
      const { data } = await tmdbApi.get('/genre/movie/list');
      return data;
    }
  );

  const { data: tvGenres } = useQuery<{ genres: Genre[] }>(
    'tvGenres',
    async () => {
      const { data } = await tmdbApi.get('/genre/tv/list');
      return data;
    }
  );

  // Combine all genres
  const allGenres = React.useMemo(() => {
    const genres = new Map<number, string>();
    movieGenres?.genres.forEach(genre => genres.set(genre.id, genre.name));
    tvGenres?.genres.forEach(genre => genres.set(genre.id, genre.name));
    return genres;
  }, [movieGenres, tvGenres]);

  const { data: mediaItems, isLoading: isLoadingDetails } = useQuery(
    ['hiddenGemsDetails', hiddenGems],
    async () => {
      if (!hiddenGems?.length) return [];
      
      const items = await Promise.all(
        hiddenGems.map(async (item) => {
          try {
            const { data } = await tmdbApi.get(`/${item.media_type}/${item.media_id}`);
            // Get genre IDs for the item
            const genreIds = data.genres?.map((g: Genre) => g.id) || [];
            return { 
              ...data, 
              media_type: item.media_type,
              genre_ids: genreIds,
              gem_notes: item.notes,
              gem_id: item.id
            };
          } catch (error) {
            console.error(`Error fetching details for ${item.media_type}/${item.media_id}:`, error);
            return null;
          }
        })
      );
      
      return items.filter(Boolean) as (MediaItem & { gem_notes?: string, gem_id?: string })[];
    },
    {
      enabled: !!hiddenGems?.length,
    }
  );

  const isLoading = isLoadingGems || isLoadingDetails;

  const handleSaveNotes = () => {
    if (editingGem) {
      updateHiddenGemNotes.mutate({
        mediaId: editingGem.id,
        notes: editingGem.notes
      });
      setEditingGem(null);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Gem className="w-16 h-16 text-amber-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Sign in to access your Hidden Gems</h2>
        <p className="text-gray-400 mb-6">Keep track of underrated movies and shows you love</p>
        <SignInButton mode="modal">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </button>
        </SignInButton>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[400px]">
            <Skeleton height="100%" baseColor="#1f2937" highlightColor="#374151" />
          </div>
        ))}
      </div>
    );
  }

  if (!mediaItems?.length) {
    return (
      <div className="text-center py-12">
        <Gem className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-300">Your Hidden Gems collection is empty</h2>
        <p className="text-gray-400 mt-2">Start adding underrated movies and TV shows you love</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Hidden Gems</h2>
        <div className="text-gray-400 text-sm">
          Your personal collection of underrated favorites
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mediaItems.map((item) => (
          <div key={item.id} className="space-y-3">
            <MediaCard item={item} genreMap={allGenres} />
            
            {/* Notes section */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-300">Your Notes</h4>
                {editingGem?.id === item.id ? (
                  <button 
                    onClick={handleSaveNotes}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Save
                  </button>
                ) : (
                  <button 
                    onClick={() => setEditingGem({ id: item.id, notes: item.gem_notes || '' })}
                    className="text-gray-400 hover:text-white"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>
              
              {editingGem?.id === item.id ? (
                <textarea
                  value={editingGem.notes}
                  onChange={(e) => setEditingGem({ ...editingGem, notes: e.target.value })}
                  placeholder="Why is this a hidden gem?"
                  className="w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-gray-400">
                  {item.gem_notes || "No notes added yet. Click the edit button to add why this is special to you."}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
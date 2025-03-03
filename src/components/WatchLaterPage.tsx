import React from 'react';
import { useQuery } from 'react-query';
import { tmdbApi } from '../lib/axios';
import { useWatchLater } from '../hooks/useWatchLater';
import { MediaCard } from './MediaCard';
import type { MediaItem, Genre } from '../types/tmdb';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useUser } from '@clerk/clerk-react';
import { SignInButton } from '@clerk/clerk-react';
import { Bookmark } from 'lucide-react';

export const WatchLaterPage = () => {
  const { isSignedIn } = useUser();
  const { watchLaterItems, isLoading: isLoadingWatchList } = useWatchLater();

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
    ['watchLaterDetails', watchLaterItems],
    async () => {
      if (!watchLaterItems?.length) return [];
      
      const items = await Promise.all(
        watchLaterItems.map(async (item) => {
          try {
            const { data } = await tmdbApi.get(`/${item.media_type}/${item.media_id}`);
            // Get genre IDs for the item
            const genreIds = data.genres?.map((g: Genre) => g.id) || [];
            return { 
              ...data, 
              media_type: item.media_type,
              genre_ids: genreIds
            };
          } catch (error) {
            console.error(`Error fetching details for ${item.media_type}/${item.media_id}:`, error);
            return null;
          }
        })
      );
      
      return items.filter(Boolean) as MediaItem[];
    },
    {
      enabled: !!watchLaterItems?.length,
    }
  );

  const isLoading = isLoadingWatchList || isLoadingDetails;

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Bookmark className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Sign in to access your Watch Later list</h2>
        <p className="text-gray-400 mb-6">Keep track of movies and shows you want to watch</p>
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
        <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-300">Your watch list is empty</h2>
        <p className="text-gray-400 mt-2">Start adding movies and TV shows to watch later</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Watch Later</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mediaItems.map((item) => (
          <MediaCard key={item.id} item={item} genreMap={allGenres} />
        ))}
      </div>
    </div>
  );
}
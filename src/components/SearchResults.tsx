import React from 'react';
import { useQuery } from 'react-query';
import { tmdbApi } from '../lib/axios';
import { useSearchStore } from '../store/searchStore';
import { MediaCard } from './MediaCard';
import { SearchBar } from './SearchBar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import type { SearchResponse } from '../types/tmdb';

export const SearchResults = () => {
  const { searchQuery, filters } = useSearchStore();

  const { data, isLoading } = useQuery<SearchResponse>(
    ['search', searchQuery, filters],
    async () => {
      if (!searchQuery) return null;

      const params: Record<string, string> = {
        query: searchQuery,
        include_adult: 'false',
        language: 'en-US',
        page: '1',
      };

      if (filters.mediaType !== 'all') {
        params.media_type = filters.mediaType;
      }

      if (filters.year) {
        params.year = filters.year;
      }

      if (filters.genre) {
        params.with_genres = filters.genre;
      }

      const { data } = await tmdbApi.get<SearchResponse>('/search/multi', { params });
      return data;
    },
    {
      enabled: !!searchQuery,
    }
  );

  const filteredResults = data?.results.filter(
    (item) => item.vote_average >= filters.rating
  );

  return (
    <div className="space-y-8">
      <SearchBar />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[400px]">
              <Skeleton height="100%" />
            </div>
          ))}
        </div>
      ) : searchQuery && filteredResults?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-300">No results found</h2>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : !searchQuery ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-300">Search for movies and TV shows</h2>
          <p className="text-gray-400 mt-2">Enter a title above to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredResults?.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
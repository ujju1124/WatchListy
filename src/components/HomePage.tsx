import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { tmdbApi } from '../lib/axios';
import { MediaCard } from './MediaCard';
import { SearchBar } from './SearchBar';
import { useSearchStore } from '../store/searchStore';
import Skeleton from 'react-loading-skeleton';
import type { MediaItem, SearchResponse, Genre } from '../types/tmdb';
import 'react-loading-skeleton/dist/skeleton.css';
import { Tabs } from './ui/Tabs';
import { Pagination } from './ui/Pagination';

export const HomePage = () => {
  const { searchQuery } = useSearchStore();
  const [activeTab, setActiveTab] = useState('trending');
  
  // Pagination state
  const [trendingPage, setTrendingPage] = useState(1);
  const [recentPage, setRecentPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [popularTVPage, setPopularTVPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);

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

  // Query for trending
  const { data: trendingData, isLoading: trendingLoading } = useQuery<SearchResponse>(
    ['trending', trendingPage],
    async () => {
      const { data } = await tmdbApi.get('/trending/all/week', {
        params: { page: trendingPage }
      });
      return data;
    },
    {
      enabled: !searchQuery && activeTab === 'trending',
      keepPreviousData: true,
    }
  );

  // Query for recent
  const { data: recentData, isLoading: recentLoading } = useQuery<SearchResponse>(
    ['recent', recentPage],
    async () => {
      const { data } = await tmdbApi.get('/movie/now_playing', {
        params: { page: recentPage }
      });
      // Add media_type to results
      data.results = data.results.map(item => ({ ...item, media_type: 'movie' }));
      return data;
    },
    {
      enabled: !searchQuery && activeTab === 'recent',
      keepPreviousData: true,
    }
  );

  // Query for top rated
  const { data: topRatedData, isLoading: topRatedLoading } = useQuery<SearchResponse>(
    ['topRated', topRatedPage],
    async () => {
      const { data } = await tmdbApi.get('/movie/top_rated', {
        params: { page: topRatedPage }
      });
      // Add media_type to results
      data.results = data.results.map(item => ({ ...item, media_type: 'movie' }));
      return data;
    },
    {
      enabled: !searchQuery && activeTab === 'topRated',
      keepPreviousData: true,
    }
  );

  // Query for popular TV
  const { data: popularTVData, isLoading: popularTVLoading } = useQuery<SearchResponse>(
    ['popularTV', popularTVPage],
    async () => {
      const { data } = await tmdbApi.get('/tv/popular', {
        params: { page: popularTVPage }
      });
      // Add media_type to results
      data.results = data.results.map(item => ({ ...item, media_type: 'tv' }));
      return data;
    },
    {
      enabled: !searchQuery && activeTab === 'popularTV',
      keepPreviousData: true,
    }
  );

  // Query for search
  const { data: searchData, isLoading: searchLoading } = useQuery<SearchResponse>(
    ['search', searchQuery, searchPage],
    async () => {
      if (!searchQuery) return null;

      const params = {
        query: searchQuery,
        include_adult: false,
        language: 'en-US',
        page: searchPage,
      };

      try {
        const { data } = await tmdbApi.get<SearchResponse>('/search/multi', { params });
        return data;
      } catch (error) {
        console.error('Search error:', error);
        throw error;
      }
    },
    {
      enabled: !!searchQuery,
      keepPreviousData: true,
    }
  );

  const renderMediaGrid = (items: MediaItem[] | undefined, loading: boolean) => {
    if (loading && !items?.length) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[400px]">
              <Skeleton height="100%" baseColor="#1f2937" highlightColor="#374151" />
            </div>
          ))}
        </div>
      );
    }

    return items?.length ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <MediaCard 
            key={`${item.id}-${item.media_type || 'movie'}`} 
            item={item} 
            genreMap={allGenres}
          />
        ))}
      </div>
    ) : null;
  };

  const tabs = [
    { id: 'trending', label: 'Trending' },
    { id: 'recent', label: 'New Releases' },
    { id: 'topRated', label: 'Top Rated' },
    { id: 'popularTV', label: 'Popular TV' },
  ];

  // Handle page change based on active tab or search
  const handlePageChange = (page: number) => {
    if (searchQuery) {
      setSearchPage(page);
      return;
    }
    
    switch (activeTab) {
      case 'trending':
        setTrendingPage(page);
        break;
      case 'recent':
        setRecentPage(page);
        break;
      case 'topRated':
        setTopRatedPage(page);
        break;
      case 'popularTV':
        setPopularTVPage(page);
        break;
    }
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get current page and total pages based on active tab or search
  const getCurrentPage = () => {
    if (searchQuery) {
      return searchPage;
    }
    
    switch (activeTab) {
      case 'trending':
        return trendingPage;
      case 'recent':
        return recentPage;
      case 'topRated':
        return topRatedPage;
      case 'popularTV':
        return popularTVPage;
      default:
        return 1;
    }
  };

  const getTotalPages = () => {
    if (searchQuery) {
      return searchData?.total_pages || 1;
    }
    
    switch (activeTab) {
      case 'trending':
        return trendingData?.total_pages || 1;
      case 'recent':
        return recentData?.total_pages || 1;
      case 'topRated':
        return topRatedData?.total_pages || 1;
      case 'popularTV':
        return popularTVData?.total_pages || 1;
      default:
        return 1;
    }
  };

  // Reset page when changing tabs
  React.useEffect(() => {
    if (activeTab === 'trending') setTrendingPage(1);
    if (activeTab === 'recent') setRecentPage(1);
    if (activeTab === 'topRated') setTopRatedPage(1);
    if (activeTab === 'popularTV') setPopularTVPage(1);
  }, [activeTab]);

  // Reset search page when search query changes
  React.useEffect(() => {
    setSearchPage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-12">
      <SearchBar />
      
      {searchQuery ? (
        <div>
          {searchLoading && !searchData?.results?.length ? (
            renderMediaGrid(undefined, true)
          ) : searchData?.results?.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-300">No results found</h2>
              <p className="text-gray-400 mt-2">Try adjusting your search</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Search Results</h2>
              {renderMediaGrid(searchData?.results, false)}
              
              {/* Pagination for search results */}
              {searchData && searchData.total_pages > 1 && (
                <div className="mt-8">
                  <Pagination 
                    currentPage={searchPage}
                    totalPages={Math.min(searchData.total_pages, 500)} // TMDb API limits to 500 pages
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          
          {activeTab === 'trending' && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Trending This Week</h2>
              {renderMediaGrid(trendingData?.results, trendingLoading)}
              
              {/* Pagination for trending */}
              {trendingData && trendingData.total_pages > 1 && (
                <div className="mt-8">
                  <Pagination 
                    currentPage={trendingPage}
                    totalPages={Math.min(trendingData.total_pages, 500)}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </section>
          )}

          {activeTab === 'recent' && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Recently Released</h2>
              {renderMediaGrid(recentData?.results, recentLoading)}
              
              {/* Pagination for recent */}
              {recentData && recentData.total_pages > 1 && (
                <div className="mt-8">
                  <Pagination 
                    currentPage={recentPage}
                    totalPages={Math.min(recentData.total_pages, 500)}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </section>
          )}

          {activeTab === 'topRated' && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Top Rated Movies</h2>
              {renderMediaGrid(topRatedData?.results, topRatedLoading)}
              
              {/* Pagination for top rated */}
              {topRatedData && topRatedData.total_pages > 1 && (
                <div className="mt-8">
                  <Pagination 
                    currentPage={topRatedPage}
                    totalPages={Math.min(topRatedData.total_pages, 500)}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </section>
          )}

          {activeTab === 'popularTV' && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Popular TV Shows</h2>
              {renderMediaGrid(popularTVData?.results, popularTVLoading)}
              
              {/* Pagination for popular TV */}
              {popularTVData && popularTVData.total_pages > 1 && (
                <div className="mt-8">
                  <Pagination 
                    currentPage={popularTVPage}
                    totalPages={Math.min(popularTVData.total_pages, 500)}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </section>
          )}
        </>
      )}
      
      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-800">
        <div className="flex flex-col items-center">
          <p className="text-gray-400 text-sm mb-6 text-center">
            © {new Date().getFullYear()} WatchListy by Ujwal Dahal. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { tmdbApi } from '../lib/axios';
import { useUser } from '@clerk/clerk-react';
import { useWatchLater } from '../hooks/useWatchLater';
import { Bookmark, BookmarkCheck, ArrowLeft, Star, Calendar, Clock, Film, Tv } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface MovieDetailsPageProps {
  type: 'movie' | 'tv';
}

export const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({ type }) => {
  const { id } = useParams<{ id: string }>();
  const { isSignedIn } = useUser();
  const { watchLaterItems, addToWatchLater, removeFromWatchLater } = useWatchLater();

  const { data: details, isLoading } = useQuery(
    [`${type}Details`, id],
    async () => {
      const { data } = await tmdbApi.get(`/${type}/${id}`);
      return data;
    },
    {
      enabled: !!id,
    }
  );

  const { data: credits, isLoading: isLoadingCredits } = useQuery(
    [`${type}Credits`, id],
    async () => {
      const { data } = await tmdbApi.get(`/${type}/${id}/credits`);
      return data;
    },
    {
      enabled: !!id,
    }
  );

  const { data: similar, isLoading: isLoadingSimilar } = useQuery(
    [`${type}Similar`, id],
    async () => {
      const { data } = await tmdbApi.get(`/${type}/${id}/similar`);
      return data;
    },
    {
      enabled: !!id,
    }
  );

  const isInWatchLater = watchLaterItems?.some(
    (watchItem) => watchItem.media_id === Number(id)
  );

  const handleWatchLater = () => {
    if (!isSignedIn) {
      toast.error('Please sign in to add to your watch list');
      return;
    }
    
    if (isInWatchLater) {
      removeFromWatchLater.mutate(Number(id));
    } else {
      addToWatchLater.mutate({
        mediaId: Number(id),
        mediaType: type,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton height={400} baseColor="#1f2937" highlightColor="#374151" />
        <Skeleton height={30} width={300} baseColor="#1f2937" highlightColor="#374151" />
        <Skeleton count={3} baseColor="#1f2937" highlightColor="#374151" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-300">Details not found</h2>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Return to home
        </Link>
      </div>
    );
  }

  const title = type === 'movie' ? details.title : details.name;
  const releaseDate = type === 'movie' ? details.release_date : details.first_air_date;
  const runtime = type === 'movie' ? details.runtime : details.episode_run_time?.[0];
  
  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get director or creators
  const director = credits?.crew?.find(person => person.job === 'Director')?.name;
  const creators = type === 'tv' ? details.created_by?.map(person => person.name).join(', ') : null;

  // Get top cast
  const topCast = credits?.cast?.slice(0, 6) || [];

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={20} className="mr-2" />
        Back to browse
      </Link>

      {/* Backdrop and basic info */}
      <div className="relative rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-10" />
        
        {details.backdrop_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={title}
            className="w-full h-[400px] object-cover"
          />
        ) : (
          <div className="w-full h-[400px] bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500 text-lg">No backdrop available</span>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {details.poster_path && (
              <img 
                src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
                alt={title}
                className="w-32 h-48 object-cover rounded-lg shadow-lg border border-gray-700 hidden md:block"
              />
            )}
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
                {releaseDate && (
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1 text-gray-400" />
                    {new Date(releaseDate).getFullYear()}
                  </div>
                )}
                
                {runtime && (
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1 text-gray-400" />
                    {formatRuntime(runtime)}
                  </div>
                )}
                
                {details.vote_average && (
                  <div className="flex items-center">
                    <Star size={16} className="mr-1 text-yellow-500" />
                    {details.vote_average.toFixed(1)}
                  </div>
                )}
                
                <div className="flex items-center">
                  {type === 'movie' ? (
                    <Film size={16} className="mr-1 text-gray-400" />
                  ) : (
                    <Tv size={16} className="mr-1 text-gray-400" />
                  )}
                  <span className="capitalize">{type}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {details.genres?.map(genre => (
                  <span 
                    key={genre.id} 
                    className="px-2 py-1 bg-blue-900/50 text-blue-200 text-xs rounded-md"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
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
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
            <p className="text-gray-300 leading-relaxed">
              {details.overview || 'No overview available.'}
            </p>
          </section>
          
          {/* Cast */}
          {topCast.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {topCast.map(person => (
                  <div key={person.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    {person.profile_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="font-medium text-white">{person.name}</h3>
                      <p className="text-sm text-gray-400">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        <div className="space-y-8">
          {/* Details */}
          <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Details</h2>
            <dl className="space-y-3">
              {director && (
                <div>
                  <dt className="text-sm text-gray-400">Director</dt>
                  <dd className="text-white">{director}</dd>
                </div>
              )}
              
              {creators && (
                <div>
                  <dt className="text-sm text-gray-400">Created By</dt>
                  <dd className="text-white">{creators}</dd>
                </div>
              )}
              
              {details.status && (
                <div>
                  <dt className="text-sm text-gray-400">Status</dt>
                  <dd className="text-white">{details.status}</dd>
                </div>
              )}
              
              {type === 'movie' && details.budget > 0 && (
                <div>
                  <dt className="text-sm text-gray-400">Budget</dt>
                  <dd className="text-white">${details.budget.toLocaleString()}</dd>
                </div>
              )}
              
              {type === 'movie' && details.revenue > 0 && (
                <div>
                  <dt className="text-sm text-gray-400">Revenue</dt>
                  <dd className="text-white">${details.revenue.toLocaleString()}</dd>
                </div>
              )}
              
              {type === 'tv' && details.number_of_seasons && (
                <div>
                  <dt className="text-sm text-gray-400">Seasons</dt>
                  <dd className="text-white">{details.number_of_seasons}</dd>
                </div>
              )}
              
              {type === 'tv' && details.number_of_episodes && (
                <div>
                  <dt className="text-sm text-gray-400">Episodes</dt>
                  <dd className="text-white">{details.number_of_episodes}</dd>
                </div>
              )}
              
              {details.production_companies?.length > 0 && (
                <div>
                  <dt className="text-sm text-gray-400">Production</dt>
                  <dd className="text-white">
                    {details.production_companies.map(company => company.name).join(', ')}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </div>
      
      {/* Similar titles */}
      {similar?.results?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {similar.results.slice(0, 6).map(item => (
              <Link 
                key={item.id} 
                to={`/${type}/${item.id}`}
                className="block bg-gray-800 rounded-lg overflow-hidden border border-gray-700 transition-transform hover:scale-105"
              >
                {item.poster_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                    alt={type === 'movie' ? item.title : item.name}
                    className="w-full aspect-[2/3] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No image</span>
                  </div>
                )}
                <div className="p-2">
                  <h3 className="font-medium text-white text-sm truncate">
                    {type === 'movie' ? item.title : item.name}
                  </h3>
                  {item.vote_average > 0 && (
                    <div className="flex items-center text-xs text-yellow-500">
                      <Star size={12} className="mr-1" />
                      {item.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  media_type: 'movie';
  genre_ids?: number[];
  genres?: Genre[];
}

export interface Series {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  media_type: 'tv';
  genre_ids?: number[];
  genres?: Genre[];
}

export type MediaItem = Movie | Series;

export interface SearchResponse {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}
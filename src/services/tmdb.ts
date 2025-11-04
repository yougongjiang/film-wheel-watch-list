import { Movie, MovieDetail, TMDBResponse, Cast, Crew, Video, Review } from '@/types/movie';

const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTdkNjY4ZmNhMWQ1NzI0Y2I0MTljYzQxYWVmMmMwZiIsIm5iZiI6MTczMDcxMzE5MS4wMDczNTgzLCJzdWIiOiI2NzI2YjFiZjA1Y2MxZDRiMWQ4NWVkZGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Mfc6VqQIvN_AGbDOX2W5F-dQxIiXq5pCfHRgQe9HvG8';
const BASE_URL = 'https://api.themoviedb.org/3';

const headers = {
  'Authorization': `Bearer ${TMDB_API_KEY}`,
  'Content-Type': 'application/json',
};

// Error handling wrapper with retry logic
async function fetchWithRetry<T>(url: string, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (data === null || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      return data as T;
    } catch (error) {
      if (i === retries - 1) throw error;
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries exceeded');
}

export const tmdbApi = {
  searchMovies: async (query: string, page = 1): Promise<TMDBResponse<Movie>> => {
    const url = `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=zh-CN`;
    return fetchWithRetry<TMDBResponse<Movie>>(url);
  },

  getPopularMovies: async (page = 1): Promise<TMDBResponse<Movie>> => {
    const url = `${BASE_URL}/movie/popular?page=${page}&language=zh-CN`;
    return fetchWithRetry<TMDBResponse<Movie>>(url);
  },

  getMovieDetail: async (movieId: number): Promise<MovieDetail> => {
    const url = `${BASE_URL}/movie/${movieId}?language=zh-CN`;
    return fetchWithRetry<MovieDetail>(url);
  },

  getMovieCredits: async (movieId: number): Promise<{ cast: Cast[]; crew: Crew[] }> => {
    const url = `${BASE_URL}/movie/${movieId}/credits?language=zh-CN`;
    return fetchWithRetry<{ cast: Cast[]; crew: Crew[] }>(url);
  },

  getMovieVideos: async (movieId: number): Promise<{ results: Video[] }> => {
    const url = `${BASE_URL}/movie/${movieId}/videos?language=zh-CN`;
    return fetchWithRetry<{ results: Video[] }>(url);
  },

  getMovieReviews: async (movieId: number, page = 1): Promise<TMDBResponse<Review>> => {
    const url = `${BASE_URL}/movie/${movieId}/reviews?page=${page}&language=zh-CN`;
    return fetchWithRetry<TMDBResponse<Review>>(url);
  },

  getImageUrl: (path: string | null, size: 'w500' | 'original' = 'w500'): string => {
    if (!path) return '/placeholder.svg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },
};

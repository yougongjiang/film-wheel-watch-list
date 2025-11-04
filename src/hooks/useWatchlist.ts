import { useState, useEffect } from 'react';
import { Movie, WatchlistItem } from '@/types/movie';

const WATCHLIST_KEY = 'movie-watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWatchlist(parsed);
        }
      } catch (error) {
        console.error('Failed to parse watchlist:', error);
        localStorage.removeItem(WATCHLIST_KEY);
      }
    }
  }, []);

  const addToWatchlist = (movie: Movie) => {
    const newItem: WatchlistItem = {
      ...movie,
      addedAt: Date.now(),
    };
    const updated = [...watchlist, newItem];
    setWatchlist(updated);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  };

  const removeFromWatchlist = (movieId: number) => {
    const updated = watchlist.filter(item => item.id !== movieId);
    setWatchlist(updated);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some(item => item.id === movieId);
  };

  const sortWatchlist = (sortBy: 'title' | 'date' | 'rating') => {
    const sorted = [...watchlist].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title, 'zh-CN');
        case 'date':
          return b.addedAt - a.addedAt;
        case 'rating':
          return b.vote_average - a.vote_average;
        default:
          return 0;
      }
    });
    setWatchlist(sorted);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(sorted));
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    sortWatchlist,
  };
}

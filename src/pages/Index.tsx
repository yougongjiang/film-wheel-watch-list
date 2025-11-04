import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '@/services/tmdb';
import { Movie } from '@/types/movie';
import { SearchBar } from '@/components/SearchBar';
import { MovieCard } from '@/components/MovieCard';
import { Header } from '@/components/Header';
import { useWatchlist } from '@/hooks/useWatchlist';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { toast } = useToast();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['movies', searchQuery, page],
    queryFn: () => 
      searchQuery 
        ? tmdbApi.searchMovies(searchQuery, page)
        : tmdbApi.getPopularMovies(page),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setAllMovies(data.results);
      } else {
        setAllMovies(prev => [...prev, ...data.results]);
      }
    }
  }, [data, page]);

  useEffect(() => {
    setPage(1);
    setAllMovies([]);
  }, [searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleLoadMore = () => {
    if (data && page < data.total_pages) {
      setPage(prev => prev + 1);
    }
  };

  const handleToggleWatchlist = useCallback((movie: Movie) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
      toast({
        title: "已移除",
        description: `${movie.title} 已从待看清单中移除`,
      });
    } else {
      addToWatchlist(movie);
      toast({
        title: "已添加",
        description: `${movie.title} 已添加到待看清单`,
      });
    }
  }, [isInWatchlist, addToWatchlist, removeFromWatchlist, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-gold bg-clip-text text-transparent">
            {searchQuery ? '搜索结果' : '热门电影'}
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            {searchQuery ? `搜索 "${searchQuery}"` : '探索最新最热门的电影'}
          </p>
          
          <SearchBar onSearch={handleSearch} isLoading={isLoading && page === 1} />
        </div>

        {/* Error State */}
        {isError && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>加载失败: {error instanceof Error ? error.message : '未知错误'}</span>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                重试
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && page === 1 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">加载中...</p>
          </div>
        )}

        {/* Movies Grid */}
        {!isLoading && allMovies.length === 0 && searchQuery && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">未找到相关电影</p>
            <p className="text-sm text-muted-foreground mt-2">请尝试其他搜索词</p>
          </div>
        )}

        {allMovies.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {allMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInWatchlist={isInWatchlist(movie.id)}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              ))}
            </div>

            {/* Load More */}
            {data && page < data.total_pages && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  size="lg"
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      加载中...
                    </>
                  ) : (
                    '加载更多'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;

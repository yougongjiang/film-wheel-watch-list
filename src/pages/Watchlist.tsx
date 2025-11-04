import { useState } from 'react';
import { Header } from '@/components/Header';
import { MovieCard } from '@/components/MovieCard';
import { useWatchlist } from '@/hooks/useWatchlist';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bookmark, SortAsc } from 'lucide-react';

const Watchlist = () => {
  const { watchlist, removeFromWatchlist, isInWatchlist, sortWatchlist } = useWatchlist();
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'rating'>('date');

  const handleSort = (value: 'title' | 'date' | 'rating') => {
    setSortBy(value);
    sortWatchlist(value);
  };

  const handleToggleWatchlist = (movie: any) => {
    removeFromWatchlist(movie.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Bookmark className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">我的待看清单</h1>
          </div>
          
          {watchlist.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">排序方式:</span>
              </div>
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">添加时间</SelectItem>
                  <SelectItem value="title">标题</SelectItem>
                  <SelectItem value="rating">评分</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                共 {watchlist.length} 部电影
              </span>
            </div>
          )}
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">待看清单为空</h2>
            <p className="text-muted-foreground mb-6">
              开始添加您想观看的电影吧！
            </p>
            <Button onClick={() => window.location.href = '/'}>
              浏览电影
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {watchlist.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isInWatchlist={isInWatchlist(movie.id)}
                onToggleWatchlist={handleToggleWatchlist}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Watchlist;

import { Movie } from '@/types/movie';
import { tmdbApi } from '@/services/tmdb';
import { Card } from '@/components/ui/card';
import { Star, Calendar, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
}

export function MovieCard({ movie, isInWatchlist, onToggleWatchlist }: MovieCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatchlist(movie);
  };

  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-gold bg-card border-border"
      onClick={handleCardClick}
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={tmdbApi.getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Watchlist button */}
        <Button
          size="icon"
          variant={isInWatchlist ? "default" : "secondary"}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          onClick={handleWatchlistClick}
        >
          {isInWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 text-sm text-foreground mb-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 min-h-[3rem]">
          {movie.title}
        </h3>
      </div>
    </Card>
  );
}

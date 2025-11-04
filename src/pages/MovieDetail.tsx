import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '@/services/tmdb';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Clock, 
  Plus, 
  Check,
  Play,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const movieId = parseInt(id || '0');

  const { data: movie, isLoading: movieLoading, isError: movieError } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => tmdbApi.getMovieDetail(movieId),
    enabled: !!movieId,
  });

  const { data: credits } = useQuery({
    queryKey: ['credits', movieId],
    queryFn: () => tmdbApi.getMovieCredits(movieId),
    enabled: !!movieId,
  });

  const { data: videos } = useQuery({
    queryKey: ['videos', movieId],
    queryFn: () => tmdbApi.getMovieVideos(movieId),
    enabled: !!movieId,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', movieId],
    queryFn: () => tmdbApi.getMovieReviews(movieId),
    enabled: !!movieId,
  });

  const handleToggleWatchlist = () => {
    if (!movie) return;
    
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
  };

  const trailer = videos?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const director = credits?.crew.find(c => c.job === 'Director');

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              加载电影详情失败，请稍后重试
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        <div className="absolute inset-0">
          <img
            src={tmdbApi.getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        
        <div className="relative container px-4 h-full flex items-end pb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
        </div>
      </div>

      <div className="container px-4 -mt-32 relative z-10">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Poster */}
          <div className="hidden md:block">
            <Card className="overflow-hidden shadow-card">
              <img
                src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-full"
              />
            </Card>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-xl text-muted-foreground italic mb-6">"{movie.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="text-2xl font-bold">{movie.vote_average.toFixed(1)}</span>
                <span className="text-muted-foreground">({movie.vote_count} 评分)</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{movie.runtime} 分钟</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map(genre => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                onClick={handleToggleWatchlist}
                variant={isInWatchlist(movie.id) ? "default" : "outline"}
                className="gap-2"
              >
                {isInWatchlist(movie.id) ? (
                  <>
                    <Check className="h-5 w-5" />
                    已在清单
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    添加到待看
                  </>
                )}
              </Button>

              {trailer && (
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="gap-2"
                >
                  <a 
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play className="h-5 w-5" />
                    观看预告
                  </a>
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-3">剧情简介</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.overview || '暂无简介'}
                </p>
              </div>

              {director && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">导演</h3>
                  <p className="text-muted-foreground">{director.name}</p>
                </div>
              )}

              {credits && credits.cast.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">演员阵容</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {credits.cast.slice(0, 12).map(actor => (
                      <Card key={actor.id} className="overflow-hidden">
                        <img
                          src={tmdbApi.getImageUrl(actor.profile_path)}
                          alt={actor.name}
                          className="w-full aspect-[2/3] object-cover"
                        />
                        <div className="p-3">
                          <p className="font-semibold text-sm line-clamp-1">{actor.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {actor.character}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {reviews && reviews.results.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">用户评论</h2>
                  <div className="space-y-4">
                    {reviews.results.slice(0, 3).map(review => (
                      <Card key={review.id} className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-semibold">{review.author}</p>
                              {review.author_details.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-primary text-primary" />
                                  <span className="text-sm">{review.author_details.rating}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-muted-foreground line-clamp-3">
                              {review.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(review.created_at).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

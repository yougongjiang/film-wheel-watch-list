import { Film, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <Film className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 blur-lg bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              电影数据库
            </h1>
            <p className="text-xs text-muted-foreground">发现精彩电影</p>
          </div>
        </button>

        <nav className="flex items-center gap-2">
          <Button
            variant={location.pathname === '/' ? 'default' : 'ghost'}
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Film className="h-4 w-4" />
            <span className="hidden sm:inline">发现</span>
          </Button>
          <Button
            variant={location.pathname === '/watchlist' ? 'default' : 'ghost'}
            onClick={() => navigate('/watchlist')}
            className="gap-2"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">待看清单</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const searchIdRef = useRef(0);

  useEffect(() => {
    const currentSearchId = ++searchIdRef.current;
    
    if (debouncedQuery.trim()) {
      // Race condition handling: only execute if this is still the latest search
      Promise.resolve().then(() => {
        if (currentSearchId === searchIdRef.current) {
          onSearch(debouncedQuery);
        }
      });
    }
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="搜索电影..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-24 h-14 text-lg bg-card border-border focus:border-primary focus:ring-primary"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          )}
          {query && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleClear}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {query && query !== debouncedQuery && (
        <p className="text-sm text-muted-foreground mt-2 ml-1">
          正在输入...
        </p>
      )}
    </div>
  );
}

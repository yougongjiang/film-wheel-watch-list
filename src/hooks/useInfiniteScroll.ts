import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  threshold?: number; // Distance from bottom in pixels to trigger load
}

export function useInfiniteScroll({
  onLoadMore,
  isLoading,
  hasMore,
  threshold = 500
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      console.log('🔍 IntersectionObserver triggered:', {
        isIntersecting: target.isIntersecting,
        isLoading,
        hasMore,
        boundingClientRect: target.boundingClientRect,
        intersectionRatio: target.intersectionRatio
      });
      
      if (target.isIntersecting && !isLoading && hasMore) {
        console.log('✅ Loading more content...');
        onLoadMore();
      } else {
        console.log('❌ Not loading:', { isIntersecting: target.isIntersecting, isLoading, hasMore });
      }
    },
    [isLoading, hasMore, onLoadMore]
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: `0px 0px ${threshold}px 0px`,
      threshold: 0
    };

    console.log('🎯 Setting up IntersectionObserver with options:', options);
    observerRef.current = new IntersectionObserver(handleObserver, options);

    const currentSentinel = sentinelRef.current;
    
    if (currentSentinel) {
      console.log('📍 Observing sentinel element:', currentSentinel);
      observerRef.current.observe(currentSentinel);
    } else {
      console.warn('⚠️ Sentinel element not found!');
    }

    return () => {
      if (observerRef.current && currentSentinel) {
        observerRef.current.unobserve(currentSentinel);
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, threshold]);

  return sentinelRef;
}

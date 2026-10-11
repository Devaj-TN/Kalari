import { useMemo } from 'react';
import NEWS_DATA from '../data/news';
import type { NewsPost } from '../types';

// Future: swap to fetch('/api/news') in one line
export function useNews() {
  const news = useMemo(
    () => [...NEWS_DATA].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    []
  );
  return { news };
}

export function useNewsBySlug(slug: string): NewsPost | undefined {
  return NEWS_DATA.find((n) => n.slug === slug);
}

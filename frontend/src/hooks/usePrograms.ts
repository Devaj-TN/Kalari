import { useMemo } from 'react';
import PROGRAMS_DATA from '../data/programs';
import type { Program } from '../types';

// Future: swap this hook to fetch from Laravel API with one-line change
// e.g.: const { data } = useSWR<Program[]>('/api/programs', fetcher);

export function usePrograms() {
  const programs = useMemo(() => PROGRAMS_DATA, []);
  const featured = useMemo(() => programs.filter((p) => p.featured), [programs]);
  return { programs, featured };
}

export function useProgramBySlug(slug: string): Program | undefined {
  return PROGRAMS_DATA.find((p) => p.slug === slug);
}

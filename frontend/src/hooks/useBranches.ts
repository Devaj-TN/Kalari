import { useMemo } from 'react';
import BRANCHES_DATA from '../data/branches';

// Future: swap to fetch('/api/branches') in one line
export function useBranches() {
  const branches = useMemo(() => BRANCHES_DATA, []);
  const primary = useMemo(() => branches.find((b) => b.isPrimary), [branches]);
  return { branches, primary };
}

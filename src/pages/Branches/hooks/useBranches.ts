import { useCallback, useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getBranches } from '@/services/branches/branches.service';
import type { PaginatedResponse } from '@/common/types/common';
import type { Branch } from '@/services/branches/types';

const EMPTY_PAGE: PaginatedResponse<Branch> = { current_page: 1, data: [], last_page: 1, total: 0 };

/**
 * Loads one page of the All Branches list (admin oversight view) and
 * exposes paging controls.
 *
 * @returns {{ branches: Branch[]; page: number; lastPage: number; total: number; loading: boolean; error: string | null; setPage: (page: number) => void; refetch: () => void }}
 *   The current page's branches, paging state, and a setter to change page.
 */
export function useBranches() {
  const [page, setPage] = useState(1);
  const fetcher = useCallback(() => getBranches(page), [page]);
  const { data, loading, error, refetch } = useAsync(fetcher, EMPTY_PAGE);

  return {
    branches: data.data,
    page: data.current_page,
    lastPage: data.last_page,
    total: data.total,
    loading,
    error,
    setPage,
    refetch,
  };
}

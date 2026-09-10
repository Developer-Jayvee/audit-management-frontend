import { useCallback, useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getStores } from '@/services/stores/stores.service';
import type { PaginatedResponse } from '@/common/types/common';
import type { Store } from '@/services/stores/types';

const EMPTY_PAGE: PaginatedResponse<Store> = { current_page: 1, data: [], last_page: 1, total: 0 };

/**
 * Loads one page of the All Stores list (admin oversight view, across every
 * client) and exposes paging controls.
 *
 * @returns {{ stores: Store[]; page: number; lastPage: number; total: number; loading: boolean; error: string | null; setPage: (page: number) => void; refetch: () => void }}
 *   The current page's stores, paging state, and a setter to change page.
 */
export function useStores() {
  const [page, setPage] = useState(1);
  const fetcher = useCallback(() => getStores(page), [page]);
  const { data, loading, error, refetch } = useAsync(fetcher, EMPTY_PAGE);

  return {
    stores: data.data,
    page: data.current_page,
    lastPage: data.last_page,
    total: data.total,
    loading,
    error,
    setPage,
    refetch,
  };
}

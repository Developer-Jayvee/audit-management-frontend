import { useCallback, useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getAssets } from '@/services/assets/assets.service';
import type { PaginatedResponse } from '@/common/types/common';
import type { Asset } from '@/services/assets/types';

const EMPTY_PAGE: PaginatedResponse<Asset> = { current_page: 1, data: [], last_page: 1, total: 0 };

/**
 * Loads one page of the per-store asset register (Asset Management → All
 * Assets) and exposes paging controls.
 *
 * @returns {{ assets: Asset[]; page: number; lastPage: number; total: number; loading: boolean; error: string | null; setPage: (page: number) => void; refetch: () => void }}
 *   The current page's assets, paging state, and a setter to change page.
 */
export function useAssets() {
  const [page, setPage] = useState(1);
  const fetcher = useCallback(() => getAssets(page), [page]);
  const { data, loading, error, refetch } = useAsync(fetcher, EMPTY_PAGE);

  return {
    assets: data.data,
    page: data.current_page,
    lastPage: data.last_page,
    total: data.total,
    loading,
    error,
    setPage,
    refetch,
  };
}

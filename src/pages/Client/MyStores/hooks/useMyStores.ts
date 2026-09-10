import { useCallback, useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getStores } from '@/services/stores/stores.service';
import type { PaginatedResponse } from '@/common/types/common';
import type { Store } from '@/services/stores/types';

const EMPTY_PAGE: PaginatedResponse<Store> = { current_page: 1, data: [], last_page: 1, total: 0 };

/**
 * Loads one page of the authenticated Client's own stores and exposes
 * paging controls. Calls the same `/stores` endpoint as the admin
 * oversight view (`pages/Stores/hooks/useStores.ts`) — the backend scopes
 * the result to the caller's own organization when the authenticated
 * account is a Client (Phase 3.1, per `backend-security`), so no
 * client-side filtering is needed here.
 *
 * @returns {{ stores: Store[]; page: number; lastPage: number; total: number; loading: boolean; error: string | null; setPage: (page: number) => void; refetch: () => void }}
 *   The current page's own stores, paging state, and a setter to change page.
 */
export function useMyStores() {
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

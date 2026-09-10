import { useCallback, useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getClients } from '@/services/clients/clients.service';
import type { PaginatedResponse } from '@/common/types/common';
import type { Client } from '@/services/clients/types';

const EMPTY_PAGE: PaginatedResponse<Client> = { current_page: 1, data: [], last_page: 1, total: 0 };

/**
 * Loads one page of the All Clients list and exposes paging controls.
 *
 * @returns {{ clients: Client[]; page: number; lastPage: number; total: number; loading: boolean; error: string | null; setPage: (page: number) => void; refetch: () => void }}
 *   The current page's client organizations, paging state, and a setter to change page.
 */
export function useClients() {
  const [page, setPage] = useState(1);
  const fetcher = useCallback(() => getClients(page), [page]);
  const { data, loading, error, refetch } = useAsync(fetcher, EMPTY_PAGE);

  return {
    clients: data.data,
    page: data.current_page,
    lastPage: data.last_page,
    total: data.total,
    loading,
    error,
    setPage,
    refetch,
  };
}

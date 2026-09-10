import { useCallback, useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getTickets } from '@/services/tickets/tickets.service';
import type { Ticket } from '@/services/tickets/types';
import type { PaginatedResponse } from '@/common/types/common';

const EMPTY_PAGE: PaginatedResponse<Ticket> = { current_page: 1, data: [], last_page: 1, total: 0 };

/**
 * Loads one page of tickets — every audit request reduced to its current
 * lifecycle status, for the Tickets view.
 *
 * @returns {{ tickets: Ticket[]; page: number; lastPage: number; total: number; loading: boolean; error: string | null; setPage: (page: number) => void; refetch: () => void }}
 *   The current page's tickets, paging state, and a setter to change page.
 */
export function useTickets() {
  const [page, setPage] = useState(1);
  const fetcher = useCallback(() => getTickets(page), [page]);
  const { data, loading, error, refetch } = useAsync(fetcher, EMPTY_PAGE);

  return {
    tickets: data.data,
    page: data.current_page,
    lastPage: data.last_page,
    total: data.total,
    loading,
    error,
    setPage,
    refetch,
  };
}

import { useCallback, useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getUsers } from '@/services/users/users.service';
import type { PaginatedResponse } from '@/common/types/common';
import type { User } from '@/services/users/types';

const EMPTY_PAGE: PaginatedResponse<User> = { current_page: 1, data: [], last_page: 1, total: 0 };

/**
 * Loads one page of the User Management list and exposes paging controls —
 * the admin account list isn't bounded to a single page of results, so a
 * page beyond the first must stay reachable from the UI.
 *
 * @returns {{ users: User[]; page: number; lastPage: number; total: number; loading: boolean; error: string | null; setPage: (page: number) => void; refetch: () => void }}
 *   The current page's accounts, paging state, and a setter to change page.
 */
export function useUsers() {
  const [page, setPage] = useState(1);
  const fetcher = useCallback(() => getUsers(page), [page]);
  const { data, loading, error, refetch } = useAsync(fetcher, EMPTY_PAGE);

  return {
    users: data.data,
    page: data.current_page,
    lastPage: data.last_page,
    total: data.total,
    loading,
    error,
    setPage,
    refetch,
  };
}

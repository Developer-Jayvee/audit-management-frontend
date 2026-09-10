import { useCallback, useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getAuditRequests } from '@/services/auditRequests/auditRequests.service';
import type { AuditRequest, AuditRequestStatus } from '@/services/auditRequests/types';
import type { PaginatedResponse } from '@/common/types/common';

const EMPTY_PAGE: PaginatedResponse<AuditRequest> = { current_page: 1, data: [], last_page: 1, total: 0 };

/**
 * Loads one page of audit requests for the Audit Requests review queue,
 * optionally filtered to one status.
 *
 * @param status - {AuditRequestStatus} Optional status filter (e.g. `'open'` for the pending-review queue).
 * @returns {{ auditRequests: AuditRequest[]; page: number; lastPage: number; total: number; loading: boolean; error: string | null; setPage: (page: number) => void; refetch: () => void }}
 *   The current page's requests, paging state, and a setter to change page.
 */
export function useAuditRequests(status?: AuditRequestStatus) {
  const [page, setPage] = useState(1);
  const fetcher = useCallback(() => getAuditRequests(page, 10, status), [page, status]);
  const { data, loading, error, refetch } = useAsync(fetcher, EMPTY_PAGE);

  return {
    auditRequests: data.data,
    page: data.current_page,
    lastPage: data.last_page,
    total: data.total,
    loading,
    error,
    setPage,
    refetch,
  };
}

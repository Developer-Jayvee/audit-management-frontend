import { useCallback, useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getFindings } from '@/services/findings/findings.service';
import type { AuditFinding } from '@/services/findings/types';
import type { PaginatedResponse } from '@/common/types/common';

const EMPTY_PAGE: PaginatedResponse<AuditFinding> = { current_page: 1, data: [], last_page: 1, total: 0 };

/**
 * Loads one page of findings submissions for the Findings Review queue.
 *
 * @returns {{ findings: AuditFinding[]; page: number; lastPage: number; total: number; loading: boolean; error: string | null; setPage: (page: number) => void; refetch: () => void }}
 *   The current page's submissions, paging state, and a setter to change page.
 */
export function useFindings() {
  const [page, setPage] = useState(1);
  const fetcher = useCallback(() => getFindings(page), [page]);
  const { data, loading, error, refetch } = useAsync(fetcher, EMPTY_PAGE);

  return {
    findings: data.data,
    page: data.current_page,
    lastPage: data.last_page,
    total: data.total,
    loading,
    error,
    setPage,
    refetch,
  };
}

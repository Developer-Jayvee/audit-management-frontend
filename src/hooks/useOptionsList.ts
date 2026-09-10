import { useCallback } from 'react';
import { useAsync } from './useAsync';
import type { PaginatedResponse } from '@/common/types/common';

// A stable module-level reference (not recreated per render) — useAsync
// re-runs its fetch whenever this identity changes, so a fresh object
// literal per render would cause an infinite refetch loop.
const EMPTY_OPTIONS_PAGE: PaginatedResponse<unknown> = { current_page: 1, data: [], last_page: 1, total: 0 };

/**
 * Loads a single, bounded page of a resource to source a form `<select>`'s
 * options. There's no "list all"/search endpoint on the backend yet (every
 * list endpoint is a fixed-page-size `LengthAwarePaginator`), so this is a
 * deliberately capped stand-in until one exists — fine at the admin
 * console's current scale, not meant to scale to thousands of records.
 *
 * @param fetchPage - {(page: number, perPage: number) => Promise<PaginatedResponse<T>>} The domain's paginated list function (e.g. `getClients`).
 * @param perPage - {number} How many records to fetch for the option list. Defaults to 100.
 * @returns {{ options: T[]; loading: boolean; error: string | null }} The fetched records and load state.
 */
export function useOptionsList<T>(
  fetchPage: (page: number, perPage: number) => Promise<PaginatedResponse<T>>,
  perPage = 100
) {
  const fetcher = useCallback(() => fetchPage(1, perPage), [fetchPage, perPage]);
  const { data, loading, error } = useAsync(fetcher, EMPTY_OPTIONS_PAGE as PaginatedResponse<T>);

  return { options: data.data, loading, error };
}

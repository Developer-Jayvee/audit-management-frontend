import { useCallback, useEffect, useState } from 'react';

interface UseAsyncState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>(fetcher: () => Promise<T>, initialValue: T) {
  const [state, setState] = useState<UseAsyncState<T>>({ data: initialValue, loading: true, error: null });

  const load = useCallback(async () => {
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null });
    } catch {
      setState({ data: initialValue, loading: false, error: 'Failed to load data. Please try again.' });
    }
  }, [fetcher, initialValue]);

  useEffect(() => {
    // No fetching library (react-query/swr) installed; manual fetch-on-mount is intentional here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const refetch = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    load();
  }, [load]);

  return { ...state, refetch };
}

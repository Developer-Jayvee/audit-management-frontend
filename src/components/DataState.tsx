import type { ReactNode } from 'react';

interface DataStateProps {
  loading: boolean;
  error: string | null;
  empty: boolean;
  emptyLabel?: string;
  children: ReactNode;
}

export function DataState({ loading, error, empty, emptyLabel = 'No records yet.', children }: DataStateProps) {
  if (loading) {
    return (
      <div className="col-span-full flex items-center justify-center gap-2 px-5 py-10 text-sm text-atlas-ink/55">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-atlas-ink/25 border-t-atlas-ink/60" />
        Loading…
      </div>
    );
  }

  if (error) {
    return <div className="col-span-full px-5 py-10 text-center text-sm text-atlas-negative">{error}</div>;
  }

  if (empty) {
    return <div className="col-span-full px-5 py-10 text-center text-sm text-atlas-ink/55">{emptyLabel}</div>;
  }

  return <>{children}</>;
}

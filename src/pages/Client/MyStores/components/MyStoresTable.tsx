import { DataState } from '@/components/DataState';
import { StatusBadge } from '@/components/StatusBadge';
import type { Store } from '@/services/stores/types';

interface MyStoresTableProps {
  stores: Store[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onEdit: (store: Store) => void;
}

const COLUMNS = 'grid-cols-[1.6fr_1fr_1fr_0.8fr_0.8fr]';

/**
 * Table of the authenticated Client's own stores. No Client ID column
 * (every row here already belongs to the viewer's own organization) and no
 * deactivate action — deleting/deactivating a store isn't part of the
 * Phase 3.1 Client checklist, unlike the admin oversight view's table.
 *
 * @param props - {MyStoresTableProps} The stores to render, load state, paging, and the edit handler.
 * @returns {JSX.Element} The rendered table.
 */
export function MyStoresTable({ stores, loading, error, page, lastPage, onPageChange, onEdit }: MyStoresTableProps) {
  return (
    <section className="border border-atlas-ink/14">
      <div
        className={`grid ${COLUMNS} gap-3 border-b border-atlas-ink/14 px-5 py-[9px] font-mono text-[10px] tracking-[0.1em] text-atlas-ink/50 uppercase`}
      >
        <span>Name</span>
        <span>Branch ID</span>
        <span>Contact No.</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <DataState loading={loading} error={error} empty={stores.length === 0} emptyLabel="No stores yet.">
        {stores.map((store) => (
          <div
            key={store.id}
            className={`grid ${COLUMNS} items-center gap-3 border-b border-atlas-ink/8 px-5 py-3 text-[13.5px] last:border-b-0`}
          >
            <span className="truncate">{store.name}</span>
            <span className="truncate">{store.branch_id ?? '—'}</span>
            <span className="truncate">{store.contact_no ?? '—'}</span>
            <StatusBadge status={store.is_active ? 'Active' : 'Inactive'} />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onEdit(store)}
                className="cursor-pointer border-0 bg-transparent p-0 font-condensed text-[12.5px] font-semibold tracking-[0.06em] text-atlas-blue-text uppercase hover:text-atlas-navy"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </DataState>

      {!loading && !error && lastPage > 1 && (
        <div className="flex items-center justify-between border-t border-atlas-ink/14 px-5 py-3 text-[12.5px] text-atlas-ink/60">
          <span>
            Page {page} of {lastPage}
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="cursor-pointer border-0 bg-transparent p-0 font-condensed text-[12.5px] font-semibold tracking-[0.06em] text-atlas-blue-text uppercase hover:text-atlas-navy disabled:cursor-not-allowed disabled:text-atlas-ink/30"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page >= lastPage}
              onClick={() => onPageChange(page + 1)}
              className="cursor-pointer border-0 bg-transparent p-0 font-condensed text-[12.5px] font-semibold tracking-[0.06em] text-atlas-blue-text uppercase hover:text-atlas-navy disabled:cursor-not-allowed disabled:text-atlas-ink/30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

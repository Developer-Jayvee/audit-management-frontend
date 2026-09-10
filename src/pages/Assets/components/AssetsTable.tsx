import { DataState } from '@/components/DataState';
import { StatusBadge } from '@/components/StatusBadge';
import type { Asset } from '@/services/assets/types';

interface AssetsTableProps {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onEdit: (asset: Asset) => void;
  onToggleActive: (asset: Asset) => void;
}

const COLUMNS = 'grid-cols-[1.4fr_1fr_1fr_0.8fr_1fr]';

export function AssetsTable({
  assets,
  loading,
  error,
  page,
  lastPage,
  onPageChange,
  onEdit,
  onToggleActive,
}: AssetsTableProps) {
  return (
    <section className="border border-atlas-ink/14">
      <div
        className={`grid ${COLUMNS} gap-3 border-b border-atlas-ink/14 px-5 py-[9px] font-mono text-[10px] tracking-[0.1em] text-atlas-ink/50 uppercase`}
      >
        <span>Name</span>
        <span>Client ID</span>
        <span>Store ID</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <DataState loading={loading} error={error} empty={assets.length === 0} emptyLabel="No assets found.">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className={`grid ${COLUMNS} items-center gap-3 border-b border-atlas-ink/8 px-5 py-3 text-[13.5px] last:border-b-0`}
          >
            <span className="truncate">{asset.name}</span>
            <span className="truncate">{asset.client_id ?? '—'}</span>
            <span className="truncate">{asset.store_id ?? '—'}</span>
            <StatusBadge status={asset.is_active ? 'Active' : 'Inactive'} />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onEdit(asset)}
                className="cursor-pointer border-0 bg-transparent p-0 font-condensed text-[12.5px] font-semibold tracking-[0.06em] text-atlas-blue-text uppercase hover:text-atlas-navy"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onToggleActive(asset)}
                className="cursor-pointer border-0 bg-transparent p-0 font-condensed text-[12.5px] font-semibold tracking-[0.06em] text-atlas-negative uppercase hover:text-atlas-negative/80"
              >
                {asset.is_active ? 'Retire' : 'Reactivate'}
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

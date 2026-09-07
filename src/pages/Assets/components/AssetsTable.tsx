import { DataState } from '@/components/DataState';
import { StatusBadge } from '@/components/StatusBadge';
import type { Asset } from '@/services/assets/types';

interface AssetsTableProps {
  assets: Asset[];
  loading: boolean;
  error: string | null;
}

const COLUMNS = 'grid-cols-[0.9fr_1.6fr_1.1fr_1.1fr_0.8fr]';

export function AssetsTable({ assets, loading, error }: AssetsTableProps) {
  return (
    <section className="border border-atlas-ink/14">
      <div
        className={`grid ${COLUMNS} gap-3 border-b border-atlas-ink/14 px-5 py-[9px] font-mono text-[10px] tracking-[0.1em] text-atlas-ink/50 uppercase`}
      >
        <span>Tag</span>
        <span>Description</span>
        <span>Client</span>
        <span>Branch</span>
        <span>Status</span>
      </div>
      <DataState loading={loading} error={error} empty={assets.length === 0} emptyLabel="No assets found.">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className={`grid ${COLUMNS} items-center gap-3 border-b border-atlas-ink/8 px-5 py-3 text-[13.5px] last:border-b-0`}
          >
            <span className="font-mono text-[12.5px]">{asset.tag}</span>
            <span className="truncate">{asset.description}</span>
            <span className="truncate">{asset.client}</span>
            <span className="truncate">{asset.branch}</span>
            <StatusBadge status={asset.status} />
          </div>
        ))}
      </DataState>
    </section>
  );
}

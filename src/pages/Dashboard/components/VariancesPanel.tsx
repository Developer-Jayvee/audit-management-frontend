import { DataState } from '@/components/DataState';
import { StatusBadge } from '@/components/StatusBadge';
import type { VarianceRow } from '@/services/dashboard/types';

interface VariancesPanelProps {
  rows: VarianceRow[];
  loading: boolean;
  error: string | null;
}

const COLUMNS = 'grid-cols-[1.1fr_1.4fr_0.8fr_0.9fr]';

function isNegativeDelta(delta: string) {
  return delta.trim().replace('−', '-').startsWith('-');
}

export function VariancesPanel({ rows, loading, error }: VariancesPanelProps) {
  return (
    <section className="border border-atlas-ink/14">
      <div className="flex items-center justify-between border-b border-atlas-ink/14 px-5 py-3.5">
        <h2 className="m-0 font-condensed text-[17px] font-semibold">Open variances</h2>
      </div>
      <div
        className={`grid ${COLUMNS} gap-3 border-b border-atlas-ink/14 px-5 py-[9px] font-mono text-[10px] tracking-[0.1em] text-atlas-ink/50 uppercase`}
      >
        <span>Asset</span>
        <span>Branch</span>
        <span>Delta</span>
        <span>Status</span>
      </div>
      <DataState loading={loading} error={error} empty={rows.length === 0} emptyLabel="No open variances.">
        {rows.map((row) => (
          <div
            key={row.id}
            className={`grid ${COLUMNS} items-center gap-3 border-b border-atlas-ink/8 px-5 py-3 text-[13.5px] last:border-b-0`}
          >
            <span className="font-mono text-[12.5px]">{row.asset}</span>
            <span className="truncate">{row.branch}</span>
            <span className={`font-mono text-[12.5px] ${isNegativeDelta(row.delta) ? 'text-atlas-negative' : 'text-atlas-positive'}`}>
              {row.delta}
            </span>
            <StatusBadge status={row.status} />
          </div>
        ))}
      </DataState>
    </section>
  );
}

import { DataState } from '@/components/DataState';
import type { ProgressRow } from '@/services/dashboard/types';

interface ProgressPanelProps {
  rows: ProgressRow[];
  loading: boolean;
  error: string | null;
}

export function ProgressPanel({ rows, loading, error }: ProgressPanelProps) {
  return (
    <section className="border border-atlas-ink/14 px-5 py-[18px]">
      <h2 className="m-0 mb-4 font-condensed text-[17px] font-semibold">Count progress</h2>
      <div className="flex flex-col gap-3.5">
        <DataState loading={loading} error={error} empty={rows.length === 0} emptyLabel="No active counts.">
          {rows.map((row) => (
            <div key={row.id} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[13px]">
                <span>{row.label}</span>
                <span className="font-mono text-[12px] text-atlas-ink/60">{row.text}</span>
              </div>
              <div className="h-1.5 bg-atlas-ink/12">
                <div className="h-full bg-atlas-blue" style={{ width: `${row.pct}%` }} />
              </div>
            </div>
          ))}
        </DataState>
      </div>
    </section>
  );
}

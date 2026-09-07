import { DataState } from '@/components/DataState';
import { StatusBadge } from '@/components/StatusBadge';
import type { AssetAssignment } from '@/services/assetAssignment/types';

interface AssignmentsTableProps {
  assignments: AssetAssignment[];
  loading: boolean;
  error: string | null;
}

const COLUMNS = 'grid-cols-[0.9fr_1.3fr_1.3fr_0.9fr_0.8fr]';

export function AssignmentsTable({ assignments, loading, error }: AssignmentsTableProps) {
  return (
    <section className="border border-atlas-ink/14">
      <div
        className={`grid ${COLUMNS} gap-3 border-b border-atlas-ink/14 px-5 py-[9px] font-mono text-[10px] tracking-[0.1em] text-atlas-ink/50 uppercase`}
      >
        <span>Asset</span>
        <span>Assigned to</span>
        <span>Branch</span>
        <span>Since</span>
        <span>Status</span>
      </div>
      <DataState loading={loading} error={error} empty={assignments.length === 0} emptyLabel="No assignments found.">
        {assignments.map((row) => (
          <div
            key={row.id}
            className={`grid ${COLUMNS} items-center gap-3 border-b border-atlas-ink/8 px-5 py-3 text-[13.5px] last:border-b-0`}
          >
            <span className="font-mono text-[12.5px]">{row.tag}</span>
            <span className="truncate">{row.assignedTo}</span>
            <span className="truncate">{row.branch}</span>
            <span className="font-mono text-[12px] text-atlas-ink/60">{row.since}</span>
            <StatusBadge status={row.status} />
          </div>
        ))}
      </DataState>
    </section>
  );
}

import { DataState } from '@/components/DataState';
import { StatusBadge } from '@/components/StatusBadge';
import type { AuditFinding } from '@/services/findings/types';

interface FindingsTableProps {
  findings: AuditFinding[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onPass: (finding: AuditFinding) => void;
  onReschedule: (finding: AuditFinding) => void;
}

const COLUMNS = 'grid-cols-[1fr_1.2fr_1fr_1.6fr_1fr_1fr]';

/**
 * The Findings Review queue table — a submission still awaiting a
 * decision (`decision: null`) gets Pass/Reschedule actions; a decided row
 * shows its outcome read-only, since a decision is append-only (per
 * `backend-security`) and can't be changed here.
 *
 * @param props - {FindingsTableProps} The current page of submissions, paging state, and decision handlers.
 * @returns {JSX.Element} The rendered table.
 */
export function FindingsTable({
  findings,
  loading,
  error,
  page,
  lastPage,
  onPageChange,
  onPass,
  onReschedule,
}: FindingsTableProps) {
  return (
    <section className="border border-atlas-ink/14">
      <div
        className={`grid ${COLUMNS} gap-3 border-b border-atlas-ink/14 px-5 py-[9px] font-mono text-[10px] tracking-[0.1em] text-atlas-ink/50 uppercase`}
      >
        <span>Request</span>
        <span>Client</span>
        <span>Field Engineer</span>
        <span>Remarks</span>
        <span>Decision</span>
        <span>Actions</span>
      </div>
      <DataState loading={loading} error={error} empty={findings.length === 0} emptyLabel="No findings submitted yet.">
        {findings.map((finding) => {
          const engineerUser = finding.audit?.field_engineer?.user;
          const pending = finding.decision === null;

          return (
            <div
              key={finding.id}
              className={`grid ${COLUMNS} items-center gap-3 border-b border-atlas-ink/8 px-5 py-3 text-[13.5px] last:border-b-0`}
            >
              <span className="truncate">{finding.audit?.audit_request?.code ?? '—'}</span>
              <span className="truncate">{finding.audit?.audit_request?.client?.name ?? '—'}</span>
              <span className="truncate">
                {engineerUser ? `${engineerUser.first_name} ${engineerUser.last_name}` : '—'}
              </span>
              <span className="truncate" title={finding.remarks ?? undefined}>
                {finding.remarks || '—'}
              </span>
              {pending ? (
                <span className="text-atlas-ink/40">Awaiting review</span>
              ) : (
                <StatusBadge status={finding.decision as string} />
              )}
              <div className="flex gap-3">
                {pending ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onPass(finding)}
                      className="cursor-pointer border-0 bg-transparent p-0 font-condensed text-[12.5px] font-semibold tracking-[0.06em] text-atlas-blue-text uppercase hover:text-atlas-navy"
                    >
                      Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => onReschedule(finding)}
                      className="cursor-pointer border-0 bg-transparent p-0 font-condensed text-[12.5px] font-semibold tracking-[0.06em] text-atlas-negative uppercase hover:text-atlas-negative/80"
                    >
                      Reschedule
                    </button>
                  </>
                ) : (
                  <span className="text-atlas-ink/40">—</span>
                )}
              </div>
            </div>
          );
        })}
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

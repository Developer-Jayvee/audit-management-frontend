import { DataState } from '@/components/DataState';
import { StatusBadge } from '@/components/StatusBadge';
import type { AuditRequest } from '@/services/auditRequests/types';

interface FieldAuditsTableProps {
  auditRequests: AuditRequest[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onAssign: (auditRequest: AuditRequest) => void;
}

const COLUMNS = 'grid-cols-[1fr_1.2fr_1fr_1.3fr_1fr_0.8fr]';

/**
 * Field Audits queue — every approved audit request, whether a field
 * engineer has been dispatched yet or not. An unassigned request gets an
 * "Assign" action; an assigned one shows the engineer and the visit's
 * current status (Assigned/In Progress/Under Review/Passed/Rescheduled)
 * read-only — the visit itself is only ever advanced by the field engineer
 * (mobile, Phase 4) or the Findings Review decision.
 *
 * @param props - {FieldAuditsTableProps} The current page of approved requests, paging state, and the assign handler.
 * @returns {JSX.Element} The rendered table.
 */
export function FieldAuditsTable({
  auditRequests,
  loading,
  error,
  page,
  lastPage,
  onPageChange,
  onAssign,
}: FieldAuditsTableProps) {
  return (
    <section className="border border-atlas-ink/14">
      <div
        className={`grid ${COLUMNS} gap-3 border-b border-atlas-ink/14 px-5 py-[9px] font-mono text-[10px] tracking-[0.1em] text-atlas-ink/50 uppercase`}
      >
        <span>Code</span>
        <span>Client</span>
        <span>Store</span>
        <span>Field Engineer</span>
        <span>Visit Status</span>
        <span>Actions</span>
      </div>
      <DataState loading={loading} error={error} empty={auditRequests.length === 0} emptyLabel="No approved requests yet.">
        {auditRequests.map((auditRequest) => {
          const engineerUser = auditRequest.latest_audit?.field_engineer?.user;

          return (
            <div
              key={auditRequest.id}
              className={`grid ${COLUMNS} items-center gap-3 border-b border-atlas-ink/8 px-5 py-3 text-[13.5px] last:border-b-0`}
            >
              <span className="truncate">{auditRequest.code}</span>
              <span className="truncate">{auditRequest.client?.name ?? `#${auditRequest.client_id}`}</span>
              <span className="truncate">{auditRequest.store?.name ?? '—'}</span>
              <span className="truncate">
                {engineerUser ? `${engineerUser.first_name} ${engineerUser.last_name}` : '—'}
              </span>
              {auditRequest.latest_audit ? (
                <StatusBadge status={auditRequest.latest_audit.status} />
              ) : (
                <span className="text-atlas-ink/40">Unassigned</span>
              )}
              <div className="flex gap-3">
                {auditRequest.latest_audit ? (
                  <span className="text-atlas-ink/40">—</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAssign(auditRequest)}
                    className="cursor-pointer border-0 bg-transparent p-0 font-condensed text-[12.5px] font-semibold tracking-[0.06em] text-atlas-blue-text uppercase hover:text-atlas-navy"
                  >
                    Assign
                  </button>
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

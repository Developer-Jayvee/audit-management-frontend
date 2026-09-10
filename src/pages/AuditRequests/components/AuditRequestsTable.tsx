import { DataState } from '@/components/DataState';
import { StatusBadge } from '@/components/StatusBadge';
import type { AuditRequest } from '@/services/auditRequests/types';

interface AuditRequestsTableProps {
  auditRequests: AuditRequest[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onApprove: (auditRequest: AuditRequest) => void;
  onDecline: (auditRequest: AuditRequest) => void;
}

const COLUMNS = 'grid-cols-[1fr_1.2fr_1fr_1.2fr_0.9fr_1fr]';

/**
 * The Audit Requests review queue table — approve/decline actions only
 * show on a request still awaiting a decision ("Requested"/`open`); once
 * decided, the row becomes read-only history.
 *
 * @param props - {AuditRequestsTableProps} The current page of requests, paging state, and decision handlers.
 * @returns {JSX.Element} The rendered table.
 */
export function AuditRequestsTable({
  auditRequests,
  loading,
  error,
  page,
  lastPage,
  onPageChange,
  onApprove,
  onDecline,
}: AuditRequestsTableProps) {
  return (
    <section className="border border-atlas-ink/14">
      <div
        className={`grid ${COLUMNS} gap-3 border-b border-atlas-ink/14 px-5 py-[9px] font-mono text-[10px] tracking-[0.1em] text-atlas-ink/50 uppercase`}
      >
        <span>Code</span>
        <span>Client</span>
        <span>Store</span>
        <span>Request Type</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <DataState loading={loading} error={error} empty={auditRequests.length === 0} emptyLabel="No audit requests found.">
        {auditRequests.map((auditRequest) => (
          <div
            key={auditRequest.id}
            className={`grid ${COLUMNS} items-center gap-3 border-b border-atlas-ink/8 px-5 py-3 text-[13.5px] last:border-b-0`}
          >
            <span className="truncate">{auditRequest.code}</span>
            <span className="truncate">{auditRequest.client?.name ?? `#${auditRequest.client_id}`}</span>
            <span className="truncate">{auditRequest.store?.name ?? '—'}</span>
            <span className="truncate">{auditRequest.request_type}</span>
            <StatusBadge status={auditRequest.status} />
            <div className="flex gap-3">
              {auditRequest.status === 'open' ? (
                <>
                  <button
                    type="button"
                    onClick={() => onApprove(auditRequest)}
                    className="cursor-pointer border-0 bg-transparent p-0 font-condensed text-[12.5px] font-semibold tracking-[0.06em] text-atlas-blue-text uppercase hover:text-atlas-navy"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onDecline(auditRequest)}
                    className="cursor-pointer border-0 bg-transparent p-0 font-condensed text-[12.5px] font-semibold tracking-[0.06em] text-atlas-negative uppercase hover:text-atlas-negative/80"
                  >
                    Decline
                  </button>
                </>
              ) : (
                <span className="text-atlas-ink/40">—</span>
              )}
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

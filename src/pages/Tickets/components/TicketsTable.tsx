import { DataState } from '@/components/DataState';
import { StatusBadge } from '@/components/StatusBadge';
import type { Ticket } from '@/services/tickets/types';

interface TicketsTableProps {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onViewHistory: (ticket: Ticket) => void;
}

const COLUMNS = 'grid-cols-[1fr_1.2fr_1fr_1.2fr_1fr_0.8fr]';

/**
 * Read-only Tickets view — every audit request reduced to its current
 * lifecycle status (Requested → Assigned → In Progress → Under Review →
 * Passed/Rescheduled). Every mutation lives on the Audit Requests, Field
 * Audits, and Findings Review screens; "View History" opens the full trail
 * for one ticket.
 *
 * @param props - {TicketsTableProps} The current page of tickets, paging state, and the history handler.
 * @returns {JSX.Element} The rendered table.
 */
export function TicketsTable({ tickets, loading, error, page, lastPage, onPageChange, onViewHistory }: TicketsTableProps) {
  return (
    <section className="border border-atlas-ink/14">
      <div
        className={`grid ${COLUMNS} gap-3 border-b border-atlas-ink/14 px-5 py-[9px] font-mono text-[10px] tracking-[0.1em] text-atlas-ink/50 uppercase`}
      >
        <span>Code</span>
        <span>Client</span>
        <span>Store</span>
        <span>Field Engineer</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <DataState loading={loading} error={error} empty={tickets.length === 0} emptyLabel="No tickets yet.">
        {tickets.map((ticket) => {
          const engineerUser = ticket.field_engineer?.user;

          return (
            <div
              key={ticket.id}
              className={`grid ${COLUMNS} items-center gap-3 border-b border-atlas-ink/8 px-5 py-3 text-[13.5px] last:border-b-0`}
            >
              <span className="truncate">{ticket.code}</span>
              <span className="truncate">{ticket.client?.name ?? '—'}</span>
              <span className="truncate">{ticket.store?.name ?? '—'}</span>
              <span className="truncate">
                {engineerUser ? `${engineerUser.first_name} ${engineerUser.last_name}` : '—'}
              </span>
              <StatusBadge status={ticket.current_status} />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onViewHistory(ticket)}
                  className="cursor-pointer border-0 bg-transparent p-0 font-condensed text-[12.5px] font-semibold tracking-[0.06em] text-atlas-blue-text uppercase hover:text-atlas-navy"
                >
                  View History
                </button>
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

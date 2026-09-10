import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/Dialog';
import { StatusBadge } from '@/components/StatusBadge';
import { getTicket } from '@/services/tickets/tickets.service';
import type { Ticket, TicketDetail } from '@/services/tickets/types';

interface TicketDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The ticket whose history is being viewed; null while the dialog is closed. */
  ticket: Ticket | null;
}

/**
 * Read-only full history for one ticket — every visit cycle and every
 * findings submission raised against the request, satisfying the Audit
 * Tracking & Ticketing deliverable's "ticket history and comments"
 * requirement beyond just the current status shown in the list.
 *
 * @param props - {TicketDetailDialogProps} Open state and the ticket being viewed.
 * @returns {JSX.Element} The rendered dialog.
 */
export function TicketDetailDialog({ open, onOpenChange, ticket }: TicketDetailDialogProps) {
  const [detail, setDetail] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !ticket) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets the previous ticket's detail once the dialog closes; see useAsync's identical, already-accepted fetch-on-effect pattern.
      setDetail(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    getTicket(ticket.id)
      .then((result) => {
        if (!cancelled) setDetail(result);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load ticket history. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, ticket]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{ticket?.code} — Ticket History</DialogTitle>
        </DialogHeader>

        {loading && <p className="text-sm text-atlas-ink/55">Loading…</p>}

        {!loading && error && <p className="text-sm text-atlas-negative">{error}</p>}

        {!loading && !error && detail && detail.audits.length === 0 && (
          <p className="text-sm text-atlas-ink/55">No visit has been assigned yet.</p>
        )}

        {!loading && !error && detail && (
          <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
            {detail.audits.map((audit) => (
              <div key={audit.id} className="border border-atlas-ink/14 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-condensed text-sm font-semibold">{audit.code}</span>
                  <StatusBadge status={audit.status} />
                </div>
                <p className="mb-2 text-xs text-atlas-ink/60">
                  Engineer:{' '}
                  {audit.field_engineer?.user
                    ? `${audit.field_engineer.user.first_name} ${audit.field_engineer.user.last_name}`
                    : '—'}
                </p>

                {audit.findings.length === 0 ? (
                  <p className="text-xs text-atlas-ink/50">No findings submitted yet.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {audit.findings.map((finding) => (
                      <div key={finding.id} className="border-t border-atlas-ink/8 pt-2 text-xs">
                        <p className="text-atlas-ink/80">{finding.remarks || 'No remarks.'}</p>
                        {finding.decision && (
                          <p className="mt-1 text-atlas-ink/60">
                            Decision: <StatusBadge status={finding.decision} />
                            {finding.review_remarks && ` — ${finding.review_remarks}`}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import type { Ticket } from '@/services/tickets/types';
import { TicketsTable } from './components/TicketsTable';
import { TicketDetailDialog } from './components/TicketDetailDialog';
import { useTickets } from './hooks/useTickets';

export default function TicketsPage() {
  const { tickets, page, lastPage, loading, error, setPage } = useTickets();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);

  function openHistoryDialog(ticket: Ticket) {
    setViewingTicket(ticket);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <TicketsTable
        tickets={tickets}
        loading={loading}
        error={error}
        page={page}
        lastPage={lastPage}
        onPageChange={setPage}
        onViewHistory={openHistoryDialog}
      />

      <TicketDetailDialog open={dialogOpen} onOpenChange={setDialogOpen} ticket={viewingTicket} />
    </div>
  );
}

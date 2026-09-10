import { DataState } from '@/components/DataState';
import { StatusBadge } from '@/components/StatusBadge';
import type { Client } from '@/services/clients/types';

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onEdit: (client: Client) => void;
  onToggleActive: (client: Client) => void;
}

const COLUMNS = 'grid-cols-[1.4fr_1.8fr_1.4fr_0.8fr_1fr]';

export function ClientsTable({
  clients,
  loading,
  error,
  page,
  lastPage,
  onPageChange,
  onEdit,
  onToggleActive,
}: ClientsTableProps) {
  return (
    <section className="border border-atlas-ink/14">
      <div
        className={`grid ${COLUMNS} gap-3 border-b border-atlas-ink/14 px-5 py-[9px] font-mono text-[10px] tracking-[0.1em] text-atlas-ink/50 uppercase`}
      >
        <span>Name</span>
        <span>Email</span>
        <span>Contact No.</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <DataState loading={loading} error={error} empty={clients.length === 0} emptyLabel="No client organizations found.">
        {clients.map((client) => (
          <div
            key={client.id}
            className={`grid ${COLUMNS} items-center gap-3 border-b border-atlas-ink/8 px-5 py-3 text-[13.5px] last:border-b-0`}
          >
            <span className="truncate">{client.name}</span>
            <span className="truncate">{client.email ?? '—'}</span>
            <span className="truncate">{client.contact_no}</span>
            <StatusBadge status={client.is_active ? 'Active' : 'Inactive'} />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onEdit(client)}
                className="cursor-pointer border-0 bg-transparent p-0 font-condensed text-[12.5px] font-semibold tracking-[0.06em] text-atlas-blue-text uppercase hover:text-atlas-navy"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onToggleActive(client)}
                className="cursor-pointer border-0 bg-transparent p-0 font-condensed text-[12.5px] font-semibold tracking-[0.06em] text-atlas-negative uppercase hover:text-atlas-negative/80"
              >
                {client.is_active ? 'Deactivate' : 'Reactivate'}
              </button>
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

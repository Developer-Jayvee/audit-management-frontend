import { useState } from 'react';
import { Button } from '@/components/Button';
import { useConfirm } from '@/contexts/ConfirmDialogContext';
import { showErrorToast } from '@/lib/toast';
import { createClient, setClientActive, updateClient } from '@/services/clients/clients.service';
import type { Client } from '@/services/clients/types';
import { ClientsTable } from './components/ClientsTable';
import { ClientFormDialog, type ClientFormValues } from './components/ClientFormDialog';
import { useClients } from './hooks/useClients';

/**
 * Strips empty-string optional fields down to `undefined` so they're
 * omitted from the request instead of failing the backend's `nullable`
 * rules with `""`. `user_id` is the exception — an empty selection means
 * "unlink this organization from any login," which must be sent as an
 * explicit `null`, not omitted (an omitted `user_id` on an edit would
 * leave an existing link untouched).
 *
 * @param values - {ClientFormValues} The raw form values.
 * @returns {ClientFormValues & { user_id: string | null }} The same values with blank optional fields removed.
 */
function cleanOptionalFields(values: ClientFormValues) {
  return {
    ...values,
    email: values.email || undefined,
    city_id: values.city_id || undefined,
    region_id: values.region_id || undefined,
    user_id: values.user_id || null,
  };
}

export default function ClientsPage() {
  const { clients, page, lastPage, loading, error, setPage, refetch } = useClients();
  const confirm = useConfirm();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function openCreateDialog() {
    setEditingClient(null);
    setDialogOpen(true);
  }

  function openEditDialog(client: Client) {
    setEditingClient(client);
    setDialogOpen(true);
  }

  async function handleSubmit(values: ClientFormValues) {
    setSubmitting(true);
    try {
      const payload = cleanOptionalFields(values);
      if (editingClient) {
        await updateClient(editingClient.id, payload);
      } else {
        await createClient(payload as Parameters<typeof createClient>[0]);
      }
      setDialogOpen(false);
      await refetch();
    } catch {
      showErrorToast(editingClient ? 'Failed to update client. Please try again.' : 'Failed to create client. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(client: Client) {
    const activating = !client.is_active;
    const confirmed = await confirm({
      title: activating ? 'Reactivate this client?' : 'Deactivate this client?',
      description: activating
        ? `${client.name} will be visible across the console again.`
        : `${client.name}, and the admin's ability to act on its stores/branches, will be hidden immediately.`,
      confirmLabel: activating ? 'Reactivate' : 'Deactivate',
      variant: activating ? 'default' : 'destructive',
    });
    if (!confirmed) return;

    try {
      await setClientActive(client.id, activating);
      await refetch();
    } catch {
      showErrorToast(activating ? 'Failed to reactivate client. Please try again.' : 'Failed to deactivate client. Please try again.');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button className="!w-auto px-5" onClick={openCreateDialog}>
          New Client
        </Button>
      </div>

      <ClientsTable
        clients={clients}
        loading={loading}
        error={error}
        page={page}
        lastPage={lastPage}
        onPageChange={setPage}
        onEdit={openEditDialog}
        onToggleActive={handleToggleActive}
      />

      <ClientFormDialog
        key={editingClient?.id ?? 'create'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={editingClient}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

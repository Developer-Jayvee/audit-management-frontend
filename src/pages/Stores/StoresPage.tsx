import { useState } from 'react';
import { Button } from '@/components/Button';
import { useConfirm } from '@/contexts/ConfirmDialogContext';
import { showErrorToast } from '@/lib/toast';
import { createStore, setStoreActive, updateStore } from '@/services/stores/stores.service';
import type { Store } from '@/services/stores/types';
import { StoresTable } from './components/StoresTable';
import { StoreFormDialog, type StoreFormValues } from './components/StoreFormDialog';
import { useStores } from './hooks/useStores';

export default function StoresPage() {
  const { stores, page, lastPage, loading, error, setPage, refetch } = useStores();
  const confirm = useConfirm();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function openCreateDialog() {
    setEditingStore(null);
    setDialogOpen(true);
  }

  function openEditDialog(store: Store) {
    setEditingStore(store);
    setDialogOpen(true);
  }

  async function handleSubmit(values: StoreFormValues) {
    setSubmitting(true);
    try {
      const payload = {
        client_id: values.client_id,
        branch_id: values.branch_id || null,
        name: values.name,
        email: values.email || undefined,
        contact_no: values.contact_no,
      };
      if (editingStore) {
        await updateStore(editingStore.id, payload);
      } else {
        await createStore(payload);
      }
      setDialogOpen(false);
      await refetch();
    } catch {
      showErrorToast(editingStore ? 'Failed to update store. Please try again.' : 'Failed to create store. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(store: Store) {
    const activating = !store.is_active;
    const confirmed = await confirm({
      title: activating ? 'Reactivate this store?' : 'Deactivate this store?',
      description: activating
        ? `${store.name} will be visible across the console again.`
        : `${store.name} will be hidden from the admin console immediately.`,
      confirmLabel: activating ? 'Reactivate' : 'Deactivate',
      variant: activating ? 'default' : 'destructive',
    });
    if (!confirmed) return;

    try {
      await setStoreActive(store.id, activating);
      await refetch();
    } catch {
      showErrorToast(activating ? 'Failed to reactivate store. Please try again.' : 'Failed to deactivate store. Please try again.');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button className="!w-auto px-5" onClick={openCreateDialog}>
          New Store
        </Button>
      </div>

      <StoresTable
        stores={stores}
        loading={loading}
        error={error}
        page={page}
        lastPage={lastPage}
        onPageChange={setPage}
        onEdit={openEditDialog}
        onToggleActive={handleToggleActive}
      />

      <StoreFormDialog
        key={editingStore?.id ?? 'create'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        store={editingStore}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

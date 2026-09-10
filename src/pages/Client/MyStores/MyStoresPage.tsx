import { useState } from 'react';
import { Button } from '@/components/Button';
import { showErrorToast } from '@/lib/toast';
import { createStore, updateStore } from '@/services/stores/stores.service';
import type { Store } from '@/services/stores/types';
import { MyStoresTable } from './components/MyStoresTable';
import { MyStoreFormDialog, type MyStoreFormValues } from './components/MyStoreFormDialog';
import { useMyStores } from './hooks/useMyStores';

/**
 * Client portal — My Stores (Phase 3.1). Lets the authenticated Client
 * create and edit their own organization's stores; the backend derives
 * and scopes `client_id` server-side, so nothing here ever sees or sends
 * another organization's data.
 *
 * @returns {JSX.Element} The rendered page.
 */
export default function MyStoresPage() {
  const { stores, page, lastPage, loading, error, setPage, refetch } = useMyStores();

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

  async function handleSubmit(values: MyStoreFormValues) {
    setSubmitting(true);
    try {
      const payload = {
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button className="!w-auto px-5" onClick={openCreateDialog}>
          New Store
        </Button>
      </div>

      <MyStoresTable
        stores={stores}
        loading={loading}
        error={error}
        page={page}
        lastPage={lastPage}
        onPageChange={setPage}
        onEdit={openEditDialog}
      />

      <MyStoreFormDialog
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

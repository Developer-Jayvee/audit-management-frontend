import { useState } from 'react';
import { Button } from '@/components/Button';
import { showErrorToast } from '@/lib/toast';
import { createBranch, updateBranch } from '@/services/branches/branches.service';
import type { Branch } from '@/services/branches/types';
import { MyBranchesTable } from './components/MyBranchesTable';
import { MyBranchFormDialog, type MyBranchFormValues } from './components/MyBranchFormDialog';
import { useMyBranches } from './hooks/useMyBranches';

/**
 * Client portal — My Branches (Phase 3.1). Lets the authenticated Client
 * create and edit branches under their own stores; the backend derives
 * and scopes `client_id` server-side, and rejects a `store_id` that
 * doesn't belong to the caller's own organization, so nothing here ever
 * sees or sends another organization's data.
 *
 * @returns {JSX.Element} The rendered page.
 */
export default function MyBranchesPage() {
  const { branches, page, lastPage, loading, error, setPage, refetch } = useMyBranches();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function openCreateDialog() {
    setEditingBranch(null);
    setDialogOpen(true);
  }

  function openEditDialog(branch: Branch) {
    setEditingBranch(branch);
    setDialogOpen(true);
  }

  async function handleSubmit(values: MyBranchFormValues) {
    setSubmitting(true);
    try {
      const payload = {
        store_id: values.store_id,
        complete_address: values.complete_address,
        city_id: values.city_id || undefined,
        region_id: values.region_id || undefined,
      };
      if (editingBranch) {
        await updateBranch(editingBranch.id, payload);
      } else {
        await createBranch(payload);
      }
      setDialogOpen(false);
      await refetch();
    } catch {
      showErrorToast(editingBranch ? 'Failed to update branch. Please try again.' : 'Failed to create branch. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button className="!w-auto px-5" onClick={openCreateDialog}>
          New Branch
        </Button>
      </div>

      <MyBranchesTable
        branches={branches}
        loading={loading}
        error={error}
        page={page}
        lastPage={lastPage}
        onPageChange={setPage}
        onEdit={openEditDialog}
      />

      <MyBranchFormDialog
        key={editingBranch?.id ?? 'create'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        branch={editingBranch}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

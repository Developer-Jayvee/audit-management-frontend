import { useState } from 'react';
import { Button } from '@/components/Button';
import { useConfirm } from '@/contexts/ConfirmDialogContext';
import { showErrorToast } from '@/lib/toast';
import { createBranch, setBranchActive, updateBranch } from '@/services/branches/branches.service';
import type { Branch } from '@/services/branches/types';
import { BranchesTable } from './components/BranchesTable';
import { BranchFormDialog, type BranchSubmitValues } from './components/BranchFormDialog';
import { useBranches } from './hooks/useBranches';

export default function BranchesPage() {
  const { branches, page, lastPage, loading, error, setPage, refetch } = useBranches();
  const confirm = useConfirm();

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

  async function handleSubmit(values: BranchSubmitValues) {
    setSubmitting(true);
    try {
      const payload = {
        store_id: values.store_id,
        client_id: values.client_id,
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

  async function handleToggleActive(branch: Branch) {
    const activating = !branch.is_active;
    const confirmed = await confirm({
      title: activating ? 'Reactivate this branch?' : 'Deactivate this branch?',
      description: activating
        ? `${branch.complete_address} will be visible across the console again.`
        : `${branch.complete_address} will be hidden from the admin console immediately.`,
      confirmLabel: activating ? 'Reactivate' : 'Deactivate',
      variant: activating ? 'default' : 'destructive',
    });
    if (!confirmed) return;

    try {
      await setBranchActive(branch.id, activating);
      await refetch();
    } catch {
      showErrorToast(activating ? 'Failed to reactivate branch. Please try again.' : 'Failed to deactivate branch. Please try again.');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button className="!w-auto px-5" onClick={openCreateDialog}>
          New Branch
        </Button>
      </div>

      <BranchesTable
        branches={branches}
        loading={loading}
        error={error}
        page={page}
        lastPage={lastPage}
        onPageChange={setPage}
        onEdit={openEditDialog}
        onToggleActive={handleToggleActive}
      />

      <BranchFormDialog
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

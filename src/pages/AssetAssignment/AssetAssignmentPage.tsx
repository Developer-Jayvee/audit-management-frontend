import { useState } from 'react';
import { useConfirm } from '@/contexts/ConfirmDialogContext';
import { showErrorToast } from '@/lib/toast';
import { assignAsset } from '@/services/assetAssignment/assetAssignment.service';
import type { Asset } from '@/services/assets/types';
import { AssignmentsTable } from './components/AssignmentsTable';
import { AssignAssetDialog, type AssignFormValues } from './components/AssignAssetDialog';
import { useAssetAssignments } from './hooks/useAssetAssignments';

export default function AssetAssignmentPage() {
  const { assets, page, lastPage, loading, error, setPage, refetch } = useAssetAssignments();
  const confirm = useConfirm();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [assigningAsset, setAssigningAsset] = useState<Asset | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function openAssignDialog(asset: Asset) {
    setAssigningAsset(asset);
    setDialogOpen(true);
  }

  async function handleSubmit(values: AssignFormValues) {
    if (!assigningAsset) return;

    const reassigning = Boolean(assigningAsset.store_id);
    const confirmed = await confirm({
      title: reassigning ? 'Reassign this asset?' : 'Assign this asset?',
      description: `${assigningAsset.name} will ${reassigning ? 'move to' : 'be assigned to'} store #${values.store_id}.`,
      confirmLabel: reassigning ? 'Reassign' : 'Assign',
      variant: 'default',
    });
    if (!confirmed) return;

    setSubmitting(true);
    try {
      await assignAsset(assigningAsset.id, { store_id: values.store_id });
      setDialogOpen(false);
      await refetch();
    } catch {
      showErrorToast('Failed to assign asset. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <AssignmentsTable
        assets={assets}
        loading={loading}
        error={error}
        page={page}
        lastPage={lastPage}
        onPageChange={setPage}
        onAssign={openAssignDialog}
      />

      <AssignAssetDialog
        key={assigningAsset?.id ?? 'none'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        asset={assigningAsset}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

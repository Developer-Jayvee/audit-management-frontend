import { useState } from 'react';
import { Button } from '@/components/Button';
import { useConfirm } from '@/contexts/ConfirmDialogContext';
import { showErrorToast } from '@/lib/toast';
import { createAsset, setAssetActive, updateAsset } from '@/services/assets/assets.service';
import type { Asset } from '@/services/assets/types';
import { AssetsTable } from './components/AssetsTable';
import { AssetFormDialog, type AssetSubmitValues } from './components/AssetFormDialog';
import { useAssets } from './hooks/useAssets';

export default function AssetsPage() {
  const { assets, page, lastPage, loading, error, setPage, refetch } = useAssets();
  const confirm = useConfirm();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function openCreateDialog() {
    setEditingAsset(null);
    setDialogOpen(true);
  }

  function openEditDialog(asset: Asset) {
    setEditingAsset(asset);
    setDialogOpen(true);
  }

  async function handleSubmit(values: AssetSubmitValues) {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        store_id: values.store_id || null,
        client_id: values.client_id,
      };
      if (editingAsset) {
        await updateAsset(editingAsset.id, payload);
      } else {
        await createAsset(payload);
      }
      setDialogOpen(false);
      await refetch();
    } catch {
      showErrorToast(editingAsset ? 'Failed to update asset. Please try again.' : 'Failed to create asset. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(asset: Asset) {
    const activating = !asset.is_active;
    const confirmed = await confirm({
      title: activating ? 'Reactivate this asset?' : 'Retire this asset?',
      description: activating
        ? `${asset.name} will be visible across the console again.`
        : `${asset.name} will be hidden from the admin console immediately.`,
      confirmLabel: activating ? 'Reactivate' : 'Retire',
      variant: activating ? 'default' : 'destructive',
    });
    if (!confirmed) return;

    try {
      await setAssetActive(asset.id, activating);
      await refetch();
    } catch {
      showErrorToast(activating ? 'Failed to reactivate asset. Please try again.' : 'Failed to retire asset. Please try again.');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button className="!w-auto px-5" onClick={openCreateDialog}>
          New Asset
        </Button>
      </div>

      <AssetsTable
        assets={assets}
        loading={loading}
        error={error}
        page={page}
        lastPage={lastPage}
        onPageChange={setPage}
        onEdit={openEditDialog}
        onToggleActive={handleToggleActive}
      />

      <AssetFormDialog
        key={editingAsset?.id ?? 'create'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        asset={editingAsset}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

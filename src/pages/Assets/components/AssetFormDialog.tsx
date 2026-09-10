import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/Dialog';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { FieldError } from '@/components/FieldError';
import { useOptionsList } from '@/hooks/useOptionsList';
import { getStores } from '@/services/stores/stores.service';
import type { Asset } from '@/services/assets/types';

const UNASSIGNED = '';

const assetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(32),
  store_id: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof assetSchema>;

/** Submitted form values plus the `client_id` derived from the chosen store, when one is picked. */
export type AssetSubmitValues = AssetFormValues & { client_id: string | null };

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The asset being edited, or null when the dialog is creating a new one. */
  asset: Asset | null;
  submitting: boolean;
  onSubmit: (values: AssetSubmitValues) => Promise<void>;
}

/**
 * Single create/edit dialog for Asset Management — All Assets. Only a Store
 * is picked directly (optional — an asset can be registered unassigned and
 * attached later from Asset Assignment); `client_id` is derived from the
 * chosen store's own `client_id` at submit time rather than exposed as a
 * second, independently settable field, so it can't drift from the store
 * it belongs to (same pattern as Branch's client_id derivation in Phase
 * 2.3).
 *
 * @param props - {AssetFormDialogProps} Open state, the asset being edited (if any), and the submit handler.
 * @returns {JSX.Element} The rendered form dialog.
 */
export function AssetFormDialog({ open, onOpenChange, asset, submitting, onSubmit }: AssetFormDialogProps) {
  const isEdit = asset !== null;
  const { options: stores } = useOptionsList(getStores);

  const storeOptions = [
    { value: UNASSIGNED, label: '— Unassigned —' },
    ...stores.map((store) => ({ value: String(store.id), label: `${store.name} (Client #${store.client_id})` })),
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
  });

  useEffect(() => {
    if (!open) return;
    reset(
      asset
        ? {
            name: asset.name,
            store_id: asset.store_id ? String(asset.store_id) : UNASSIGNED,
          }
        : { name: '', store_id: UNASSIGNED }
    );
  }, [open, asset, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Asset' : 'New Asset'}</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((values) => {
            const selectedStore = stores.find((store) => String(store.id) === values.store_id);
            return onSubmit({ ...values, client_id: selectedStore ? String(selectedStore.client_id) : null });
          })}
        >
          <div>
            <Input placeholder="Asset name" {...register('name')} />
            <FieldError>{errors.name?.message}</FieldError>
          </div>

          <div>
            <Select options={storeOptions} {...register('store_id')} />
            <FieldError>{errors.store_id?.message}</FieldError>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" className="!w-auto px-4" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="!w-auto px-4" loading={submitting}>
              {isEdit ? 'Save Changes' : 'Create Asset'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

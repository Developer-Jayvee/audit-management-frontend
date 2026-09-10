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
import { Select } from '@/components/Select';
import { FieldError } from '@/components/FieldError';
import { useOptionsList } from '@/hooks/useOptionsList';
import { getStores } from '@/services/stores/stores.service';
import type { Asset } from '@/services/assets/types';

const assignSchema = z.object({
  store_id: z.string().min(1, 'Store is required'),
});

export type AssignFormValues = z.infer<typeof assignSchema>;

interface AssignAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The asset being assigned; null while the dialog is closed. */
  asset: Asset | null;
  submitting: boolean;
  onSubmit: (values: AssignFormValues) => Promise<void>;
}

/**
 * Assign/reassign dialog for Asset Management — Asset Assignment. Picks a
 * store only — the backend derives `client_id` from the chosen store, so it
 * always matches (see `assets.assign` in the backend Service layer).
 *
 * @param props - {AssignAssetDialogProps} Open state, the asset being assigned, and the submit handler.
 * @returns {JSX.Element} The rendered dialog.
 */
export function AssignAssetDialog({ open, onOpenChange, asset, submitting, onSubmit }: AssignAssetDialogProps) {
  const { options: stores } = useOptionsList(getStores);

  const storeOptions = stores.map((store) => ({ value: String(store.id), label: `${store.name} (Client #${store.client_id})` }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
  });

  useEffect(() => {
    if (!open) return;
    reset({ store_id: asset?.store_id ? String(asset.store_id) : '' });
  }, [open, asset, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{asset?.store_id ? 'Reassign Asset' : 'Assign Asset'}</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit((values) => onSubmit(values))}>
          <div>
            <Select options={storeOptions} {...register('store_id')} />
            <FieldError>{errors.store_id?.message}</FieldError>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" className="!w-auto px-4" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="!w-auto px-4" loading={submitting}>
              {asset?.store_id ? 'Save Changes' : 'Assign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

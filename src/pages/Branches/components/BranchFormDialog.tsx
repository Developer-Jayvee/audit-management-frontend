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
import type { Branch } from '@/services/branches/types';

const branchSchema = z.object({
  store_id: z.string().min(1, 'Store is required'),
  complete_address: z.string().min(1, 'Address is required'),
  city_id: z.string().optional(),
  region_id: z.string().optional(),
});

export type BranchFormValues = z.infer<typeof branchSchema>;

/** Submitted form values plus the `client_id` derived from the chosen store. */
export type BranchSubmitValues = BranchFormValues & { client_id: string };

interface BranchFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The branch being edited, or null when the dialog is creating a new one. */
  branch: Branch | null;
  submitting: boolean;
  onSubmit: (values: BranchSubmitValues) => Promise<void>;
}

/**
 * Single create/edit dialog for Client Management — All Branches. Only a
 * Store is picked directly — `client_id` (denormalized onto `branches` for
 * convenience, per docs/Schema.md) is derived from the chosen store's own
 * `client_id` at submit time rather than exposed as a second, independently
 * settable field, so it can't drift from the store it's supposed to match.
 *
 * @param props - {BranchFormDialogProps} Open state, the branch being edited (if any), and the submit handler.
 * @returns {JSX.Element} The rendered form dialog.
 */
export function BranchFormDialog({ open, onOpenChange, branch, submitting, onSubmit }: BranchFormDialogProps) {
  const isEdit = branch !== null;
  const { options: stores } = useOptionsList(getStores);

  const storeOptions = stores.map((store) => ({ value: String(store.id), label: `${store.name} (Client #${store.client_id})` }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
  });

  useEffect(() => {
    if (!open) return;
    reset(
      branch
        ? {
            store_id: String(branch.store_id),
            complete_address: branch.complete_address,
            city_id: branch.city_id ?? '',
            region_id: branch.region_id ?? '',
          }
        : { store_id: '' }
    );
  }, [open, branch, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Branch' : 'New Branch'}</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((values) => {
            const selectedStore = stores.find((store) => String(store.id) === values.store_id);
            return onSubmit({ ...values, client_id: selectedStore ? String(selectedStore.client_id) : '' });
          })}
        >
          <div>
            <Select options={storeOptions} {...register('store_id')} />
            <FieldError>{errors.store_id?.message}</FieldError>
          </div>

          <div>
            <Input placeholder="Complete address" {...register('complete_address')} />
            <FieldError>{errors.complete_address?.message}</FieldError>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input placeholder="City (optional)" {...register('city_id')} />
              <FieldError>{errors.city_id?.message}</FieldError>
            </div>
            <div>
              <Input placeholder="Region (optional)" {...register('region_id')} />
              <FieldError>{errors.region_id?.message}</FieldError>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" className="!w-auto px-4" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="!w-auto px-4" loading={submitting}>
              {isEdit ? 'Save Changes' : 'Create Branch'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

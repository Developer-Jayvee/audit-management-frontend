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

const myBranchSchema = z.object({
  store_id: z.string().min(1, 'Store is required'),
  complete_address: z.string().min(1, 'Address is required'),
  city_id: z.string().optional(),
  region_id: z.string().optional(),
});

export type MyBranchFormValues = z.infer<typeof myBranchSchema>;

interface MyBranchFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The branch being edited, or null when the dialog is creating a new one. */
  branch: Branch | null;
  submitting: boolean;
  onSubmit: (values: MyBranchFormValues) => Promise<void>;
}

/**
 * Single create/edit dialog for the Client portal's My Branches (Phase
 * 3.1). Unlike the admin oversight view's `BranchFormDialog`, there's no
 * `client_id` field — the backend always derives and overwrites it from
 * the authenticated Client's own organization (per `backend-security`).
 * The Store picker sources its options from `getStores`, which the
 * backend already scopes to this Client's own stores, so every option
 * here is necessarily one of the viewer's own.
 *
 * @param props - {MyBranchFormDialogProps} Open state, the branch being edited (if any), and the submit handler.
 * @returns {JSX.Element} The rendered form dialog.
 */
export function MyBranchFormDialog({ open, onOpenChange, branch, submitting, onSubmit }: MyBranchFormDialogProps) {
  const isEdit = branch !== null;
  const { options: stores } = useOptionsList(getStores);

  const storeOptions = stores.map((store) => ({ value: String(store.id), label: store.name }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MyBranchFormValues>({
    resolver: zodResolver(myBranchSchema),
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

        <form className="flex flex-col gap-4" onSubmit={handleSubmit((values) => onSubmit(values))}>
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

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
import { getClients } from '@/services/clients/clients.service';
import { getBranches } from '@/services/branches/branches.service';
import type { Store } from '@/services/stores/types';

const NO_BRANCH = '';

const storeSchema = z.object({
  client_id: z.string().min(1, 'Client is required'),
  branch_id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(64),
  email: z.union([z.email(), z.literal('')]).optional(),
  contact_no: z.string().min(1, 'Contact number is required'),
});

export type StoreFormValues = z.infer<typeof storeSchema>;

interface StoreFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The store being edited, or null when the dialog is creating a new one. */
  store: Store | null;
  submitting: boolean;
  onSubmit: (values: StoreFormValues) => Promise<void>;
}

/**
 * Single create/edit dialog for Client Management — All Stores. `client_id`
 * is a required picker (a store always belongs to a client); `branch_id` is
 * optional — a store may not have a branch attached yet, since a branch
 * itself always requires a store to exist first (see
 * docs/development-phases.md §2.3).
 *
 * @param props - {StoreFormDialogProps} Open state, the store being edited (if any), and the submit handler.
 * @returns {JSX.Element} The rendered form dialog.
 */
export function StoreFormDialog({ open, onOpenChange, store, submitting, onSubmit }: StoreFormDialogProps) {
  const isEdit = store !== null;
  const { options: clients } = useOptionsList(getClients);
  const { options: branches } = useOptionsList(getBranches);

  const clientOptions = clients.map((client) => ({ value: String(client.id), label: client.name }));
  const branchOptions = [
    { value: NO_BRANCH, label: '— None —' },
    ...branches.map((branch) => ({ value: String(branch.id), label: `#${branch.id} — ${branch.complete_address}` })),
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
  });

  useEffect(() => {
    if (!open) return;
    reset(
      store
        ? {
            client_id: String(store.client_id),
            branch_id: store.branch_id ? String(store.branch_id) : NO_BRANCH,
            name: store.name,
            email: store.email ?? '',
            contact_no: store.contact_no ?? '',
          }
        : { client_id: '', branch_id: NO_BRANCH }
    );
  }, [open, store, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Store' : 'New Store'}</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit((values) => onSubmit(values))}>
          <div>
            <Select options={clientOptions} {...register('client_id')} />
            <FieldError>{errors.client_id?.message}</FieldError>
          </div>

          <div>
            <Input placeholder="Store name" {...register('name')} />
            <FieldError>{errors.name?.message}</FieldError>
          </div>

          <div>
            <Input type="email" placeholder="Email (optional)" {...register('email')} />
            <FieldError>{errors.email?.message}</FieldError>
          </div>

          <div>
            <Input placeholder="Contact number" {...register('contact_no')} />
            <FieldError>{errors.contact_no?.message}</FieldError>
          </div>

          <div>
            <Select options={branchOptions} {...register('branch_id')} />
            <FieldError>{errors.branch_id?.message}</FieldError>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" className="!w-auto px-4" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="!w-auto px-4" loading={submitting}>
              {isEdit ? 'Save Changes' : 'Create Store'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

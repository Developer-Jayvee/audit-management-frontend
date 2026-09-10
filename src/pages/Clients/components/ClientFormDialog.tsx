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
import { getClientAccounts } from '@/services/users/users.service';
import type { Client } from '@/services/clients/types';

const UNLINKED = '';

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.union([z.email(), z.literal('')]).optional(),
  contact_no: z.string().min(1, 'Contact number is required'),
  complete_address: z.string().min(1, 'Address is required'),
  city_id: z.string().optional(),
  region_id: z.string().optional(),
  user_id: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The client organization being edited, or null when the dialog is creating a new one. */
  client: Client | null;
  submitting: boolean;
  onSubmit: (values: ClientFormValues) => Promise<void>;
}

/**
 * Single create/edit dialog for Client Management — All Clients. The
 * "Linked Client Account" picker (Phase 3.1) is how an Admin connects this
 * organization to the `client`-role login that manages it in the Client
 * portal — optional, since an organization can be registered before its
 * login account exists.
 *
 * @param props - {ClientFormDialogProps} Open state, the client organization being edited (if any), and the submit handler.
 * @returns {JSX.Element} The rendered form dialog.
 */
export function ClientFormDialog({ open, onOpenChange, client, submitting, onSubmit }: ClientFormDialogProps) {
  const isEdit = client !== null;
  const { options: clientAccounts } = useOptionsList(getClientAccounts);

  const userOptions = [
    { value: UNLINKED, label: '— Unlinked —' },
    ...clientAccounts.map((account) => ({
      value: String(account.id),
      label: `${account.first_name} ${account.last_name} (${account.email})`,
    })),
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    if (!open) return;
    reset(
      client
        ? {
            name: client.name,
            email: client.email ?? '',
            contact_no: client.contact_no,
            complete_address: client.complete_address,
            city_id: client.city_id ?? '',
            region_id: client.region_id ?? '',
            user_id: client.user_id ? String(client.user_id) : UNLINKED,
          }
        : { user_id: UNLINKED }
    );
  }, [open, client, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Client' : 'New Client'}</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit((values) => onSubmit(values))}>
          <div>
            <Input placeholder="Organization name" {...register('name')} />
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
            <Input placeholder="Complete address" {...register('complete_address')} />
            <FieldError>{errors.complete_address?.message}</FieldError>
          </div>

          <div>
            <Select options={userOptions} {...register('user_id')} />
            <FieldError>{errors.user_id?.message}</FieldError>
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
              {isEdit ? 'Save Changes' : 'Create Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

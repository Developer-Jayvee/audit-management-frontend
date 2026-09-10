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
import { getClients } from '@/services/clients/clients.service';
import { getStores } from '@/services/stores/stores.service';

const NO_STORE = '';

// AuditRequestTypeEnum (backend) only defines one case so far — a hardcoded
// single option, matching how RoleTypes is hardcoded in common/types/common.ts,
// rather than a picker over a list nothing else populates yet.
const REQUEST_TYPE_OPTIONS = [{ value: 'preventive_maintenance', label: 'Preventive Maintenance' }];

const newRequestSchema = z.object({
  client_id: z.string().min(1, 'Client is required'),
  store_id: z.string().optional(),
  request_type: z.string().min(1, 'Request type is required'),
});

export type NewAuditRequestFormValues = z.infer<typeof newRequestSchema>;

interface NewAuditRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting: boolean;
  onSubmit: (values: NewAuditRequestFormValues) => Promise<void>;
}

/**
 * Raises a new audit request — a stand-in for the Client's own raise-a-
 * request flow (Phase 3.3), which doesn't exist yet. Admin-only, per
 * `AuditRequestPolicy::create()`.
 *
 * @param props - {NewAuditRequestDialogProps} Open state and the submit handler.
 * @returns {JSX.Element} The rendered form dialog.
 */
export function NewAuditRequestDialog({ open, onOpenChange, submitting, onSubmit }: NewAuditRequestDialogProps) {
  const { options: clients } = useOptionsList(getClients);
  const { options: stores } = useOptionsList(getStores);

  const clientOptions = clients.map((client) => ({ value: String(client.id), label: client.name }));
  const storeOptions = [
    { value: NO_STORE, label: '— None —' },
    ...stores.map((store) => ({ value: String(store.id), label: `${store.name} (Client #${store.client_id})` })),
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewAuditRequestFormValues>({
    resolver: zodResolver(newRequestSchema),
  });

  useEffect(() => {
    if (!open) return;
    reset({ client_id: '', store_id: NO_STORE, request_type: REQUEST_TYPE_OPTIONS[0].value });
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Audit Request</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit((values) => onSubmit(values))}>
          <div>
            <Select options={clientOptions} {...register('client_id')} />
            <FieldError>{errors.client_id?.message}</FieldError>
          </div>

          <div>
            <Select options={storeOptions} {...register('store_id')} />
            <FieldError>{errors.store_id?.message}</FieldError>
          </div>

          <div>
            <Select options={REQUEST_TYPE_OPTIONS} {...register('request_type')} />
            <FieldError>{errors.request_type?.message}</FieldError>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" className="!w-auto px-4" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="!w-auto px-4" loading={submitting}>
              Raise Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

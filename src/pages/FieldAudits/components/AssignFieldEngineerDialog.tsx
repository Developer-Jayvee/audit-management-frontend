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
import { getFieldEngineers } from '@/services/users/users.service';
import type { AuditRequest } from '@/services/auditRequests/types';

const assignSchema = z.object({
  field_engineer_id: z.string().min(1, 'Field engineer is required'),
});

export type AssignFieldEngineerFormValues = z.infer<typeof assignSchema>;

interface AssignFieldEngineerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The approved request being assigned; null while the dialog is closed. */
  auditRequest: AuditRequest | null;
  submitting: boolean;
  onSubmit: (values: AssignFieldEngineerFormValues) => Promise<void>;
}

/**
 * Assigns a field engineer to an approved audit request, creating the
 * visit that tracks it. Picks from `field_engineer`-role accounts only —
 * each option's value is that account's `field_engineer_profile.id`
 * (`field_engineers.id`), which is what `audits.field_engineer_id`
 * actually references, not the account's own `id`.
 *
 * @param props - {AssignFieldEngineerDialogProps} Open state, the request being assigned, and the submit handler.
 * @returns {JSX.Element} The rendered dialog.
 */
export function AssignFieldEngineerDialog({
  open,
  onOpenChange,
  auditRequest,
  submitting,
  onSubmit,
}: AssignFieldEngineerDialogProps) {
  const { options: fieldEngineers } = useOptionsList(getFieldEngineers);

  const engineerOptions = fieldEngineers
    .filter((engineer) => engineer.field_engineer_profile !== null)
    .map((engineer) => ({
      value: String(engineer.field_engineer_profile!.id),
      label: `${engineer.first_name} ${engineer.last_name}`,
    }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignFieldEngineerFormValues>({
    resolver: zodResolver(assignSchema),
  });

  useEffect(() => {
    if (!open) return;
    reset({ field_engineer_id: '' });
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Field Engineer</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit((values) => onSubmit(values))}>
          <p className="text-sm text-atlas-ink/70">
            {auditRequest?.code} — {auditRequest?.client?.name ?? `Client #${auditRequest?.client_id}`}
          </p>

          <div>
            <Select options={engineerOptions} {...register('field_engineer_id')} />
            <FieldError>{errors.field_engineer_id?.message}</FieldError>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" className="!w-auto px-4" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="!w-auto px-4" loading={submitting}>
              Assign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

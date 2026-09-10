import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/Dialog';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/Textarea';
import type { AuditFinding } from '@/services/findings/types';

interface ReviewFindingFormValues {
  review_remarks: string;
}

interface ReviewFindingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The submission being decided; null while the dialog is closed. */
  finding: AuditFinding | null;
  /** Which decision this dialog is confirming — set by whichever action button opened it. */
  decision: 'passed' | 'rescheduled' | null;
  submitting: boolean;
  onSubmit: (reviewRemarks: string) => Promise<void>;
}

/**
 * Confirms a Findings Review decision (pass or reschedule) with an
 * optional reviewer note — a decision action in the audit lifecycle, per
 * `frontend-architecture`'s confirmation rule, since a submitted finding is
 * append-only and this decision closes the ticket or sends it back for a
 * revisit with no undo.
 *
 * @param props - {ReviewFindingDialogProps} Open state, the submission and decision being confirmed, and the submit handler.
 * @returns {JSX.Element} The rendered dialog.
 */
export function ReviewFindingDialog({ open, onOpenChange, finding, decision, submitting, onSubmit }: ReviewFindingDialogProps) {
  const { register, handleSubmit, reset } = useForm<ReviewFindingFormValues>();

  useEffect(() => {
    if (!open) return;
    reset({ review_remarks: '' });
  }, [open, reset]);

  const isPass = decision === 'passed';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isPass ? 'Pass This Finding?' : 'Send Back for Reschedule?'}</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit((values) => onSubmit(values.review_remarks))}>
          <p className="text-sm text-atlas-ink/70">
            {isPass
              ? `${finding?.audit?.audit_request?.code ?? ''} will be marked passed and the ticket closed.`
              : `${finding?.audit?.audit_request?.code ?? ''} will be sent back to the same field engineer for a revisit.`}
          </p>

          <div>
            <Textarea placeholder="Review notes (optional)" {...register('review_remarks')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" className="!w-auto px-4" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="!w-auto px-4" loading={submitting}>
              {isPass ? 'Pass' : 'Reschedule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

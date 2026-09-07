import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/Dialog';
import { cn } from '@/lib/utils';
import type { ConfirmVariant } from '@/contexts/ConfirmDialogContext';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

const CONFIRM_BUTTON_CLASSES: Record<ConfirmVariant, string> = {
  default:
    'text-atlas-paper bg-atlas-blue border-atlas-blue hover:bg-atlas-blue-hover active:bg-atlas-blue-active',
  destructive:
    'text-atlas-paper bg-atlas-negative border-atlas-negative hover:bg-atlas-negative/90 active:bg-atlas-negative/80',
};

/**
 * The app's single shared confirm/warning dialog UI — built on the
 * shadcn-style `Dialog` primitive. Rendered once by
 * `ConfirmDialogProvider`; call `useConfirm()` to open it rather than
 * rendering this directly (see docs/coding-standards.md §3.3).
 *
 * @param props - {ConfirmDialogProps} Dialog copy, open state, and confirm/cancel handlers.
 * @returns {JSX.Element} The rendered confirm dialog.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-none border border-atlas-ink/16 bg-transparent px-4 font-condensed text-sm font-semibold tracking-wide text-atlas-ink uppercase transition-colors hover:bg-atlas-ink/7"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              'inline-flex min-h-10 cursor-pointer items-center justify-center rounded-none border px-4 font-condensed text-sm font-semibold tracking-wide uppercase transition-colors',
              CONFIRM_BUTTON_CLASSES[variant]
            )}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

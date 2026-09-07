import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

/**
 * Dims the page behind an open dialog.
 *
 * @param props - {ComponentProps<typeof DialogPrimitive.Overlay>} Props forwarded to the Radix overlay.
 * @returns {JSX.Element} The overlay element.
 */
function DialogOverlay({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn('fixed inset-0 z-50 bg-atlas-ink/40', className)}
      {...props}
    />
  );
}

/**
 * The centered, bordered dialog panel — the shadcn-style Dialog content
 * primitive, restyled to the Atlas theme (sharp corners, hairline border).
 *
 * @param props - {ComponentProps<typeof DialogPrimitive.Content>} Props forwarded to the Radix content, including `children`.
 * @returns {JSX.Element} The dialog panel, portaled above an overlay.
 */
function DialogContent({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-atlas-ink/16 bg-atlas-paper p-6 font-sans shadow-lg focus:outline-none',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/**
 * Groups the dialog's title/description above its body content.
 *
 * @param props - {ComponentProps<'div'>} Standard div props, including `className`.
 * @returns {JSX.Element} A header layout container.
 */
function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mb-4 flex flex-col gap-1.5', className)} {...props} />;
}

/**
 * Groups the dialog's action buttons below its body content.
 *
 * @param props - {ComponentProps<'div'>} Standard div props, including `className`.
 * @returns {JSX.Element} A footer layout container.
 */
function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mt-6 flex justify-end gap-3', className)} {...props} />;
}

/**
 * The dialog's accessible title, read by screen readers on open.
 *
 * @param props - {ComponentProps<typeof DialogPrimitive.Title>} Props forwarded to the Radix title.
 * @returns {JSX.Element} The title element.
 */
function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('font-condensed text-lg font-semibold text-atlas-ink', className)}
      {...props}
    />
  );
}

/**
 * The dialog's supporting description text, read by screen readers on open.
 *
 * @param props - {ComponentProps<typeof DialogPrimitive.Description>} Props forwarded to the Radix description.
 * @returns {JSX.Element} The description element.
 */
function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm text-atlas-ink/70', className)}
      {...props}
    />
  );
}

export {
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

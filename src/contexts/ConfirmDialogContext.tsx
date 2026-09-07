import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export type ConfirmVariant = 'default' | 'destructive';

export interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

interface ConfirmDialogContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(null);

/**
 * Returns a `confirm()` function that opens the app's single shared
 * confirm/warning dialog and resolves with the user's choice. This is
 * the required stand-in for `window.confirm` for destructive and
 * audit-decision actions (see docs/coding-standards.md §3.3).
 *
 * @returns {(options: ConfirmOptions) => Promise<boolean>} Call with dialog copy; resolves `true` if confirmed, `false` if cancelled or dismissed.
 */
export function useConfirm() {
  const context = useContext(ConfirmDialogContext);

  if (context === null) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider.');
  }

  return context.confirm;
}

/**
 * Mounts the single shared confirm dialog for the whole app and exposes
 * `useConfirm()` to every descendant. Mount once, near the app root
 * (see main.tsx) so every domain shares the same dialog instance.
 *
 * @param props - {{ children: ReactNode }} The subtree that can call `useConfirm()`.
 * @returns {JSX.Element} The provider, wrapping `children`, with the dialog portaled above them.
 */
export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const settle = useCallback((result: boolean) => {
    setOpen(false);
    resolveRef.current?.(result);
    resolveRef.current = null;
  }, []);

  const confirm = useCallback((nextOptions: ConfirmOptions) => {
    setOptions(nextOptions);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const value = useMemo<ConfirmDialogContextValue>(() => ({ confirm }), [confirm]);

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      {options && (
        <ConfirmDialog
          open={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) settle(false);
          }}
          title={options.title}
          description={options.description}
          confirmLabel={options.confirmLabel}
          cancelLabel={options.cancelLabel}
          variant={options.variant}
          onConfirm={() => settle(true)}
          onCancel={() => settle(false)}
        />
      )}
    </ConfirmDialogContext.Provider>
  );
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Central place to tune toast behavior per type (duration) and the
 * defaults for the app-wide `<Toaster />` mount — change values here
 * instead of passing options at each call site.
 */
export const toastConfig = {
  duration: {
    success: 4000,
    info: 4000,
    warning: 6000,
    error: 8000,
  } satisfies Record<ToastType, number>,
  toaster: {
    position: 'top-right',
    closeButton: true,
    richColors: false,
    toastOptions: {
      classNames: {
        toast: 'font-sans! text-sm! rounded-none! border!',
        title: 'text-atlas-ink!',
        description: 'text-atlas-ink/70!',
        success: 'border-atlas-positive/40! bg-atlas-paper!',
        error: 'border-atlas-negative/40! bg-atlas-paper!',
        warning: 'border-atlas-warning/40! bg-atlas-paper!',
        info: 'border-atlas-blue/40! bg-atlas-paper!',
      },
    },
  } as const,
};

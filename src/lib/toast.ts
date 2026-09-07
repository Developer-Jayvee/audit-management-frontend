import { toast as sonnerToast, type ExternalToast } from 'sonner';
import { toastConfig } from '@/lib/config/toast';

type ToastOptions = Pick<ExternalToast, 'description' | 'duration'>;

/**
 * Shows a success toast — confirms an action completed as expected
 * (e.g. "Audit request submitted").
 *
 * @param message - {string} The headline text to display.
 * @param options - {ToastOptions} Optional description text and duration override.
 * @returns {void}
 */
export function showSuccessToast(message: string, options?: ToastOptions): void {
  sonnerToast.success(message, {
    duration: toastConfig.duration.success,
    ...options,
  });
}

/**
 * Shows an error/alert toast — a failed request or a rejected action
 * (e.g. "Failed to assign field engineer").
 *
 * @param message - {string} The headline text to display.
 * @param options - {ToastOptions} Optional description text and duration override.
 * @returns {void}
 */
export function showErrorToast(message: string, options?: ToastOptions): void {
  sonnerToast.error(message, {
    duration: toastConfig.duration.error,
    ...options,
  });
}

/**
 * Shows a warning toast — something the user should notice but that
 * didn't block the action (e.g. "Saved, but 2 assets were skipped").
 *
 * @param message - {string} The headline text to display.
 * @param options - {ToastOptions} Optional description text and duration override.
 * @returns {void}
 */
export function showWarningToast(message: string, options?: ToastOptions): void {
  sonnerToast.warning(message, {
    duration: toastConfig.duration.warning,
    ...options,
  });
}

/**
 * Shows a neutral info toast — a status update with no success/failure
 * connotation (e.g. "Session will expire in 5 minutes").
 *
 * @param message - {string} The headline text to display.
 * @param options - {ToastOptions} Optional description text and duration override.
 * @returns {void}
 */
export function showInfoToast(message: string, options?: ToastOptions): void {
  sonnerToast.info(message, {
    duration: toastConfig.duration.info,
    ...options,
  });
}

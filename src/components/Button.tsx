import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'text-atlas-paper bg-atlas-blue border-atlas-blue hover:bg-atlas-blue-hover active:bg-atlas-blue-active',
  ghost:
    'text-atlas-ink bg-transparent border-atlas-ink/16 hover:bg-atlas-ink/7',
};

export function Button({
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex w-full min-h-10 cursor-pointer items-center justify-center gap-2 rounded-none border font-condensed text-sm font-semibold tracking-wide uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

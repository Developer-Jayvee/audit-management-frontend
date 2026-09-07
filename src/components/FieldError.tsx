import type { ReactNode } from 'react';

interface FieldErrorProps {
  children?: ReactNode;
}

export function FieldError({ children }: FieldErrorProps) {
  if (!children) return null;
  return <p className="mt-2 text-[12.5px] text-atlas-error-text">{children}</p>;
}

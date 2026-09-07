import type { InputHTMLAttributes, Ref } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
}

export function Input({ className = '', ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={`w-full min-h-10 rounded-none border border-atlas-ink/16 bg-atlas-field px-3 py-2 font-sans text-sm text-atlas-ink caret-atlas-blue focus:border-atlas-blue focus:outline-none focus-visible:outline-2 focus-visible:outline-atlas-blue focus-visible:outline-offset-2 ${className}`}
      {...props}
    />
  );
}

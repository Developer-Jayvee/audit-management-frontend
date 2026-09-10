import type { Ref, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({ className = '', ref, rows = 3, ...props }: TextareaProps) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`w-full resize-none rounded-none border border-atlas-ink/16 bg-atlas-field px-3 py-2 font-sans text-sm text-atlas-ink caret-atlas-blue focus:border-atlas-blue focus:outline-none focus-visible:outline-2 focus-visible:outline-atlas-blue focus-visible:outline-offset-2 ${className}`}
      {...props}
    />
  );
}

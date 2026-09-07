import type { Ref, SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  ref?: Ref<HTMLSelectElement>;
}

export function Select({ options, className = '', ref, ...props }: SelectProps) {
  return (
    <select
      ref={ref}
      className={`w-full min-h-10 rounded-none border border-atlas-ink/16 bg-atlas-field px-3 py-2 font-sans text-sm text-atlas-ink focus:border-atlas-blue focus:outline-none focus-visible:outline-2 focus-visible:outline-atlas-blue focus-visible:outline-offset-2 ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

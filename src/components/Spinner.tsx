interface SpinnerProps {
  className?: string;
}

export function Spinner({ className = '' }: SpinnerProps) {
  return (
    <span
      className={`inline-block h-3 w-3 shrink-0 animate-spin rounded-full border-[1.5px] border-atlas-paper/40 border-t-atlas-paper ${className}`}
    />
  );
}

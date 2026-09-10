type StatusTone = 'positive' | 'neutral' | 'negative';

const TONE_CLASSES: Record<StatusTone, string> = {
  positive: 'border-atlas-positive text-atlas-positive',
  neutral: 'border-atlas-blue-active text-atlas-blue-active',
  negative: 'border-atlas-negative text-atlas-negative',
};

const POSITIVE_STATUSES = ['approved', 'counted', 'active', 'completed', 'resolved', 'passed'];
const NEGATIVE_STATUSES = ['escalated', 'missing', 'rejected', 'overdue', 'inactive', 'declined', 'rescheduled'];

function toneFor(status: string): StatusTone {
  const normalized = status.trim().toLowerCase();
  if (POSITIVE_STATUSES.includes(normalized)) return 'positive';
  if (NEGATIVE_STATUSES.includes(normalized)) return 'negative';
  return 'neutral';
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`justify-self-start border px-[7px] py-0.5 text-[11.5px] ${TONE_CLASSES[toneFor(status)]}`}>
      {status}
    </span>
  );
}

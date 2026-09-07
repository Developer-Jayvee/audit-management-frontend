import { DataState } from '@/components/DataState';
import type { DashboardStat } from '@/services/dashboard/types';

interface StatsGridProps {
  stats: DashboardStat[];
  loading: boolean;
  error: string | null;
}

export function StatsGrid({ stats, loading, error }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-px border border-atlas-ink/14 bg-atlas-ink/14 sm:grid-cols-2 lg:grid-cols-4">
      <DataState loading={loading} error={error} empty={stats.length === 0}>
        {stats.map((stat) => (
          <div key={stat.id} className="flex min-w-0 flex-col gap-1.5 bg-atlas-field px-5 py-[18px]">
            <span className="font-mono text-[10px] tracking-[0.12em] text-atlas-ink/55 uppercase">{stat.label}</span>
            <span className="font-condensed text-[34px] leading-none font-semibold">{stat.value}</span>
            <span className="text-[12.5px] text-atlas-ink/55">{stat.note}</span>
          </div>
        ))}
      </DataState>
    </div>
  );
}

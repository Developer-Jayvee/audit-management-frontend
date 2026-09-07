import { ActivityPanel } from './components/ActivityPanel';
import { ProgressPanel } from './components/ProgressPanel';
import { StatsGrid } from './components/StatsGrid';
import { VariancesPanel } from './components/VariancesPanel';
import { useDashboardSummary } from './hooks/useDashboardSummary';

export default function DashboardPage() {
  const { data, loading, error } = useDashboardSummary();

  return (
      <div className="flex flex-col gap-[22px]">
        <StatsGrid stats={data.stats} loading={loading} error={error} />

        <div className="grid grid-cols-1 items-start gap-[22px] lg:grid-cols-[1.6fr_1fr]">
          <VariancesPanel rows={data.variances} loading={loading} error={error} />

          <div className="flex flex-col gap-[22px]">
            <ProgressPanel rows={data.progress} loading={loading} error={error} />
            <ActivityPanel items={data.activity} loading={loading} error={error} />
          </div>
        </div>
      </div>
  );
}

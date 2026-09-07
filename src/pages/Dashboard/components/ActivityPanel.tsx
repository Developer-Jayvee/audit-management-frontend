import { DataState } from '@/components/DataState';
import type { ActivityItem } from '@/services/dashboard/types';

interface ActivityPanelProps {
  items: ActivityItem[];
  loading: boolean;
  error: string | null;
}

export function ActivityPanel({ items, loading, error }: ActivityPanelProps) {
  return (
    <section className="border border-atlas-ink/14 px-5 py-[18px]">
      <h2 className="m-0 mb-3.5 font-condensed text-[17px] font-semibold">Activity</h2>
      <div className="flex flex-col">
        <DataState loading={loading} error={error} empty={items.length === 0} emptyLabel="No recent activity.">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_auto] gap-3 border-t border-atlas-ink/10 py-2.5 text-[13px] first:border-t-0"
            >
              <span className="text-atlas-ink/80" style={{ textWrap: 'pretty' }}>
                {item.text}
              </span>
              <span className="font-mono text-[11px] whitespace-nowrap text-atlas-ink/45">{item.time}</span>
            </div>
          ))}
        </DataState>
      </div>
    </section>
  );
}

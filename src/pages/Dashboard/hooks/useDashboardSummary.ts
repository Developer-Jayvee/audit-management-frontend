import { useAsync } from '@/hooks/useAsync';
import { getDashboardSummary } from '@/services/dashboard/dashboard.service';
import type { DashboardSummary } from '@/services/dashboard/types';

const EMPTY_SUMMARY: DashboardSummary = { stats: [], variances: [], progress: [], activity: [] };

export function useDashboardSummary() {
  return useAsync(getDashboardSummary, EMPTY_SUMMARY);
}

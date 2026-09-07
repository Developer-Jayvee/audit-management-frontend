import httpClient from '@/lib/axios';
import type { DashboardSummary } from './types';

const dashboardSummaryURL = 'dashboard/summary';

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await httpClient.get<DashboardSummary>(dashboardSummaryURL);
  return response.data;
};

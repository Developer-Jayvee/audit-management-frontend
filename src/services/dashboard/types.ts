export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  note: string;
}

export interface VarianceRow {
  id: string;
  asset: string;
  branch: string;
  delta: string;
  status: string;
}

export interface ProgressRow {
  id: string;
  label: string;
  pct: number;
  text: string;
}

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
}

export interface DashboardSummary {
  stats: DashboardStat[];
  variances: VarianceRow[];
  progress: ProgressRow[];
  activity: ActivityItem[];
}

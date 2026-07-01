import { ReactNode } from 'react';

export interface KPICardProps {
  icon: ReactNode;
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  sub?: string;
  isDown?: boolean;
  noTrendIcon?: boolean;
  showTrend?: boolean;
  progress?: number;
}

export interface RevenueDataItem {
  name: string;
  revenue: number;
  profit: number;
}

export interface HealthDataItem {
  name: string;
  value: number;
  color: string;
}

export interface DashboardVisibility {
  [key: string]: boolean;
}

export interface DashboardStateProps {
  timeframe: string;
  revenueData: RevenueDataItem[];
  healthData: HealthDataItem[];
  healthScore: number;
  aiInsights: any[];
  costEfficiency: any;
  kpiStats: {
    totalTrips: { value: string; trend: string; sub: string };
    delPerVeh: { value: string; unit: string; trend: string; sub: string };
    fleetUtil: { value: string; trend: string; isDown: boolean; sub: string };
    driverEff: { value: string; trend: string; sub: string };
    cashRunway: { value: string; trend: string; sub: string };
    growth: { value: string; trend: string; sub: string };
    ebitda: { value: string; trend: string; isDown: boolean; sub: string };
    cashflow: { value: string; unit: string; trend: string; sub: string };
  };
  visibility: Record<string, boolean>;
  loading?: boolean;
}

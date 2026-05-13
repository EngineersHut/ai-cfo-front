import { ReactNode } from 'react';

export interface KPICardProps {
  icon: ReactNode;
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  sub: string;
  isDown?: boolean;
  noTrendIcon?: boolean;
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

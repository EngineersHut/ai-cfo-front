import React from 'react';

export interface ForecastChartItem {
  month: string;
  revenue: number;
  expenses: number;
  cashReserve: number;
  optimisticRevenue: number;
  conservativeRevenue: number;
}

export interface ScenarioItem {
  name: string;
  growthRate: number;
  margin: number;
  runway: number;
  costReduction: number;
  color: string;
}

export interface ForecastInsightItem {
  id: string;
  title: string;
  type: 'success' | 'warning' | 'info';
  impact: 'High' | 'Medium' | 'Low';
  description: string;
}

// 12-Month Projections
export const forecastChartData: ForecastChartItem[] = [
  { month: 'Oct 2024', revenue: 105000, expenses: 82000, cashReserve: 1248000, optimisticRevenue: 105000, conservativeRevenue: 105000 },
  { month: 'Nov 2024', revenue: 112000, expenses: 83000, cashReserve: 1277000, optimisticRevenue: 115000, conservativeRevenue: 110000 },
  { month: 'Dec 2024', revenue: 120000, expenses: 84000, cashReserve: 1313000, optimisticRevenue: 126000, conservativeRevenue: 115000 },
  { month: 'Jan 2025', revenue: 128000, expenses: 84500, cashReserve: 1356500, optimisticRevenue: 138000, conservativeRevenue: 120000 },
  { month: 'Feb 2025', revenue: 135000, expenses: 85000, cashReserve: 1406500, optimisticRevenue: 149000, conservativeRevenue: 125000 },
  { month: 'Mar 2025', revenue: 142000, expenses: 85500, cashReserve: 1463000, optimisticRevenue: 162000, conservativeRevenue: 129000 },
  { month: 'Apr 2025', revenue: 150000, expenses: 86000, cashReserve: 1527000, optimisticRevenue: 175000, conservativeRevenue: 134000 },
  { month: 'May 2025', revenue: 158000, expenses: 86800, cashReserve: 1598200, optimisticRevenue: 189000, conservativeRevenue: 139000 },
  { month: 'Jun 2025', revenue: 165000, expenses: 87500, cashReserve: 1675700, optimisticRevenue: 202000, conservativeRevenue: 143000 },
  { month: 'Jul 2025', revenue: 172000, expenses: 88000, cashReserve: 1759700, optimisticRevenue: 215000, conservativeRevenue: 148000 },
  { month: 'Aug 2025', revenue: 180000, expenses: 89000, cashReserve: 1850700, optimisticRevenue: 230000, conservativeRevenue: 152000 },
  { month: 'Sep 2025', revenue: 188000, expenses: 89500, cashReserve: 1949200, optimisticRevenue: 245000, conservativeRevenue: 156000 }
];

// Scenarios comparison
export const scenarioData: ScenarioItem[] = [
  { name: 'Baseline', growthRate: 15, margin: 28.4, runway: 36, costReduction: 5, color: '#3b82f6' },
  { name: 'Optimistic (Growth Focus)', growthRate: 28, margin: 34.2, runway: 48, costReduction: 2, color: '#10b981' },
  { name: 'Conservative (Risk Mitigation)', growthRate: 8, margin: 22.0, runway: 28, costReduction: 12, color: '#ef4444' }
];

// AI CFO Forecast Recommendations
export const aiForecastInsights: ForecastInsightItem[] = [
  {
    id: 'fi-1',
    title: 'Liquidity Optimization',
    type: 'success',
    impact: 'High',
    description: 'At the current Burn Rate ($32.8K/Month), cash reserves will grow by 56% by Sep 2025. This creates an opportunity to allocate up to $250K to yield-generating cash equivalents or expand growth investments.'
  },
  {
    id: 'fi-2',
    title: 'Operating Margin Alert',
    type: 'info',
    impact: 'Medium',
    description: 'Operating margin is projected to scale from 28.4% to 34.2% if customer acquisition costs decrease by 10% next quarter. Focus on channel efficiency to hit this optimistic threshold.'
  },
  {
    id: 'fi-3',
    title: 'Burn Rate Risk Mitigation',
    type: 'warning',
    impact: 'Low',
    description: 'Under the Conservative scenario, a 15% drop in enterprise renewal rate would decrease runway to 28 months. Implement a 5% fixed cost buffer now to insulate against market downturns.'
  }
];

export interface ForecastReport {
    id: number;
    title: string;
    periodType: 'Monthly' | 'Quarterly' | 'Yearly';
    period: string;
    mode: 'conservative' | 'aggressive' | 'stress_test';
    projectedRevenue: number;
    projectedGrowth: number;
    confidence: number;
    dateRange: string;
    status: 'Processed' | 'Failed';
    filesCount: number;
}

export const initialForecastReports: ForecastReport[] = [
    {
        id: 1,
        title: "Q1 2026 Operations Baseline",
        periodType: 'Monthly',
        period: "Jan 2026",
        mode: 'conservative',
        projectedRevenue: 148500,
        projectedGrowth: 6.2,
        confidence: 99.1,
        dateRange: "Jan 01 - Jan 31",
        status: 'Processed',
        filesCount: 3
    },
    {
        id: 2,
        title: "FY26 High-Growth Expansion",
        periodType: 'Yearly',
        period: "Year 2026",
        mode: 'aggressive',
        projectedRevenue: 285400,
        projectedGrowth: 14.8,
        confidence: 96.4,
        dateRange: "Jan 01 - Dec 31",
        status: 'Processed',
        filesCount: 5
    },
    {
        id: 3,
        title: "H2 Macro Stress Scenario",
        periodType: 'Quarterly',
        period: "Q3 2026",
        mode: 'stress_test',
        projectedRevenue: 92100,
        projectedGrowth: -2.1,
        confidence: 98.2,
        dateRange: "Jul 01 - Sep 30",
        status: 'Processed',
        filesCount: 4
    },
    {
        id: 4,
        title: "Q4 Retail Rollout Audit",
        periodType: 'Quarterly',
        period: "Q4 2026",
        mode: 'aggressive',
        projectedRevenue: 220700,
        projectedGrowth: 12.5,
        confidence: 95.8,
        dateRange: "Oct 01 - Dec 31",
        status: 'Processed',
        filesCount: 2
    }
];


import { IndustryEnum } from './industry';

export interface DashboardKPIConfig {
  key: string;
  label: string;
  sub: string;
  format: 'currency' | 'percent' | 'number' | 'text';
  icon: string;
  isDownPositive?: boolean;
}

export const DASHBOARD_KPI_CONFIGS: Partial<Record<IndustryEnum, DashboardKPIConfig[]>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: [
    // Row 1
    { key: 'mrr', label: 'MRR (Monthly Recurring)', sub: 'vs last mo.', format: 'currency', icon: 'DollarSign' },
    { key: 'churnRate', label: 'Churn Rate', sub: 'vs last mo.', format: 'percent', icon: 'Activity', isDownPositive: true },
    { key: 'cac', label: 'CAC (Customer Acquisition)', sub: 'vs last mo.', format: 'currency', icon: 'Wallet', isDownPositive: true },
    { key: 'ltv', label: 'LTV (Lifetime Value)', sub: 'vs last mo.', format: 'currency', icon: 'TrendingUp' },
    // Row 2
    { key: 'arr', label: 'ARR (Annualized Runway)', sub: 'forward outlook', format: 'currency', icon: 'Briefcase' },
    { key: 'nrr', label: 'Net Revenue Retention', sub: 'vs last year', format: 'percent', icon: 'Zap' },
    { key: 'ebitda', label: 'EBITDA', sub: 'operating margin', format: 'currency', icon: 'BarChart3' },
    { key: 'burnRate', label: 'Net Burn Rate', sub: 'vs budget', format: 'currency', icon: 'Clock', isDownPositive: true },
  ],
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: [
    // Row 1
    { key: 'projectProfitability', label: 'Project Profitability', sub: 'vs average', format: 'percent', icon: 'PieChart' },
    { key: 'resourceUtilization', label: 'Resource Utilization', sub: 'billable hours / capacity', format: 'percent', icon: 'Activity' },
    { key: 'activeProjects', label: 'Active Projects', sub: 'running projects', format: 'number', icon: 'Briefcase' },
    { key: 'wipValue', label: 'WIP Value', sub: 'unbilled work value', format: 'currency', icon: 'DollarSign' },
    // Row 2
    { key: 'cashRunway', label: 'Cash Runway', sub: 'vs last period', format: 'text', icon: 'Clock' },
    { key: 'revenuePerFte', label: 'Revenue Per FTE', sub: 'vs last year', format: 'currency', icon: 'Users' },
    { key: 'ebitda', label: 'EBITDA', sub: 'operating margin', format: 'currency', icon: 'BarChart3' },
    { key: 'cashflow', label: 'Operating Cash Flow', sub: 'vs last period', format: 'currency', icon: 'Wallet' },
  ],
  [IndustryEnum.FINANCIAL_AND_BANKING]: [
    // Row 1
    { key: 'aum', label: 'Assets Under Management', sub: 'net new assets', format: 'currency', icon: 'Briefcase' },
    { key: 'nim', label: 'Net Interest Margin', sub: 'yield spread', format: 'percent', icon: 'Activity' },
    { key: 'roi', label: 'Return on Investment', sub: 'portfolio performance', format: 'percent', icon: 'TrendingUp' },
    { key: 'car', label: 'Capital Adequacy Ratio', sub: 'regulatory health', format: 'percent', icon: 'Zap' },
    // Row 2
    { key: 'cashRunway', label: 'Cash Runway', sub: 'liquidity coverage', format: 'text', icon: 'Clock' },
    { key: 'growth', label: 'Growth %', sub: 'vs last period', format: 'percent', icon: 'BarChart3' },
    { key: 'ebitda', label: 'EBITDA', sub: 'adjusted earnings', format: 'currency', icon: 'DollarSign' },
    { key: 'cashflow', label: 'Operating Cash Flow', sub: 'cash flows from ops', format: 'currency', icon: 'Wallet' },
  ],
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: [
    // Row 1
    { key: 'totalTrips', label: 'Total Deliveries / Trips', sub: 'vs last period', format: 'number', icon: 'Truck' },
    { key: 'delPerVeh', label: 'Deliveries Per Vehicle', sub: 'vs last period', format: 'number', icon: 'Activity' },
    { key: 'fleetUtil', label: 'Fleet Utilization', sub: 'vs last period', format: 'percent', icon: 'Zap' },
    { key: 'driverEff', label: 'Driver Efficiency', sub: 'vs last period', format: 'text', icon: 'Users' },
    // Row 2
    { key: 'cashRunway', label: 'Cash Runway', sub: 'vs last period', format: 'text', icon: 'Clock' },
    { key: 'growth', label: 'Growth %', sub: 'vs last period', format: 'percent', icon: 'TrendingUp' },
    { key: 'ebitda', label: 'EBITDA', sub: 'vs last period', format: 'currency', icon: 'DollarSign' },
    { key: 'cashflow', label: 'Operating Cash Flow', sub: 'vs last period', format: 'currency', icon: 'Wallet' },
  ],
};

export interface DashboardHeaderConfig {
  title: string;
  subtitle: string;
}

export const DASHBOARD_HEADER_CONFIGS: Partial<Record<IndustryEnum, DashboardHeaderConfig>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: {
    title: 'SaaS Performance & Growth',
    subtitle: 'Monitor recurring revenue, cohort retention, and customer acquisition metrics.',
  },
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: {
    title: 'Project & Resource Insights',
    subtitle: 'Track billable hours, project profitability, and workspace utilization.',
  },
  [IndustryEnum.FINANCIAL_AND_BANKING]: {
    title: 'Financial Asset Performance',
    subtitle: 'Analyze assets under management, interest margins, and investment portfolios.',
  },
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: {
    title: 'Operational Overview',
    subtitle: 'Track fleet performance, cost efficiency, and drive actionable insights.',
  },
};

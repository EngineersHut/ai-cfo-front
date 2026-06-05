import { IndustryEnum } from './industry';

export interface GrowthKPIConfig {
  key: string;
  label: string;
  sub: string;
  format: 'currency' | 'percent' | 'number' | 'text';
  icon: string;
  isDownPositive?: boolean;
}

export interface GrowthHeaderConfig {
  title: string;
  subtitle: string;
}

export const GROWTH_HEADER_CONFIGS: Record<IndustryEnum, GrowthHeaderConfig> = {
  [IndustryEnum.TECHNOLOGY_AND_SAAS]: {
    title: 'SaaS Growth & Retention',
    subtitle: 'Track logo scaling, user expansion, and MRR growth cohorts.',
  },
  [IndustryEnum.ARCHITECTURE_AND_DESIGN]: {
    title: 'Project & Workspace Growth',
    subtitle: 'Monitor billing runway expansion, backlog progress, and fee margins.',
  },
  [IndustryEnum.FINANCIAL_SERVICES]: {
    title: 'Asset Growth & Returns',
    subtitle: 'Analyze capitalization rates, asset growth, and investor returns.',
  },
  [IndustryEnum.FLEET_MANAGEMENT]: {
    title: 'Growth Overview',
    subtitle: 'Analyze business growth trends, revenue scaling, and fleet expansion.',
  },
};

export const GROWTH_KPI_CONFIGS: Record<IndustryEnum, GrowthKPIConfig[]> = {
  [IndustryEnum.TECHNOLOGY_AND_SAAS]: [
    { key: 'monthlyGrowthPercent', label: 'Monthly Growth %', sub: 'Compared to last month', format: 'percent', icon: 'TrendingUp' },
    { key: 'quarterlyGrowthPercent', label: 'Quarterly Growth %', sub: 'Q2 performance cohort', format: 'percent', icon: 'Calendar' },
    { key: 'yearlyGrowthPercent', label: 'Yearly Growth %', sub: 'Annual cohort rate', format: 'percent', icon: 'BarChart' },
    { key: 'revenuePerClient', label: 'LTV per Client', sub: 'Average recurring value', format: 'currency', icon: 'DollarSign' }
  ],
  [IndustryEnum.ARCHITECTURE_AND_DESIGN]: [
    { key: 'monthlyGrowthPercent', label: 'Monthly Projects Growth %', sub: 'Active billing speed', format: 'percent', icon: 'TrendingUp' },
    { key: 'quarterlyGrowthPercent', label: 'Quarterly Backlog %', sub: 'Current backlog health', format: 'percent', icon: 'Calendar' },
    { key: 'yearlyGrowthPercent', label: 'Yearly Projects Growth %', sub: 'Yearly design expansion', format: 'percent', icon: 'BarChart' },
    { key: 'revenuePerClient', label: 'Revenue per Project', sub: 'Average design fee value', format: 'currency', icon: 'DollarSign' }
  ],
  [IndustryEnum.FINANCIAL_SERVICES]: [
    { key: 'monthlyGrowthPercent', label: 'Monthly AUM Growth %', sub: 'Net capital flow speed', format: 'percent', icon: 'TrendingUp' },
    { key: 'quarterlyGrowthPercent', label: 'Quarterly ROI Rate %', sub: 'Asset yield efficiency', format: 'percent', icon: 'Calendar' },
    { key: 'yearlyGrowthPercent', label: 'Yearly Returns %', sub: 'Annual portfolio yield', format: 'percent', icon: 'BarChart' },
    { key: 'revenuePerClient', label: 'Revenue per Account', sub: 'Average account revenue', format: 'currency', icon: 'DollarSign' }
  ],
  [IndustryEnum.FLEET_MANAGEMENT]: [
    { key: 'monthlyGrowthPercent', label: 'Monthly Growth %', sub: 'Compared to last month', format: 'percent', icon: 'TrendingUp' },
    { key: 'quarterlyGrowthPercent', label: 'Quarterly Growth', sub: 'Q2 performance', format: 'percent', icon: 'Calendar' },
    { key: 'yearlyGrowthPercent', label: 'Year-over-Year Growth', sub: 'Annual growth rate', format: 'percent', icon: 'BarChart' },
    { key: 'revenuePerClient', label: 'Revenue per Client', sub: 'Average per customer', format: 'currency', icon: 'DollarSign' }
  ],
};

export const GROWTH_ADDITIONAL_KPI_CONFIGS: Record<IndustryEnum, GrowthKPIConfig[]> = {
  [IndustryEnum.TECHNOLOGY_AND_SAAS]: [
    { key: 'revenuePerEmployee', label: 'SaaS Revenue / FTE', sub: 'Efficiency cohort', format: 'currency', icon: 'Banknote' },
    { key: 'employeeGrowthPercent', label: 'Team Growth', sub: 'Talent cohort expansion', format: 'percent', icon: 'TrendingUp' },
    { key: 'clientGrowthPercent', label: 'Logo Retention', sub: 'Retention efficiency', format: 'percent', icon: 'Wallet' }
  ],
  [IndustryEnum.ARCHITECTURE_AND_DESIGN]: [
    { key: 'revenuePerEmployee', label: 'Revenue per Architect', sub: 'Billable efficiency', format: 'currency', icon: 'Banknote' },
    { key: 'employeeGrowthPercent', label: 'Design Team Growth', sub: 'Workspace expansion', format: 'percent', icon: 'TrendingUp' },
    { key: 'clientGrowthPercent', label: 'Project Growth', sub: 'Project success rate', format: 'percent', icon: 'Wallet' }
  ],
  [IndustryEnum.FINANCIAL_SERVICES]: [
    { key: 'revenuePerEmployee', label: 'Revenue per Broker', sub: 'Advisor efficiency', format: 'currency', icon: 'Banknote' },
    { key: 'employeeGrowthPercent', label: 'Broker Network Growth', sub: 'Network expansion', format: 'percent', icon: 'TrendingUp' },
    { key: 'clientGrowthPercent', label: 'Depositors Growth', sub: 'Investor acquisition', format: 'percent', icon: 'Wallet' }
  ],
  [IndustryEnum.FLEET_MANAGEMENT]: [
    { key: 'revenuePerEmployee', label: 'Revenue per Employee', sub: 'Efficiency metric', format: 'currency', icon: 'Banknote' },
    { key: 'employeeGrowthPercent', label: 'Employee Growth', sub: 'Team expansion', format: 'percent', icon: 'TrendingUp' },
    { key: 'clientGrowthPercent', label: 'Client Growth', sub: 'Retention rate', format: 'percent', icon: 'Wallet' }
  ],
};

import { IndustryEnum } from './industry';

export interface ReportsKPIConfig {
  key: string;
  label: string;
  sub: string;
  format: 'currency' | 'percent' | 'number';
  icon: string;
  isDownPositive?: boolean;
}

export const REPORTS_KPI_CONFIGS: Record<IndustryEnum, ReportsKPIConfig[]> = {
  [IndustryEnum.TECHNOLOGY_AND_SAAS]: [
    { key: 'totalRevenue', label: 'SaaS Revenue', sub: 'vs last period', format: 'currency', icon: 'DollarSign' },
    { key: 'netProfit', label: 'Net Profit', sub: 'vs last period', format: 'currency', icon: 'PieChart' },
    { key: 'totalExpenses', label: 'SaaS Cost of Goods', sub: 'vs last period', format: 'currency', icon: 'Wallet', isDownPositive: true },
    { key: 'profitMargin', label: 'Gross Margin', sub: 'efficiency score', format: 'percent', icon: 'Activity' },
  ],
  [IndustryEnum.ARCHITECTURE_AND_DESIGN]: [
    { key: 'totalRevenue', label: 'Design Fees Revenue', sub: 'vs last period', format: 'currency', icon: 'DollarSign' },
    { key: 'netProfit', label: 'Net Profit', sub: 'vs last period', format: 'currency', icon: 'PieChart' },
    { key: 'totalExpenses', label: 'Project Expenses', sub: 'vs last period', format: 'currency', icon: 'Wallet', isDownPositive: true },
    { key: 'profitMargin', label: 'Profit Margin', sub: 'efficiency score', format: 'percent', icon: 'Activity' },
  ],
  [IndustryEnum.FINANCIAL_SERVICES]: [
    { key: 'totalRevenue', label: 'Management Fees', sub: 'vs last period', format: 'currency', icon: 'DollarSign' },
    { key: 'netProfit', label: 'Net Profit', sub: 'vs last period', format: 'currency', icon: 'PieChart' },
    { key: 'totalExpenses', label: 'Operating Expenses', sub: 'vs last period', format: 'currency', icon: 'Wallet', isDownPositive: true },
    { key: 'profitMargin', label: 'Profit Margin', sub: 'efficiency score', format: 'percent', icon: 'Activity' },
  ],
  [IndustryEnum.FLEET_MANAGEMENT]: [
    { key: 'totalRevenue', label: 'Revenue', sub: 'vs last period', format: 'currency', icon: 'DollarSign' },
    { key: 'netProfit', label: 'Net Profit', sub: 'vs last period', format: 'currency', icon: 'PieChart' },
    { key: 'totalExpenses', label: 'Expense', sub: 'vs last period', format: 'currency', icon: 'Wallet', isDownPositive: true },
    { key: 'profitMargin', label: 'Profit Margin', sub: 'efficiency score', format: 'percent', icon: 'Activity' },
  ],
};

export interface ReportsHeaderConfig {
  title: string;
  subtitle: string;
}

export const REPORTS_HEADER_CONFIGS: Record<IndustryEnum, ReportsHeaderConfig> = {
  [IndustryEnum.TECHNOLOGY_AND_SAAS]: {
    title: 'SaaS Report Timeline',
    subtitle: 'Your SaaS financial performance metrics have been consolidated. AI CFO has identified key SaaS growth and customer churn insights.'
  },
  [IndustryEnum.ARCHITECTURE_AND_DESIGN]: {
    title: 'Architecture Report Timeline',
    subtitle: 'Your design project-based performance metrics have been consolidated. AI CFO has identified project margin and billing trends.'
  },
  [IndustryEnum.FINANCIAL_SERVICES]: {
    title: 'Financial Services Report Timeline',
    subtitle: 'Your asset management and advisory performance metrics have been consolidated. AI CFO has identified fee & cost variance trends.'
  },
  [IndustryEnum.FLEET_MANAGEMENT]: {
    title: 'Report Timeline',
    subtitle: 'Your Q1 2026 financial performance metrics have been consolidated. AI CFO has identified 3 key optimization trends.'
  }
};


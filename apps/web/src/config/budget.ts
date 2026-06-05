import { IndustryEnum } from './industry';

export interface BudgetKPIConfig {
  key: string;
  label: string;
  sub: string;
  format: 'currency' | 'percent' | 'number' | 'text';
  icon: string;
  trend: string;
  isDownPositive?: boolean;
}

export interface BudgetHeaderConfig {
  title: string;
  subtitle: string;
}

export const BUDGET_HEADER_CONFIGS: Record<IndustryEnum, BudgetHeaderConfig> = {
  [IndustryEnum.TECHNOLOGY_AND_SAAS]: {
    title: 'SaaS Budget vs Actual',
    subtitle: 'Compare planned MRR scaling, SaaS direct costs, and host variances.',
  },
  [IndustryEnum.ARCHITECTURE_AND_DESIGN]: {
    title: 'Project Budget vs Actual',
    subtitle: 'Compare design project budgets, actual labor costs, and fee margins.',
  },
  [IndustryEnum.FINANCIAL_SERVICES]: {
    title: 'Asset Budget vs Actual',
    subtitle: 'Track asset budgets, yield payouts, and transaction variance.',
  },
  [IndustryEnum.FLEET_MANAGEMENT]: {
    title: 'Budget vs Actual',
    subtitle: 'Compare planned vs actual performance and manage fleet operational budgets.',
  },
};

export const BUDGET_KPI_CONFIGS: Record<IndustryEnum, BudgetKPIConfig[]> = {
  [IndustryEnum.TECHNOLOGY_AND_SAAS]: [
    { key: 'budgetRevenue', label: 'Budget MRR', sub: 'This period target', format: 'currency', icon: 'TrendingUp', trend: 'FY2024' },
    { key: 'actualRevenue', label: 'Actual MRR', sub: 'Reported to date', format: 'currency', icon: 'Calendar', trend: '77.1%' },
    { key: 'revenueVariance', label: 'Net MRR Variance', sub: '-$13.4K vs plan', format: 'percent', icon: 'BarChart3', trend: 'Within limit', isDownPositive: true },
    { key: 'overBudgetItems', label: 'Infra & Host Variance', sub: 'Average cloud variance', format: 'currency', icon: 'DollarSign', trend: '+4.2%' }
  ],
  [IndustryEnum.ARCHITECTURE_AND_DESIGN]: [
    { key: 'budgetRevenue', label: 'Budget Design Fees', sub: 'This period target', format: 'currency', icon: 'TrendingUp', trend: 'FY2024' },
    { key: 'actualRevenue', label: 'Actual Design Fees', sub: 'Reported to date', format: 'currency', icon: 'Calendar', trend: '77.1%' },
    { key: 'revenueVariance', label: 'Fee Variance', sub: '-$13.4K vs plan', format: 'percent', icon: 'BarChart3', trend: 'Within limit', isDownPositive: true },
    { key: 'overBudgetItems', label: 'Labor Hour Variance', sub: 'Average design variance', format: 'currency', icon: 'DollarSign', trend: '+4.2%' }
  ],
  [IndustryEnum.FINANCIAL_SERVICES]: [
    { key: 'budgetRevenue', label: 'Budget Net Yield', sub: 'This period target', format: 'currency', icon: 'TrendingUp', trend: 'FY2024' },
    { key: 'actualRevenue', label: 'Actual Net Yield', sub: 'Reported to date', format: 'currency', icon: 'Calendar', trend: '77.1%' },
    { key: 'revenueVariance', label: 'Yield Variance', sub: '-$13.4K vs plan', format: 'percent', icon: 'BarChart3', trend: 'Within limit', isDownPositive: true },
    { key: 'overBudgetItems', label: 'Compliance Variance', sub: 'Average regulatory cost', format: 'currency', icon: 'DollarSign', trend: '+4.2%' }
  ],
  [IndustryEnum.FLEET_MANAGEMENT]: [
    { key: 'budgetRevenue', label: 'Budget Revenue', sub: 'This period', format: 'currency', icon: 'TrendingUp', trend: 'FY2024' },
    { key: 'actualRevenue', label: 'Actual Revenue', sub: 'Reported to date', format: 'currency', icon: 'Calendar', trend: '77.1%' },
    { key: 'revenueVariance', label: 'Revenue Variance', sub: '-5.5%', format: 'percent', icon: 'BarChart3', trend: 'Within limit', isDownPositive: true },
    { key: 'overBudgetItems', label: 'Over-Budget Items', sub: 'Average per customer', format: 'currency', icon: 'DollarSign', trend: '+4.2%' }
  ],
};

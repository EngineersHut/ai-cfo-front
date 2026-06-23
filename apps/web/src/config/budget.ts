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
  [IndustryEnum.TECHNOLOGY_AND_IT]: {
    title: 'SaaS Budget vs Actual',
    subtitle: 'Compare planned MRR scaling, SaaS direct costs, and host variances.',
  },
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: {
    title: 'Project Budget vs Actual',
    subtitle: 'Compare design project budgets, actual labor costs, and fee margins.',
  },
  [IndustryEnum.FINANCIAL_AND_BANKING]: {
    title: 'Asset Budget vs Actual',
    subtitle: 'Track asset budgets, yield payouts, and transaction variance.',
  },
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: {
    title: 'Budget vs Actual',
    subtitle: 'Compare planned vs actual performance and manage fleet operational budgets.',
  },
};

export const BUDGET_KPI_CONFIGS: Record<IndustryEnum, BudgetKPIConfig[]> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: [
    { key: 'budgetRevenue', label: 'Budget MRR', sub: 'This period target', format: 'currency', icon: 'TrendingUp', trend: 'FY2024' },
    { key: 'actualRevenue', label: 'Actual MRR', sub: 'Reported to date', format: 'currency', icon: 'Calendar', trend: '77.1%' },
    { key: 'revenueVariance', label: 'Net MRR Variance', sub: '-$13.4K vs plan', format: 'percent', icon: 'BarChart3', trend: 'Within limit', isDownPositive: true },
    { key: 'overBudgetItems', label: 'Infra & Host Variance', sub: 'Average cloud variance', format: 'currency', icon: 'DollarSign', trend: '+4.2%' }
  ],
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: [
    { key: 'budgetRevenue', label: 'Budget Design Fees', sub: 'This period target', format: 'currency', icon: 'TrendingUp', trend: 'FY2024' },
    { key: 'actualRevenue', label: 'Actual Design Fees', sub: 'Reported to date', format: 'currency', icon: 'Calendar', trend: '77.1%' },
    { key: 'revenueVariance', label: 'Fee Variance', sub: '-$13.4K vs plan', format: 'percent', icon: 'BarChart3', trend: 'Within limit', isDownPositive: true },
    { key: 'overBudgetItems', label: 'Labor Hour Variance', sub: 'Average design variance', format: 'currency', icon: 'DollarSign', trend: '+4.2%' }
  ],
  [IndustryEnum.FINANCIAL_AND_BANKING]: [
    { key: 'budgetRevenue', label: 'Budget Net Yield', sub: 'This period target', format: 'currency', icon: 'TrendingUp', trend: 'FY2024' },
    { key: 'actualRevenue', label: 'Actual Net Yield', sub: 'Reported to date', format: 'currency', icon: 'Calendar', trend: '77.1%' },
    { key: 'revenueVariance', label: 'Yield Variance', sub: '-$13.4K vs plan', format: 'percent', icon: 'BarChart3', trend: 'Within limit', isDownPositive: true },
    { key: 'overBudgetItems', label: 'Compliance Variance', sub: 'Average regulatory cost', format: 'currency', icon: 'DollarSign', trend: '+4.2%' }
  ],
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: [
    { key: 'budgetRevenue', label: 'Budget Revenue', sub: 'This period', format: 'currency', icon: 'TrendingUp', trend: 'FY2024' },
    { key: 'actualRevenue', label: 'Actual Revenue', sub: 'Reported to date', format: 'currency', icon: 'Calendar', trend: '77.1%' },
    { key: 'revenueVariance', label: 'Revenue Variance', sub: '-5.5%', format: 'percent', icon: 'BarChart3', trend: 'Within limit', isDownPositive: true },
    { key: 'overBudgetItems', label: 'Over-Budget Items', sub: 'Average per customer', format: 'currency', icon: 'DollarSign', trend: '+4.2%' }
  ],
};
export const BUDGET_TABLE_CONFIGS: Record<IndustryEnum, Record<string, string>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: {
    'Revenue': 'MRR',
    'Direct Costs': 'Hosting & COGS',
    'Operating Expenses': 'SaaS OpEx',
    'Gross Profit': 'SaaS Gross Profit',
    'Net Margin': 'MRR Net Margin',
    'Forecast Revenue': 'Forecast MRR',
    'Variable Costs': 'Hosting Costs',
    'Logistics Costs': 'APIs & Data Services',
    'Sales & Marketing': 'Customer Acquisition (CAC)',
    'General & Admin': 'G&A Expenses',
    'Financial Costs': 'Payment Processing Fees',
    'Hiring & HR': 'Engineering & Product Hiring',
    'Operations Expansion': 'Platform Development',
    'CAPEX': 'Software Licenses',
    'Financing': 'SaaS Debt Financing',
    'Leadership Costs': 'Executive Salaries',
    'Compliance': 'SOC2 & Security Compliance',
    'Forecast Profit': 'Forecast Operating Income',
    'Forecast Cash Position': 'Forecast Cash Runway',
    'Expected Growth Rate': 'Expected LTV Growth',
  },
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: {
    'Revenue': 'Design Fees',
    'Direct Costs': 'Project Direct Labor',
    'Operating Expenses': 'Studio OpEx',
    'Gross Profit': 'Project Gross Profit',
    'Net Margin': 'Design Fee Net Margin',
    'Forecast Revenue': 'Forecast Design Fees',
    'Variable Costs': 'Contractor Costs',
    'Logistics Costs': 'Site Drafting Services',
    'Sales & Marketing': 'Client Pitching & Marketing',
    'General & Admin': 'Studio Overhead',
    'Financial Costs': 'Billing & Invoicing Fees',
    'Hiring & HR': 'Architect & Drafter Hiring',
    'Operations Expansion': 'Office/Workspace Expansion',
    'CAPEX': 'CAD/BIM Subscriptions',
    'Financing': 'Design Project Financing',
    'Leadership Costs': 'Partner Draw & Salaries',
    'Compliance': 'Professional Liability & Licensing',
    'Forecast Profit': 'Forecast Net Margin',
    'Forecast Cash Position': 'Forecast Work-in-Progress Cash',
    'Expected Growth Rate': 'Expected Backlog Growth',
  },
  [IndustryEnum.FINANCIAL_AND_BANKING]: {
    'Revenue': 'Net Yield',
    'Direct Costs': 'Transaction Costs',
    'Operating Expenses': 'Operating Expenditures',
    'Gross Profit': 'Gross Yield',
    'Net Margin': 'Net Yield Margin',
    'Forecast Revenue': 'Forecast Net Yield',
    'Variable Costs': 'Transaction Clearing Costs',
    'Logistics Costs': 'Data Feed & Bloomberg Costs',
    'Sales & Marketing': 'Investor Acquisition',
    'General & Admin': 'Administrative Overhead',
    'Financial Costs': 'Banking & Capital Fees',
    'Hiring & HR': 'Broker & Analyst Hiring',
    'Operations Expansion': 'AUM Expansion',
    'CAPEX': 'Trading Infrastructure',
    'Financing': 'Liquidity Financing',
    'Leadership Costs': 'Fund Manager Fees',
    'Compliance': 'SEC & Regulatory Compliance',
    'Forecast Profit': 'Forecast Net Yield',
    'Forecast Cash Position': 'Forecast Vault Cash',
    'Expected Growth Rate': 'Expected AUM Growth',
  },
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: {
    'Revenue': 'Revenue',
    'Direct Costs': 'Direct Costs',
    'Operating Expenses': 'Operating Expenses',
    'Gross Profit': 'Gross Profit',
    'Net Margin': 'Net Margin',
    'Forecast Revenue': 'Forecast Revenue',
    'Variable Costs': 'Variable Costs',
    'Logistics Costs': 'Logistics Costs',
    'Sales & Marketing': 'Sales & Marketing',
    'General & Admin': 'General & Admin',
    'Financial Costs': 'Financial Costs',
    'Hiring & HR': 'Hiring & HR',
    'Operations Expansion': 'Operations Expansion',
    'CAPEX': 'CAPEX',
    'Financing': 'Financing',
    'Leadership Costs': 'Leadership Costs',
    'Compliance': 'Compliance',
    'Forecast Profit': 'Forecast Profit',
    'Forecast Cash Position': 'Forecast Cash Position',
    'Expected Growth Rate': 'Expected Growth Rate',
  },
};

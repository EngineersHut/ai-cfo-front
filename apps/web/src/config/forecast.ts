import { IndustryEnum } from './industry';

export interface ForecastKPIConfig {
  key: string;
  label: string;
  format: 'currency' | 'percent' | 'number' | 'text';
  icon: string;
  trend: string;
  isDown?: boolean;
  sub?: string;
  unit?: string;
  defaultValue?: number;
}

export interface ForecastHeaderConfig {
  title: string;
  subtitle: string;
}

export interface ExpenseItemConfig {
  name: string;
  value: number; // percentage
  color: string;
}

export interface CostDetailItemConfig {
  name: string;
  value: string;
  trend: string;
  progress: number;
  color: string;
  dotColor: string;
}

export interface AIInsightItemConfig {
  id: string;
  title: string;
  percentage: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const FORECAST_HEADER_CONFIGS: Partial<Record<IndustryEnum, ForecastHeaderConfig>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: {
    title: 'SaaS Projections & Strategy',
    subtitle: 'Model planned MRR growth, hosting server expenses, and sales efficiency runway.',
  },
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: {
    title: 'Architecture Fee & Resource Forecast',
    subtitle: 'Forecast studio drawings invoicing, CAD/BIM software cost trends, and staff labor margins.',
  },
  [IndustryEnum.FINANCIAL_AND_BANKING]: {
    title: 'Asset Yield & Capital Projections',
    subtitle: 'Forecast management fee revenue, brokerage settlement runs, and vault reserve liquidity.',
  },
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: {
    title: 'Fleet Operations Forecast',
    subtitle: 'Model delivery volume scales, fuel index changes, and heavy machinery maintenance runs.',
  },
};

export const FORECAST_KPI_CONFIGS: Partial<Record<IndustryEnum, ForecastKPIConfig[]>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: [
    { key: 'opMargin', label: 'Operating Margin', format: 'percent', icon: 'Coins', trend: '+12.5%', defaultValue: 28.4 },
    { key: 'burnRate', label: 'SaaS Cash Burn Rate', format: 'currency', icon: 'Wallet', trend: '+1.5%', unit: '/ Month', sub: 'Optimal cloud spend' },
    { key: 'runway', label: 'Cash Runway', format: 'text', icon: 'Clock', trend: '-1.2%', isDown: true, sub: '24 months reserve' },
    { key: 'cashInBank', label: 'Sub Bank Today', format: 'currency', icon: 'Landmark', trend: 'Stable', sub: 'Last synced 5m ago' }
  ],
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: [
    { key: 'opMargin', label: 'Project Fee Margin', format: 'percent', icon: 'Coins', trend: '+8.2%', defaultValue: 24.5 },
    { key: 'burnRate', label: 'Drafting Hours Burn', format: 'currency', icon: 'Wallet', trend: '+2.4%', unit: '/ Month', sub: 'Contractor modeling fees' },
    { key: 'runway', label: 'Client Invoicing Runway', format: 'text', icon: 'Clock', trend: '-0.8%', isDown: true, sub: 'Healthy project backlog' },
    { key: 'cashInBank', label: 'Studio Cash in Bank', format: 'currency', icon: 'Landmark', trend: 'Stable', sub: 'Last synced 15m ago' }
  ],
  [IndustryEnum.FINANCIAL_AND_BANKING]: [
    { key: 'opMargin', label: 'Trading Yield Margin', format: 'percent', icon: 'Coins', trend: '+14.1%', defaultValue: 32.8 },
    { key: 'burnRate', label: 'Settlement Capital Burn', format: 'currency', icon: 'Wallet', trend: '+0.5%', unit: '/ Month', sub: 'Exchange clearings' },
    { key: 'runway', label: 'Capital Reserve Runway', format: 'text', icon: 'Clock', trend: 'Stable', sub: 'Within safety thresholds' },
    { key: 'cashInBank', label: 'Vault Reserves today', format: 'currency', icon: 'Landmark', trend: 'Stable', sub: 'Last synced 2m ago' }
  ],
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: [
    { key: 'opMargin', label: 'Operating Margin', format: 'percent', icon: 'Coins', trend: '+12.5%', defaultValue: 28.4 },
    { key: 'burnRate', label: 'Cash Burn Rate', format: 'currency', icon: 'Wallet', trend: '+1.5%', unit: '/ Month', sub: 'Consistent with Q3 Forecast' },
    { key: 'runway', label: 'Cash Runway', format: 'text', icon: 'Clock', trend: '-1.2%', isDown: true, sub: 'Healthy Liquidity Profile' },
    { key: 'cashInBank', label: 'Cash in Bank Today', format: 'currency', icon: 'Landmark', trend: 'Stable', sub: 'Last synced 14m ago' }
  ],
};

export const FORECAST_EXPENSE_CONFIGS: Partial<Record<IndustryEnum, ExpenseItemConfig[]>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: [
    { name: 'R&D Engineering', value: 45, color: '#6366f1' },
    { name: 'S&M (CAC)', value: 25, color: '#f59e0b' },
    { name: 'Cloud Infrastructure', value: 20, color: '#10b981' },
    { name: 'G&A Overhead', value: 10, color: '#ec4899' },
  ],
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: [
    { name: 'Drafting & Modeler Salaries', value: 50, color: '#6366f1' },
    { name: 'CAD/BIM Software License', value: 20, color: '#f59e0b' },
    { name: 'Principal Drawdowns', value: 15, color: '#10b981' },
    { name: 'Project Logistics', value: 15, color: '#ec4899' },
  ],
  [IndustryEnum.FINANCIAL_AND_BANKING]: [
    { name: 'Trading Platform Licences', value: 40, color: '#6366f1' },
    { name: 'Brokerage Clearings', value: 30, color: '#f59e0b' },
    { name: 'Compliance Auditing', value: 20, color: '#10b981' },
    { name: 'Sales & G&A', value: 10, color: '#ec4899' },
  ],
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: [
    { name: 'Utilities Bills & Pay Labour', value: 45, color: '#6366f1' },
    { name: 'Transportation', value: 25, color: '#f59e0b' },
    { name: 'Subscription', value: 20, color: '#10b981' },
    { name: 'Other', value: 10, color: '#ec4899' },
  ],
};

export const FORECAST_COST_DETAILS_CONFIGS: Partial<Record<IndustryEnum, CostDetailItemConfig[]>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: [
    { name: 'Engineering R&D Payroll', value: '$72.5k', trend: '+10.2%', progress: 80, color: '#6366f1', dotColor: '#6366f1' },
    { name: 'AWS & GCP Hosting', value: '$32.2k', trend: '+15.5%', progress: 92, color: '#f59e0b', dotColor: '#f59e0b' },
    { name: 'Sales & Marketing Ads', value: '$40.1k', trend: '+2.1%', progress: 65, color: '#10b981', dotColor: '#10b981' },
    { name: 'Office rent & G&A', value: '$16.2k', trend: 'Stable', progress: 45, color: '#ec4899', dotColor: '#ec4899' },
  ],
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: [
    { name: 'Studio Staff Payroll', value: '$60.5k', trend: '+5.4%', progress: 75, color: '#6366f1', dotColor: '#6366f1' },
    { name: 'Autodesk & BIM Software', value: '$24.2k', trend: '+12.0%', progress: 85, color: '#f59e0b', dotColor: '#f59e0b' },
    { name: 'Principal Drawdowns', value: '$18.0k', trend: 'Stable', progress: 50, color: '#10b981', dotColor: '#10b981' },
    { name: 'Client Travel & Logistics', value: '$12.3k', trend: '+8.1%', progress: 60, color: '#ec4899', dotColor: '#ec4899' },
  ],
  [IndustryEnum.FINANCIAL_AND_BANKING]: [
    { name: 'Platform Terminal Subscriptions', value: '$85.0k', trend: '+4.2%', progress: 88, color: '#6366f1', dotColor: '#6366f1' },
    { name: 'Exchange Execution Charges', value: '$64.2k', trend: '+18.5%', progress: 95, color: '#f59e0b', dotColor: '#f59e0b' },
    { name: 'Risk Compliance & Security', value: '$42.8k', trend: 'Stable', progress: 60, color: '#10b981', dotColor: '#10b981' },
    { name: 'Sales Agent Commissions', value: '$22.1k', trend: '+1.5%', progress: 40, color: '#ec4899', dotColor: '#ec4899' },
  ],
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: [
    { name: 'Utilities Bills & Pay Labour', value: '$14.5k', trend: '+12.5%', progress: 75, color: '#5345cc', dotColor: '#5345cc' },
    { name: 'Transportation', value: '$14.5k', trend: '+12.5%', progress: 70, color: '#f59e0b', dotColor: '#f59e0b' },
    { name: 'Subscription', value: '$14.5k', trend: '+12.5%', progress: 70, color: '#84cc16', dotColor: '#84cc16' },
    { name: 'Other', value: '$14.5k', trend: '+12.5%', progress: 70, color: '#bfdbfe', dotColor: '#5345cc' },
  ],
};

export const FORECAST_AI_INSIGHTS_CONFIGS: Partial<Record<IndustryEnum, AIInsightItemConfig[]>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: [
    { id: '1', title: 'EXPANSION MRR', percentage: '+12.4%', description: 'Upsell campaigns targeting high-tier clients show a +15% conversion lift.', color: '#2563eb', bgColor: '#dbeafe', textColor: '#2563eb' },
    { id: '2', title: 'SERVER COGS ALERT', percentage: '+18.2%', description: 'Cloud infrastructure billing exceeds budget by $12.5K. Optimization is required.', color: '#ef4444', bgColor: '#fee2fee2', textColor: '#ef4444' },
    { id: '3', title: 'R&D PAYROLL', percentage: '-2.1%', description: 'Engineering hiring delayed. General & administrative spends remain within bounds.', color: '#10b981', bgColor: '#dcfce7', textColor: '#10b981' },
  ],
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: [
    { id: '1', title: 'INVOICING RATE', percentage: '+9.5%', description: 'Design stage sign-offs have accelerated client drawdowns for the current phase.', color: '#2563eb', bgColor: '#dbeafe', textColor: '#2563eb' },
    { id: '2', title: 'SOFTWARE OVERHEAD', percentage: '+14.2%', description: 'BIM software licenses renewal added an unexpected $8.2K overhead this quarter.', color: '#ef4444', bgColor: '#fee2fee2', textColor: '#ef4444' },
    { id: '3', title: 'STUDIO OVERHEAD', percentage: 'Stable', description: 'Studio maintenance and rental lease are locked under long-term agreement.', color: '#10b981', bgColor: '#dcfce7', textColor: '#10b981' },
  ],
  [IndustryEnum.FINANCIAL_AND_BANKING]: [
    { id: '1', title: 'MANAGEMENT FEES', percentage: '+14.5%', description: 'AUM growth has driven management fee margins above expectations.', color: '#2563eb', bgColor: '#dbeafe', textColor: '#2563eb' },
    { id: '2', title: 'CLEARING CHARGES', percentage: '+21.5%', description: 'High trading volume led to elevated exchange settlement fees this week.', color: '#ef4444', bgColor: '#fee2fee2', textColor: '#ef4444' },
    { id: '3', title: 'COMPLIANCE AUDIT', percentage: 'Within target', description: 'Regulatory reserves and auditing fees are fully aligned with projections.', color: '#10b981', bgColor: '#dcfce7', textColor: '#10b981' },
  ],
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: [
    { id: '1', title: 'CAPACITY GROWTH', percentage: '+2%', description: 'Achieved 2% of 5% fleet utilization expansion target this month.', color: '#2563eb', bgColor: '#dbeafe', textColor: '#2563eb' },
    { id: '2', title: 'FUEL INDEX SPIKE', percentage: '+12.5%', description: 'Fuel rates rose by 12.5% vs last week, putting pressure on direct costs.', color: '#ef4444', bgColor: '#fee2fee2', textColor: '#ef4444' },
    { id: '3', title: 'DRIVER MAINTENANCE', percentage: 'Stable', description: 'Driver utilization is stable, and maintenance schedule overheads are normal.', color: '#10b981', bgColor: '#dcfce7', textColor: '#10b981' },
  ],
};

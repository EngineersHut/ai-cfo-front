import { IndustryEnum } from './industry';

export interface OperationalKPIConfig {
  key: string;
  label: string;
  sub: string;
  format: 'currency' | 'percent' | 'number' | 'text';
  icon: string;
  trend: string;
  isDownPositive?: boolean;
  noTrendIcon?: boolean;
}

export interface OperationalHeaderConfig {
  title: string;
  subtitle: string;
}

export const OPERATIONAL_HEADER_CONFIGS: Record<IndustryEnum, OperationalHeaderConfig> = {
  [IndustryEnum.TECHNOLOGY_AND_SAAS]: {
    title: 'SaaS Support & Operations',
    subtitle: 'Monitor ticket response times, system uptime, and customer health parameters.',
  },
  [IndustryEnum.ARCHITECTURE_AND_DESIGN]: {
    title: 'Architectural Operations',
    subtitle: 'Track project milestones, architect allocation, and phase submission review speeds.',
  },
  [IndustryEnum.FINANCIAL_SERVICES]: {
    title: 'Financial System Operations',
    subtitle: 'Monitor transaction processing time, settlement efficiency, and audit alerts.',
  },
  [IndustryEnum.FLEET_MANAGEMENT]: {
    title: 'Operational Overview',
    subtitle: 'Track fleet performance, driver logs, delivery success rates, and compliance.',
  },
};

export const OPERATIONAL_KPI_CONFIGS: Record<IndustryEnum, OperationalKPIConfig[]> = {
  [IndustryEnum.TECHNOLOGY_AND_SAAS]: [
    { key: 'activeTickets', label: 'Active Support Tickets', sub: 'vs last week', format: 'number', icon: 'Zap', trend: '-12.5%', isDownPositive: true },
    { key: 'resolutionTime', label: 'Ticket Resolution Time', sub: 'Optimal speed', format: 'text', icon: 'Users', trend: '-15%' },
    { key: 'uptimePercent', label: 'System Uptime %', sub: 'Target: ≥ 99.9%', format: 'percent', icon: 'Clock', trend: 'Stable', noTrendIcon: true },
    { key: 'customerHealth', label: 'Customer Health Score', sub: 'Projected +2%', format: 'number', icon: 'BarChart3', trend: '+4.5%' }
  ],
  [IndustryEnum.ARCHITECTURE_AND_DESIGN]: [
    { key: 'phaseMilestones', label: 'Active Milestones', sub: 'Design phase completion', format: 'number', icon: 'Zap', trend: '+8%' },
    { key: 'architectUtil', label: 'Architect Utilization', sub: 'Optimal billable allocation', format: 'percent', icon: 'Users', trend: 'Stable', noTrendIcon: true },
    { key: 'designSubmissions', label: 'Design Submissions', sub: 'Completed this period', format: 'number', icon: 'Clock', trend: '+15.2%' },
    { key: 'reviewTurnaround', label: 'Review Turnaround Time', sub: 'Average client feedback', format: 'text', icon: 'BarChart3', trend: '-2.4%', isDownPositive: true }
  ],
  [IndustryEnum.FINANCIAL_SERVICES]: [
    { key: 'tradesExecuted', label: 'Executed Transactions', sub: 'Daily trade processing', format: 'number', icon: 'Zap', trend: '+12.5%' },
    { key: 'settlementTime', label: 'Settlement Time (Avg)', sub: 'Transaction clearance', format: 'text', icon: 'Users', trend: '-4.1%', isDownPositive: true },
    { key: 'complianceAlerts', label: 'Compliance Audit Score', sub: 'Target: 100% accuracy', format: 'percent', icon: 'Clock', trend: 'Stable', noTrendIcon: true },
    { key: 'auditAccuracy', label: 'Audit Accuracy Rate', sub: 'Projected +5%', format: 'percent', icon: 'BarChart3', trend: '+9.2%' }
  ],
  [IndustryEnum.FLEET_MANAGEMENT]: [
    { key: 'totalDeliveriesTrips', label: 'Total Deliveries / Trips', sub: 'vs. last month', format: 'number', icon: 'Zap', trend: '+2.4%' },
    { key: 'deliveriesPerVehicle', label: 'Deliveries Per Vehicle', sub: 'Optimal range', format: 'number', icon: 'Users', trend: '+1.2%' },
    { key: 'fleetUtilizationPercent', label: 'Fleet Utilization', sub: 'Across 12 units', format: 'percent', icon: 'Clock', trend: 'Stable', noTrendIcon: true },
    { key: 'driverEfficiency', label: 'Driver Efficiency', sub: 'Projected +5%', format: 'percent', icon: 'BarChart3', trend: '+150K' }
  ],
};

export interface OperationalCoreConfig {
  key: string;
  metric: string;
  sub: string;
  format: 'currency' | 'percent' | 'number' | 'text';
  color: string;
  isDownPositive?: boolean;
}

export const OPERATIONAL_CORE_CONFIGS: Record<IndustryEnum, OperationalCoreConfig[]> = {
  [IndustryEnum.TECHNOLOGY_AND_SAAS]: [
    { key: 'ticketVolume', metric: 'Ticket Volume', sub: 'Completed today', format: 'number', color: '#6366f1', isDownPositive: true },
    { key: 'avgResolution', metric: 'Avg Resolution Time', sub: 'Daily average', format: 'text', color: '#f59e0b', isDownPositive: true },
    { key: 'slaCompliance', metric: 'SLA Compliance %', sub: 'Target: ≥ 95%', format: 'percent', color: '#6366f1' },
    { key: 'supportCsat', metric: 'Support CSAT %', sub: 'Threshold: < 4% negative', format: 'percent', color: '#ef4444', isDownPositive: true }
  ],
  [IndustryEnum.ARCHITECTURE_AND_DESIGN]: [
    { key: 'draftingSpeed', metric: 'Drafting Speed', sub: 'Completed today', format: 'number', color: '#6366f1' },
    { key: 'drawingAccuracy', metric: 'Drawing Accuracy', sub: 'Daily average', format: 'percent', color: '#f59e0b' },
    { key: 'reviewCycles', metric: 'Review Cycles %', sub: 'Target: ≥ 90%', format: 'percent', color: '#6366f1' },
    { key: 'clientApprovals', metric: 'Client Approvals %', sub: 'Threshold: < 2% rejected', format: 'percent', color: '#ef4444', isDownPositive: true }
  ],
  [IndustryEnum.FINANCIAL_SERVICES]: [
    { key: 'processingSpeed', metric: 'Processing Speed', sub: 'Completed today', format: 'text', color: '#6366f1', isDownPositive: true },
    { key: 'auditExceptions', metric: 'Audit Exceptions', sub: 'Daily average', format: 'number', color: '#f59e0b', isDownPositive: true },
    { key: 'ledgerReconciled', metric: 'Ledger Reconciled %', sub: 'Target: ≥ 99%', format: 'percent', color: '#6366f1' },
    { key: 'transactionVolume', metric: 'Transaction Volume %', sub: 'Threshold: < 2% failures', format: 'percent', color: '#ef4444', isDownPositive: true }
  ],
  [IndustryEnum.FLEET_MANAGEMENT]: [
    { key: 'totalDeliveriesTrips', metric: 'Total Deliveries / Trips', sub: 'Completed today', format: 'number', color: '#6366f1' },
    { key: 'deliveriesPerVehicle', metric: 'Deliveries per Vehicle', sub: 'Daily average', format: 'number', color: '#f59e0b' },
    { key: 'onTimeDeliveryPercent', metric: 'On-Time Delivery %', sub: 'Target: ≥ 90%', format: 'percent', color: '#6366f1' },
    { key: 'failedDeliveryPercent', metric: 'Failed Delivery %', sub: 'Threshold: < 2%', format: 'percent', color: '#ef4444', isDownPositive: true }
  ],
};

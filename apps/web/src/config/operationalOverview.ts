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

export const OPERATIONAL_HEADER_CONFIGS: Partial<Record<IndustryEnum, OperationalHeaderConfig>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: {
    title: 'SaaS Support & Operations',
    subtitle: 'Monitor ticket response times, system uptime, and customer health parameters.',
  },
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: {
    title: 'Architectural Operations',
    subtitle: 'Track project milestones, architect allocation, and phase submission review speeds.',
  },
  [IndustryEnum.FINANCIAL_AND_BANKING]: {
    title: 'Financial System Operations',
    subtitle: 'Monitor transaction processing time, settlement efficiency, and audit alerts.',
  },
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: {
    title: 'Operational Overview',
    subtitle: 'Track fleet performance, driver logs, delivery success rates, and compliance.',
  },
};

export const OPERATIONAL_KPI_CONFIGS: Partial<Record<IndustryEnum, OperationalKPIConfig[]>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: [
    { key: 'activeTickets', label: 'Active Support Tickets', sub: 'vs last week', format: 'number', icon: 'Zap', trend: '-12.5%', isDownPositive: true },
    { key: 'resolutionTime', label: 'Ticket Resolution Time', sub: 'Optimal speed', format: 'text', icon: 'Users', trend: '-15%' },
    { key: 'uptimePercent', label: 'System Uptime %', sub: 'Target: ≥ 99.9%', format: 'percent', icon: 'Clock', trend: 'Stable', noTrendIcon: true },
    { key: 'customerHealth', label: 'Customer Health Score', sub: 'Projected +2%', format: 'number', icon: 'BarChart3', trend: '+4.5%' }
  ],
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: [
    { key: 'phaseMilestones', label: 'Active Milestones', sub: 'Design phase completion', format: 'number', icon: 'Zap', trend: '+8%' },
    { key: 'architectUtil', label: 'Architect Utilization', sub: 'Optimal billable allocation', format: 'percent', icon: 'Users', trend: 'Stable', noTrendIcon: true },
    { key: 'designSubmissions', label: 'Design Submissions', sub: 'Completed this period', format: 'number', icon: 'Clock', trend: '+15.2%' },
    { key: 'reviewTurnaround', label: 'Review Turnaround Time', sub: 'Average client feedback', format: 'text', icon: 'BarChart3', trend: '-2.4%', isDownPositive: true }
  ],
  [IndustryEnum.FINANCIAL_AND_BANKING]: [
    { key: 'tradesExecuted', label: 'Executed Transactions', sub: 'Daily trade processing', format: 'number', icon: 'Zap', trend: '+12.5%' },
    { key: 'settlementTime', label: 'Settlement Time (Avg)', sub: 'Transaction clearance', format: 'text', icon: 'Users', trend: '-4.1%', isDownPositive: true },
    { key: 'complianceAlerts', label: 'Compliance Audit Score', sub: 'Target: 100% accuracy', format: 'percent', icon: 'Clock', trend: 'Stable', noTrendIcon: true },
    { key: 'auditAccuracy', label: 'Audit Accuracy Rate', sub: 'Projected +5%', format: 'percent', icon: 'BarChart3', trend: '+9.2%' }
  ],
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: [
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

export const OPERATIONAL_CORE_CONFIGS: Partial<Record<IndustryEnum, OperationalCoreConfig[]>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: [
    { key: 'ticketVolume', metric: 'Ticket Volume', sub: 'Completed today', format: 'number', color: '#6366f1', isDownPositive: true },
    { key: 'avgResolution', metric: 'Avg Resolution Time', sub: 'Daily average', format: 'text', color: '#f59e0b', isDownPositive: true },
    { key: 'slaCompliance', metric: 'SLA Compliance %', sub: 'Target: ≥ 95%', format: 'percent', color: '#6366f1' },
    { key: 'supportCsat', metric: 'Support CSAT %', sub: 'Threshold: < 4% negative', format: 'percent', color: '#ef4444', isDownPositive: true }
  ],
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: [
    { key: 'draftingSpeed', metric: 'Drafting Speed', sub: 'Completed today', format: 'number', color: '#6366f1' },
    { key: 'drawingAccuracy', metric: 'Drawing Accuracy', sub: 'Daily average', format: 'percent', color: '#f59e0b' },
    { key: 'reviewCycles', metric: 'Review Cycles %', sub: 'Target: ≥ 90%', format: 'percent', color: '#6366f1' },
    { key: 'clientApprovals', metric: 'Client Approvals %', sub: 'Threshold: < 2% rejected', format: 'percent', color: '#ef4444', isDownPositive: true }
  ],
  [IndustryEnum.FINANCIAL_AND_BANKING]: [
    { key: 'processingSpeed', metric: 'Processing Speed', sub: 'Completed today', format: 'text', color: '#6366f1', isDownPositive: true },
    { key: 'auditExceptions', metric: 'Audit Exceptions', sub: 'Daily average', format: 'number', color: '#f59e0b', isDownPositive: true },
    { key: 'ledgerReconciled', metric: 'Ledger Reconciled %', sub: 'Target: ≥ 99%', format: 'percent', color: '#6366f1' },
    { key: 'transactionVolume', metric: 'Transaction Volume %', sub: 'Threshold: < 2% failures', format: 'percent', color: '#ef4444', isDownPositive: true }
  ],
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: [
    { key: 'totalDeliveriesTrips', metric: 'Total Deliveries / Trips', sub: 'Completed today', format: 'number', color: '#6366f1' },
    { key: 'deliveriesPerVehicle', metric: 'Deliveries per Vehicle', sub: 'Daily average', format: 'number', color: '#f59e0b' },
    { key: 'onTimeDeliveryPercent', metric: 'On-Time Delivery %', sub: 'Target: ≥ 90%', format: 'percent', color: '#6366f1' },
    { key: 'failedDeliveryPercent', metric: 'Failed Delivery %', sub: 'Threshold: < 2%', format: 'percent', color: '#ef4444', isDownPositive: true }
  ],
};

export interface OperationalSectionConfig {
  costEfficiencyTitle: string;
  costEfficiencyIcon: string;
  utilizationTitle: string;
  utilizationIcon: string;
  performanceTitle: string;
  performanceIcon: string;
  healthMetric1Label: string;
  healthMetric2Label: string;
  healthMetric3Label: string;
}

export const OPERATIONAL_SECTION_CONFIGS: Partial<Record<IndustryEnum, OperationalSectionConfig>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: {
    costEfficiencyTitle: 'SaaS Cost Efficiency',
    costEfficiencyIcon: 'Wallet',
    utilizationTitle: 'Team & Resource Utilization',
    utilizationIcon: 'Users',
    performanceTitle: 'Support Team Performance',
    performanceIcon: 'Zap',
    healthMetric1Label: 'System Uptime',
    healthMetric2Label: 'SLA Success Rate',
    healthMetric3Label: 'Cost Efficiency'
  },
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: {
    costEfficiencyTitle: 'Project Cost Efficiency',
    costEfficiencyIcon: 'DollarSign',
    utilizationTitle: 'Architect & Project Utilization',
    utilizationIcon: 'Clock',
    performanceTitle: 'Architect Performance',
    performanceIcon: 'Award',
    healthMetric1Label: 'Architect Utilization',
    healthMetric2Label: 'Project Success Rate',
    healthMetric3Label: 'Cost Efficiency'
  },
  [IndustryEnum.FINANCIAL_AND_BANKING]: {
    costEfficiencyTitle: 'Operating Cost Efficiency',
    costEfficiencyIcon: 'TrendingDown',
    utilizationTitle: 'System & Fund Utilization',
    utilizationIcon: 'Activity',
    performanceTitle: 'System / Broker Performance',
    performanceIcon: 'ShieldCheck',
    healthMetric1Label: 'System Uptime',
    healthMetric2Label: 'Settlement Rate',
    healthMetric3Label: 'Cost Efficiency'
  },
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: {
    costEfficiencyTitle: 'Cost Efficiency',
    costEfficiencyIcon: 'Truck',
    utilizationTitle: 'Fleet & Driver Utilization',
    utilizationIcon: 'Users',
    performanceTitle: 'Driver Performance',
    performanceIcon: 'Zap',
    healthMetric1Label: 'Fleet Efficiency',
    healthMetric2Label: 'Delivery Success Rate',
    healthMetric3Label: 'Cost Efficiency'
  }
};

export const OPERATIONAL_COST_CONFIGS: Partial<Record<IndustryEnum, OperationalCoreConfig[]>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: [
    { key: 'hostingCost', metric: 'Hosting / Cloud Cost', sub: 'Infrastructure spend', format: 'currency', color: '#6366f1', isDownPositive: true },
    { key: 'supportToolsCost', metric: 'Support Tools Cost', sub: 'Software subscriptions', format: 'currency', color: '#f59e0b', isDownPositive: true },
    { key: 'costPerUser', metric: 'Cost per Active User', sub: 'Average support cost', format: 'currency', color: '#10b981', isDownPositive: true },
    { key: 'onboardingCost', metric: 'Onboarding Cost', sub: 'Average onboarding expense', format: 'currency', color: '#ef4444', isDownPositive: true }
  ],
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: [
    { key: 'softwareLicenseCost', metric: 'Software Licenses Cost', sub: 'CAD & rendering tools', format: 'currency', color: '#6366f1', isDownPositive: true },
    { key: 'materialCost', metric: 'Materials & Printing', sub: 'Model building & print', format: 'currency', color: '#f59e0b', isDownPositive: true },
    { key: 'costPerPhase', metric: 'Cost per Project Phase', sub: 'Average operational spend', format: 'currency', color: '#10b981', isDownPositive: true },
    { key: 'travelCost', metric: 'Site Travel Cost', sub: 'Inspection transport spend', format: 'currency', color: '#ef4444', isDownPositive: true }
  ],
  [IndustryEnum.FINANCIAL_AND_BANKING]: [
    { key: 'clearingFees', metric: 'Clearing & Brokerage Fees', sub: 'Execution fees spend', format: 'currency', color: '#6366f1', isDownPositive: true },
    { key: 'complianceAuditCost', metric: 'Compliance Audit Cost', sub: 'Regulatory audits', format: 'currency', color: '#f59e0b', isDownPositive: true },
    { key: 'systemRunCost', metric: 'System/API Run Cost', sub: 'Feed provider costs', format: 'currency', color: '#10b981', isDownPositive: true },
    { key: 'custodyFees', metric: 'Asset Custody Fees', sub: 'Storage & safekeeping', format: 'currency', color: '#ef4444', isDownPositive: true }
  ],
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: [
    { key: 'fuelCost', metric: 'Fuel Cost', sub: 'Fuel expenditure', format: 'currency', color: '#6366f1', isDownPositive: true },
    { key: 'maintenanceCost', metric: 'Maintenance Cost', sub: 'Vehicle maintenance', format: 'currency', color: '#f59e0b', isDownPositive: true },
    { key: 'costPerTrip', metric: 'Cost per Trip', sub: 'Average cost per delivery', format: 'currency', color: '#10b981', isDownPositive: true },
    { key: 'costPerKm', metric: 'Cost per Km', sub: 'Average cost per kilometer', format: 'currency', color: '#ef4444', isDownPositive: true }
  ]
};

export const OPERATIONAL_UTILIZATION_CONFIGS: Partial<Record<IndustryEnum, OperationalCoreConfig[]>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: [
    { key: 'activeAgents', metric: 'Active Support Agents', sub: 'Agents currently online', format: 'number', color: '#6366f1' },
    { key: 'agentCapacity', metric: 'Agent Utilization %', sub: 'Target: 80-85%', format: 'percent', color: '#10b981' },
    { key: 'serverLoad', metric: 'Avg Server Load %', sub: 'CPU/Memory utilization', format: 'percent', color: '#ef4444', isDownPositive: true },
    { key: 'idleHours', metric: 'System Idle Hours', sub: 'Low traffic periods', format: 'number', color: '#f59e0b', isDownPositive: true }
  ],
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: [
    { key: 'totalArchitects', metric: 'Total Architects', sub: 'Total design team', format: 'number', color: '#6366f1' },
    { key: 'billableHoursPercent', metric: 'Billable Allocation %', sub: 'Target: ≥ 75%', format: 'percent', color: '#10b981' },
    { key: 'nonBillableHoursPercent', metric: 'Admin/Bench Time %', sub: 'Non-billable tasks', format: 'percent', color: '#ef4444', isDownPositive: true },
    { key: 'projectLoad', metric: 'Avg Projects per Architect', sub: 'Project distribution', format: 'number', color: '#f59e0b' }
  ],
  [IndustryEnum.FINANCIAL_AND_BANKING]: [
    { key: 'totalProcessors', metric: 'Total Core Processors', sub: 'Transaction clusters', format: 'number', color: '#6366f1' },
    { key: 'processorLoad', metric: 'Processor Load %', sub: 'Average engine load', format: 'percent', color: '#10b981' },
    { key: 'inactiveChannels', metric: 'Inactive API Gateways', sub: 'Offline bank channels', format: 'number', color: '#ef4444', isDownPositive: true },
    { key: 'fundDeploymentPercent', metric: 'Fund Deployment %', sub: 'Target: ≥ 90%', format: 'percent', color: '#f59e0b' }
  ],
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: [
    { key: 'totalVehicles', metric: 'Total Vehicles', sub: 'Total fleet size', format: 'number', color: '#6366f1' },
    { key: 'activeVehicles', metric: 'Active Vehicles', sub: 'Vehicles currently on road', format: 'number', color: '#10b981' },
    { key: 'inactiveVehicles', metric: 'Inactive Vehicles', sub: 'Vehicles in maintenance or idle', format: 'number', color: '#ef4444', isDownPositive: true },
    { key: 'fleetUtilizationPercent', metric: 'Fleet Utilization %', sub: 'Target: ≥ 85%', format: 'percent', color: '#f59e0b' }
  ]
};

export const OPERATIONAL_PERFORMANCE_CONFIGS: Partial<Record<IndustryEnum, OperationalCoreConfig[]>> = {
  [IndustryEnum.TECHNOLOGY_AND_IT]: [
    { key: 'ticketsResolved', metric: 'Resolved Tickets', sub: 'Completed today', format: 'number', color: '#6366f1' },
    { key: 'avgResponseTime', metric: 'Avg Response Time', sub: 'Optimal response speed', format: 'text', color: '#f59e0b', isDownPositive: true },
    { key: 'slaMetPercent', metric: 'SLA Met %', sub: 'Target: ≥ 95%', format: 'percent', color: '#6366f1' },
    { key: 'escalatedPercent', metric: 'Escalation Rate %', sub: 'Threshold: < 5%', format: 'percent', color: '#ef4444', isDownPositive: true }
  ],
  [IndustryEnum.CONSTRUCTION_AND_INFRASTRUCTURE]: [
    { key: 'milestonesCompleted', metric: 'Completed Milestones', sub: 'Completed today', format: 'number', color: '#6366f1' },
    { key: 'avgRevisionCycles', metric: 'Avg Revision Cycles', sub: 'Target: ≤ 2 cycles', format: 'number', color: '#f59e0b', isDownPositive: true },
    { key: 'onTimeSubmissionPercent', metric: 'On-Time Submission %', sub: 'Target: ≥ 90%', format: 'percent', color: '#6366f1' },
    { key: 'rejectedSubmissionsPercent', metric: 'Client Rejections %', sub: 'Threshold: < 5%', format: 'percent', color: '#ef4444', isDownPositive: true }
  ],
  [IndustryEnum.FINANCIAL_AND_BANKING]: [
    { key: 'transactionsExecuted', metric: 'Executed Transactions', sub: 'Processed today', format: 'number', color: '#6366f1' },
    { key: 'avgSettlementTime', metric: 'Avg Settlement Time', sub: 'Clearance speed', format: 'text', color: '#f59e0b', isDownPositive: true },
    { key: 'reconciliationSuccessPercent', metric: 'Reconciliation Success %', sub: 'Target: 100%', format: 'percent', color: '#6366f1' },
    { key: 'failedTransactionsPercent', metric: 'Failed Transactions %', sub: 'Threshold: < 0.5%', format: 'percent', color: '#ef4444', isDownPositive: true }
  ],
  [IndustryEnum.TRANSPORTATION_AND_LOGISTICS]: [
    { key: 'totalDeliveriesTrips', metric: 'Total Deliveries / Trips', sub: 'Completed today', format: 'number', color: '#6366f1' },
    { key: 'deliveriesPerVehicle', metric: 'Deliveries per Vehicle', sub: 'Daily average', format: 'number', color: '#f59e0b' },
    { key: 'onTimeDeliveryPercent', metric: 'On-Time Delivery %', sub: 'Target: ≥ 90%', format: 'percent', color: '#6366f1' },
    { key: 'failedDeliveryPercent', metric: 'Failed Delivery %', sub: 'Threshold: < 2%', format: 'percent', color: '#ef4444', isDownPositive: true }
  ]
};

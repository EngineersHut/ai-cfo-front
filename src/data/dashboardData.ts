export const revenueData = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 9800, profit: 2000 },
  { name: 'Apr', revenue: 3908, profit: 2780 },
  { name: 'May', revenue: 4800, profit: 1890 },
  { name: 'Jun', revenue: 3800, profit: 2390 },
  { name: 'Jul', revenue: 4300, profit: 3490 },
  { name: 'Aug', revenue: 6300, profit: 4490 },
  { name: 'Sep', revenue: 5300, profit: 3490 },
  { name: 'Oct', revenue: 7300, profit: 5490 },
  { name: 'Nov', revenue: 8300, profit: 6490 },
  { name: 'Dec', revenue: 9300, profit: 7490 },
];

export const healthData = [
  { name: 'POOR', value: 25, color: '#FF6B6B' },
  { name: 'FAIR', value: 25, color: '#FF9F43' },
  { name: 'GOOD', value: 25, color: '#FECA57' },
  { name: 'EXCELLENT', value: 25, color: '#2ECC71' },
];

export const aiInsightsData = [
  {
    id: 1,
    title: 'Bank statements',
    percentage: '(40%)',
    description: 'Revenue growth driven by increased customer retention and reduced churn in the enterprise segment.',
    color: '#2563eb',
    bgColor: '#eff6ff',
    textColor: '#1d4ed8'
  },
  {
    id: 2,
    title: 'Income statements',
    percentage: '(40%)',
    description: 'Revenue growth driven by increased customer retention and reduced churn in the enterprise segment.',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    textColor: '#b45309'
  },
  {
    id: 3,
    title: 'Tax Document',
    percentage: '(10%)',
    description: 'Revenue growth driven by increased customer retention and reduced churn in the enterprise segment.',
    color: '#10b981',
    bgColor: '#ecfdf5',
    textColor: '#047857'
  }
];

export const detailedCostData = {
  summary: [
    { id: 'totalExpenses', label: 'Total Expenses', value: '$320K', trend: '+12.5%', isUp: false },
    { id: 'costRevenue', label: 'Cost of Revenue', value: '40%', trend: '-1.2%', isUp: false },
    { id: 'costClient', label: 'Cost per Client', value: '$120', trend: '+12.5%', isUp: true },
    { id: 'opExpRatio', label: 'Operating Expense Ratio', value: '45%', trend: '-1.2%', isUp: false },
  ],
  breakdown: [
    { metric: 'Total Expenses', value: '$320,000', sub: '40% of revenue', trend: '+3.5%', distribution: 85, color: '#6366f1' },
    { metric: 'Cost % of Revenue', value: '40%', sub: 'Threshold: 35%', trend: '+1.5%', distribution: 40, color: '#f59e0b' },
    { metric: 'Fixed Cost', value: '$120,000', sub: '30% of total', trend: 'Stable', distribution: 30, color: '#6366f1' },
    { metric: 'Variable Cost', value: '$200,000', sub: '70% of total', trend: '-5.2%', distribution: 70, color: '#ef4444' },
  ],
  unitEconomics: [
    { metric: 'Cost per Client', value: '$120', sub: 'Industry avg: $108', trend: '+$12%', distribution: 45, color: '#f59e0b' },
    { metric: 'Cost per Employee', value: '$2,300', sub: 'vs. $2,100 last Q', trend: '+$12%', distribution: 60, color: '#3b82f6' },
    { metric: 'Operating Expense Ratio', value: '45%', sub: 'Target: ≤ 40%', trend: '+$8.5%', distribution: 80, color: '#ef4444' },
  ],
  insights: [
    {
      id: 'opt',
      title: 'Cost Optimization Opportunities',
      icon: 'ShieldCheck',
      color: 'blue',
      points: [
        'Transportation costs increased by 12% this quarter — renegotiate vendor contracts.',
        'Subscription costs are 18% above industry average — audit unused SaaS licenses.',
        'Fixed cost ratio is stable, indicating good overhead discipline.'
      ]
    },
    {
      id: 'eff',
      title: 'Scaling Efficiency',
      icon: 'Zap',
      color: 'blue',
      points: [
        'Revenue growth (+14.2%) is outpacing employee cost growth (+9.5%) — strong leverage.',
        'Operating costs are increasing faster than revenue at mid-tier clients.',
        'Variable cost efficiency can improve by optimising supply chain touchpoints.'
      ]
    },
    {
      id: 'fore',
      title: 'AI Forecast',
      icon: 'Play',
      color: 'blue',
      points: [
        'At current trend, Cost % of Revenue will exceed 44% within 2 quarters.',
        'Reducing variable costs by 8% could recover ~$16K monthly margin.'
      ]
    }
  ]
};

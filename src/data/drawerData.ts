import { DollarSign, TrendingUp, BarChart3, LineChart } from 'lucide-react';

export const drawerGroups = [
  {
    title: 'KPI CARDS',
    sections: [
      {
        id: 'performance',
        title: 'Performance KPIs',
        icon: DollarSign,
        count: '4/4',
        items: [
          { id: 'revenue', icon: '💵', label: 'Revenue', sub: '$128.4K this month' },
          { id: 'profit', icon: '📈', label: 'Net Profit', sub: '$32.8K monthly' },
          { id: 'margin', icon: '⚡', label: 'Profit Margin', sub: '28.4% — with progress bar' },
          { id: 'cash', icon: '🏦', label: 'Cash in Bank', sub: '$1.24M balance' },
        ]
      },
      {
        id: 'financial',
        title: 'Financial KPIs',
        icon: TrendingUp,
        count: '4/4',
        items: [
          { id: 'runway', icon: '⌛', label: 'Cash Runway', sub: '12 months forecast' },
          { id: 'growth', icon: '📊', label: 'Growth %', sub: '18.2% MoM growth' },
          { id: 'ebitda', icon: '💼', label: 'EBITDA', sub: '$45K earnings' },
          { id: 'cashflow', icon: '💸', label: 'Operating Cash Flow', sub: '$22K/month' },
        ]
      }
    ]
  },
  {
    title: 'CHARTS & VISUALS',
    sections: [
      {
        id: 'charts',
        title: 'Charts & Visuals',
        icon: BarChart3,
        count: '2/2',
        items: [
          { id: 'rev-time', icon: '📉', label: 'Revenue Over Time', sub: '12-month line chart' },
          { id: 'health', icon: '🩺', label: 'Financial Health Meter', sub: 'Semi-circular health gauge' },
        ]
      }
    ]
  },
  {
    title: 'DATA SECTIONS',
    sections: [
      {
        id: 'analytics',
        title: 'Analytics & Insights',
        icon: LineChart,
        count: '3/3',
        items: [
          { id: 'expense', icon: '🥧', label: 'Expense Breakdown', sub: 'Donut chart + cost details' },
          { id: 'ai-insights', icon: '✨', label: 'AI Insights', sub: 'AI-generated financial insights' },
          { id: 'efficiency', icon: '📋', label: 'Cost & Efficiency Analysis', sub: 'Detailed metrics + CFO insights' },
        ]
      }
    ]
  }
];

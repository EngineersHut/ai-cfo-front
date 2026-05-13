import { 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  LineChart, 
  Truck, 
  Users, 
  Zap, 
  Clock, 
  Wallet, 
  Activity,
  Briefcase
} from 'lucide-react';

export const drawerGroups = [
  {
    title: 'OPERATIONAL KPIs',
    sections: [
      {
        id: 'ops-metrics',
        title: 'Operations & Fleet',
        icon: Truck,
        count: '4/4',
        items: [
          { id: 'total-trips', icon: '🚚', label: 'Total Deliveries / Trips', sub: 'Healthy Liquidity Profile' },
          { id: 'del-per-veh', icon: '🚛', label: 'Deliveries Per Vehicle', sub: 'Per vehicle daily average' },
          { id: 'fleet-util', icon: '📊', label: 'Fleet Utilization', sub: 'Near-optimal fleet coverage' },
          { id: 'driver-eff', icon: '👤', label: 'Driver Efficiency', sub: 'Performance review score' },
        ]
      }
    ]
  },
  {
    title: 'FINANCIAL KPIs',
    sections: [
      {
        id: 'fin-metrics',
        title: 'Finance & Growth',
        icon: DollarSign,
        count: '4/4',
        items: [
          { id: 'runway', icon: '⏳', label: 'Cash Runway', sub: 'Projected survival time' },
          { id: 'growth', icon: '📈', label: 'Growth %', sub: 'Month-over-month increase' },
          { id: 'ebitda', icon: '💰', label: 'EBITDA', sub: 'Earnings before interest' },
          { id: 'cashflow', icon: '🌊', label: 'Operating Cash Flow', sub: 'Net cash from operations' },
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
  }
];

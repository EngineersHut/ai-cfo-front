import React from 'react';
import { 
    TrendingUp, 
    Users, 
    Target, 
    Zap, 
    ArrowUpRight, 
    BarChart3, 
    LineChart,
    Calendar,
    BarChart,
    DollarSign,
    UserPlus,
    UserCheck,
    Briefcase,
    Banknote,
    Wallet
} from 'lucide-react';

export const growthMetrics = [
    {
        label: 'Monthly Growth %',
        value: '8.5%',
        trend: '+12.5%',
        isUp: true,
        icon: <TrendingUp size={18} />,
        sub: 'Compared to last month'
    },
    {
        label: 'Quarterly Growth',
        value: '18%',
        trend: '+1.5%',
        isUp: true,
        icon: <Calendar size={18} />,
        sub: 'Q2 performance'
    },
    {
        label: 'Year-over-Year Growth',
        value: '32%',
        trend: '-1.2%',
        isUp: false,
        icon: <BarChart size={18} />,
        sub: 'Annual growth rate'
    },
    {
        label: 'Revenue per Client',
        value: '$1,200',
        trend: '+1.5%',
        isUp: true,
        icon: <DollarSign size={18} />,
        sub: 'Average per customer'
    },
];

export const channelGrowthData = [
    {
        metric: 'Organic Search',
        value: '+18.4%',
        sub: 'SEO Performance',
        trend: '+2.5%',
        isUp: true,
        distribution: 85,
        color: '#6366f1' // Indigo
    },
    {
        metric: 'Paid Advertising',
        value: '+32.1%',
        sub: 'ROAS: 4.2x',
        trend: '+5.2%',
        isUp: true,
        distribution: 70,
        color: '#f59e0b' // Amber
    },
    {
        metric: 'Referral Program',
        value: '+12.5%',
        sub: 'Active partners: 142',
        trend: '-1.2%',
        isUp: false,
        distribution: 45,
        color: '#ef4444' // Red
    },
    {
        metric: 'Direct Traffic',
        value: '+8.2%',
        sub: 'Brand awareness',
        trend: '+0.8%',
        isUp: true,
        distribution: 60,
        color: '#10b981' // Emerald
    }
];

export const segmentPerformanceData = [
    {
        metric: 'Enterprise',
        value: '+42%',
        sub: 'High-value focus',
        trend: '+8.4%',
        isUp: true,
        distribution: 95,
        color: '#8b5cf6' // Violet
    },
    {
        metric: 'Mid-Market',
        value: '+22%',
        sub: 'Steady growth',
        trend: '+2.1%',
        isUp: true,
        distribution: 65,
        color: '#3b82f6' // Blue
    },
    {
        metric: 'SMB',
        value: '+14%',
        sub: 'Volume play',
        trend: '-3.2%',
        isUp: false,
        distribution: 40,
        color: '#f97316' // Orange
    },
    {
        metric: 'Self-Service',
        value: '+8%',
        sub: 'Low-touch model',
        trend: '+1.5%',
        isUp: true,
        distribution: 30,
        color: '#06b6d4' // Cyan
    }
];

export const growthHealthData = {
    score: 92,
    status: 'EXCELLENT',
    metrics: [
        { label: 'Growth Efficiency', value: '1.4x' },
        { label: 'CAC Payback', value: '5.2 months' },
        { label: 'Net Retention', value: '114%' }
    ]
};

export const growthTrendData = [
    { name: 'Jan', monthly: 12, revenue: 15, client: 10, target: 8 },
    { name: 'Feb', monthly: 15, revenue: 12, client: 14, target: 8 },
    { name: 'Mar', monthly: 10, revenue: 18, client: 12, target: 8 },
    { name: 'Apr', monthly: 18, revenue: 20, client: 16, target: 8 },
    { name: 'May', monthly: 14, revenue: 16, client: 15, target: 8 },
    { name: 'Jun', monthly: 20, revenue: 22, client: 18, target: 8 },
    { name: 'Jul', monthly: 16, revenue: 18, client: 14, target: 8 },
    { name: 'Aug', monthly: 22, revenue: 25, client: 20, target: 8 },
    { name: 'Sep', monthly: 18, revenue: 21, client: 16, target: 8 },
    { name: 'Oct', monthly: 25, revenue: 28, client: 22, target: 8 },
    { name: 'Nov', monthly: 20, revenue: 24, client: 18, target: 8 },
    { name: 'Dec', monthly: 30, revenue: 32, client: 25, target: 8 },
];

export const additionalGrowthMetrics = [
    {
        label: 'Revenue per Employee',
        value: '$4,500',
        trend: '+12.5%',
        isUp: true,
        icon: <Banknote size={18} />,
        sub: 'Efficiency metric'
    },
    {
        label: 'Employee Growth',
        value: '6%',
        trend: '+12.5%',
        isUp: true,
        icon: <TrendingUp size={18} />,
        sub: 'Team expansion'
    },
    {
        label: 'Client Growth',
        value: '8%',
        trend: '+12.5%',
        isUp: true,
        icon: <Wallet size={18} />,
        sub: 'Retention rate'
    },
];


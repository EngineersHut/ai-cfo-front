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
    Briefcase
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

export const additionalGrowthMetrics = [
    {
        label: 'Revenue per Employee',
        value: '$4,500',
        trend: '+12.5%',
        isUp: true,
        icon: <Briefcase size={18} />,
        sub: 'Efficiency metric'
    },
    {
        label: 'Employee Growth',
        value: '6%',
        trend: '+12.5%',
        isUp: true,
        icon: <UserPlus size={18} />,
        sub: 'Team expansion'
    },
    {
        label: 'Client Growth',
        value: '12%',
        trend: '-1.2%',
        isUp: false,
        icon: <UserCheck size={18} />,
        sub: 'New logos acquired'
    },
];


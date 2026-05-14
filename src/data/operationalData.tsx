import React from 'react';
import { Zap, Users, Clock, BarChart3 } from 'lucide-react';

export const operationalMetrics = [
    {
        label: 'Total Deliveries / Trips',
        value: '94.2%',
        trend: '+2.4%',
        isUp: true,
        icon: <Zap size={18} />,
        sub: 'vs. last month'
    },
    {
        label: 'Deliveries Per Vehicle',
        value: '88.5%',
        trend: '+1.2%',
        isUp: true,
        icon: <Users size={18} />,
        sub: 'Optimal range'
    },
    {
        label: 'Fleet Utilization',
        value: '4.2 days',
        trend: 'Stable',
        isUp: false,
        icon: <Clock size={18} />,
        sub: 'Across 12 units',
        noTrendIcon: true
    },
    {
        label: 'Driver Efficiency',
        value: '1.2M units',
        trend: '+150K',
        isUp: true,
        icon: <BarChart3 size={18} />,
        sub: 'Projected +5%'
    },
];

export const coreOperationsData = [
    {
        metric: 'Total Deliveries / Trips',
        value: '70',
        sub: 'Completed today',
        trend: '+3.5%',
        isUp: true,
        distribution: 100,
        color: '#6366f1' // Purple
    },
    {
        metric: 'Deliveries per Vehicle',
        value: '200',
        sub: 'Daily average',
        trend: '+1.5%',
        isUp: true,
        distribution: 65,
        color: '#f59e0b' // Orange
    },
    {
        metric: 'On-Time Delivery %',
        value: '87.3%',
        sub: 'Target: ≥ 90%',
        trend: '-5.2%',
        isUp: false,
        distribution: 100,
        color: '#6366f1' // Purple
    },
    {
        metric: 'Failed Delivery %',
        value: '3.2%',
        sub: 'Threshold: < 2%',
        trend: '+5.2%', // High failed delivery is bad, so red trend
        isUp: false,
        distribution: 80,
        color: '#ef4444' // Red
    }
];

export const costEfficiencyData = [
    {
        metric: 'Total Deliveries / Trips',
        value: '70',
        sub: 'Completed today',
        trend: '+3.5%',
        isUp: true,
        distribution: 100,
        color: '#6366f1' // Purple
    },
    {
        metric: 'Deliveries per Vehicle',
        value: '200',
        sub: 'Daily average',
        trend: '+1.5%',
        isUp: true,
        distribution: 65,
        color: '#f59e0b' // Orange
    },
    {
        metric: 'On-Time Delivery %',
        value: '87.3%',
        sub: 'Target: ≥ 90%',
        trend: '-5.2%',
        isUp: false,
        distribution: 100,
        color: '#6366f1' // Purple
    },
    {
        metric: 'Failed Delivery %',
        value: '3.2%',
        sub: 'Threshold: < 2%',
        trend: '+5.2%', // High failed delivery is bad, so red trend
        isUp: false,
        distribution: 80,
        color: '#ef4444' // Red
    }
];

export const operationalHealthData = {
    score: 84,
    status: 'EXCELLENT',
    metrics: [
        { label: 'Fleet Efficiency', value: '98%' },
        { label: 'Delivery Success Rate', value: '84%' },
        { label: 'Cost Efficiency', value: '84%' }
    ]
};

export const departmentPerformance = [
    { dept: 'Production', efficiency: 96, health: 'Optimal', load: 82 },
    { dept: 'Logistics', efficiency: 89, health: 'Warning', load: 94 },
    { dept: 'Quality Control', efficiency: 98, health: 'Optimal', load: 75 },
    { dept: 'Supply Chain', efficiency: 85, health: 'Suboptimal', load: 88 },
];

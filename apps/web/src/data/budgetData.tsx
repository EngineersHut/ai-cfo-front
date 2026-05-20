import React from 'react';
import {
    Wallet,
    TrendingDown,
    TrendingUp,
    PieChart,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    AlertCircle,
    CheckCircle2,
    Calendar,
    DollarSign
} from 'lucide-react';

export const budgetMetrics = [
    {
        label: 'Budget Revenue',
        value: '$128.4k',
        trend: 'FY2024',
        isUp: true,
        icon: <TrendingUp size={18} />,
        sub: 'This period'
    },
    {
        label: 'Actual Revenue',
        value: '$115.0k',
        trend: '77.1%',
        isUp: true,
        icon: <Calendar size={18} />,
        sub: 'Reported to date'
    },
    {
        label: 'Revenue Variance',
        value: '-550%',
        trend: 'Within limit',
        isUp: false,
        icon: <BarChart3 size={18} />,
        sub: '-$13.4K vs plan'
    },
    {
        label: 'Over-Budget Items',
        value: '$1200',
        trend: '+4.2%',
        isUp: true,
        icon: <DollarSign size={18} />,
        sub: 'Average per customer'
    },
];

export const departmentBudgetData = [
    {
        category: 'R&D',
        budget: 800000,
        actual: 745000,
        variance: -55000,
        status: 'On Track',
        distribution: 93,
        color: '#6366f1' // Indigo
    },
    {
        category: 'Marketing',
        budget: 500000,
        actual: 512000,
        variance: 12000,
        status: 'Over',
        distribution: 102,
        color: '#f59e0b' // Amber
    },
    {
        category: 'Operations',
        budget: 600000,
        actual: 420000,
        variance: -180000,
        status: 'Under',
        distribution: 70,
        color: '#10b981' // Emerald
    },
    {
        category: 'Sales',
        budget: 400000,
        actual: 385000,
        variance: -15000,
        status: 'On Track',
        distribution: 96,
        color: '#ec4899' // Pink
    },
    {
        category: 'General & Admin',
        budget: 100000,
        actual: 98000,
        variance: -2000,
        status: 'On Track',
        distribution: 98,
        color: '#64748b' // Slate
    }
];

export const budgetTrendData = [
    { name: 'Jan', budget: 200000, actual: 185000 },
    { name: 'Feb', budget: 200000, actual: 198000 },
    { name: 'Mar', budget: 200000, actual: 210000 },
    { name: 'Apr', budget: 200000, actual: 190000 },
    { name: 'May', budget: 200000, actual: 175000 },
    { name: 'Jun', budget: 200000, actual: 182000 }
];

export const varianceAnalysisData = [
    {
        metric: 'Cloud Infrastructure',
        value: '+$42,000',
        sub: 'AWS Scaling',
        trend: 'Warning',
        isUp: true,
        distribution: 85,
        color: '#ef4444' // Red
    },
    {
        metric: 'Travel & Expenses',
        value: '-$12,500',
        sub: 'Remote policy',
        trend: 'Efficient',
        isUp: false,
        distribution: 45,
        color: '#10b981' // Emerald
    },
    {
        metric: 'Legal Fees',
        value: '+$8,000',
        sub: 'Patent filing',
        trend: 'Neutral',
        isUp: true,
        distribution: 60,
        color: '#3b82f6' // Blue
    }
];

export const budgetSummaryData = [
    {
        metric: 'Revenue',
        budget: 128400,
        actual: 115000,
        variance: -10.4,
        notes: 'Monthly revenue target'
    },
    {
        metric: 'Direct Costs',
        budget: 40500,
        actual: 44800,
        variance: 10.6,
        notes: 'COGS + variable costs'
    },
    {
        metric: 'Operating Expenses',
        budget: 52800,
        actual: 58200,
        variance: 10.2,
        notes: 'All operating expenditures'
    },
    {
        metric: 'Gross Profit',
        budget: 87900,
        actual: 70200,
        variance: -20.1,
        notes: 'Revenue - Direct Costs',
        isAutoComputed: true
    },
    {
        metric: 'Net Margin',
        budget: 27.3,
        actual: 10.4,
        variance: -61.8,
        notes: '(Net Profit ÷ Revenue) × 100',
        isAutoComputed: true,
        isPercentage: true
    }
];

export const budgetPlanningData = [
    {
        category: 'REVENUE',
        items: [
            { id: 1, metric: 'Forecast Revenue', amount: 145000, percentage: 100 }
        ]
    },
    {
        category: 'DIRECT & VARIABLE COSTS',
        items: [
            { id: 2, metric: 'Variable Costs', amount: 28500, percentage: 19.7 },
            { id: 3, metric: 'Logistics Costs', amount: 12200, percentage: 8.4 }
        ]
    },
    {
        category: 'OPERATING EXPENSES',
        items: [
            { id: 4, metric: 'Operating Expenses', amount: 18400, percentage: 12.7 },
            { id: 5, metric: 'Sales & Marketing', amount: 14200, percentage: 9.8 },
            { id: 6, metric: 'General & Admin', amount: 8600, percentage: 5.9 },
            { id: 7, metric: 'Financial Costs', amount: 3200, percentage: 2.2 },
            { id: 8, metric: 'Hiring & HR', amount: 6800, percentage: 4.7 }
        ]
    },
    {
        category: 'GROWTH & EXPANSION',
        items: [
            { id: 9, metric: 'Operations Expansion', amount: 9500, percentage: 6.6 },
            { id: 10, metric: 'CAPEX', amount: 12000, percentage: 8.3 },
            { id: 11, metric: 'Financing', amount: 4800, percentage: 3.3 }
        ]
    },
    {
        category: 'LEADERSHIP & COMPLIANCE',
        items: [
            { id: 12, metric: 'Leadership Costs', amount: 8200, percentage: 5.7 },
            { id: 13, metric: 'Compliance', amount: 2400, percentage: 1.7 }
        ]
    },
    {
        category: 'FINANCIAL SUMMARY',
        isSummary: true,
        items: [
            { 
                id: 'Σ', 
                metric: 'Forecast Profit', 
                sub: 'Revenue - All Expenses',
                amount: 16200, 
                percentage: 11.2,
                isHighlight: true 
            },
            { id: 14, metric: 'Forecast Cash Position', amount: 32800, percentage: null },
            { id: 15, metric: 'Expected Growth Rate', amount: 18.2, percentage: null, isPercentageValue: true }
        ]
    }
];

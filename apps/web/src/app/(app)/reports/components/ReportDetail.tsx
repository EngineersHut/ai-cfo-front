"use client";

import React, { useEffect } from 'react';
import {
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    DollarSign,
    Wallet,
    PieChart,
    Activity,
    ArrowLeft,
    Sparkles,
    Table
} from 'lucide-react';
import KPICard from '@/components/common/KPICard';
import {
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
    XAxis,
    YAxis
} from 'recharts';
import { useDispatch, useSelector } from '@/store';
import { 
    getReportDetail, 
    clearReportDetail, 
    getReportRevenueTrend, 
    getReportExpenseBreakdown 
} from '@/store/slices/report';
import { REPORTS_KPI_CONFIGS, IndustryEnum } from '@/config/industryConfig';
import * as LucideIcons from 'lucide-react';

interface ReportDetailProps {
    reportId?: string;
    onBack: () => void;
}

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
        return dateStr;
    }
};

const formatMonthYear = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch (e) {
        return dateStr;
    }
};

const formatYAxisValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return String(value);
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

export default function ReportDetail({ reportId, onBack }: ReportDetailProps) {
    const [revenueTimeframe, setRevenueTimeframe] = React.useState<'Weekly' | 'Monthly'>('Monthly');
    const [expenseTimeframe, setExpenseTimeframe] = React.useState<'Weekly' | 'Monthly'>('Monthly');
    const [companyType, setCompanyType] = React.useState<string>(IndustryEnum.TRANSPORTATION_AND_LOGISTICS);
    const [isMounted, setIsMounted] = React.useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const savedType = localStorage.getItem('selectedCompanyType');
        if (savedType) {
            setCompanyType(savedType);
        }
    }, []);

    const dispatch = useDispatch();
    const { reportDetail, revenueTrend, expenseBreakdown, loading } = useSelector((state) => state.report);

    useEffect(() => {
        if (reportId) {
            dispatch(getReportDetail(reportId));
        }
        return () => {
            dispatch(clearReportDetail());
        };
    }, [reportId, dispatch]);

    useEffect(() => {
        if (reportId) {
            dispatch(getReportRevenueTrend(reportId, revenueTimeframe));
        }
    }, [reportId, revenueTimeframe, dispatch]);

    useEffect(() => {
        if (reportId) {
            dispatch(getReportExpenseBreakdown(reportId, expenseTimeframe));
        }
    }, [reportId, expenseTimeframe, dispatch]);

    if (loading || !reportDetail) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="text-[14px] font-normal text-slate-500 font-inter">Loading report details...</p>
            </div>
        );
    }

    const { reportInfo, summaryCards, aiInsights, comparisonWithPreviousPeriod, rawDataTable } = reportDetail;

    const totalRevenue = summaryCards?.totalRevenue ?? 0;
    const totalExpenses = summaryCards?.totalExpenses ?? 0;
    const netProfit = summaryCards?.netProfit ?? 0;
    const profitMargin = summaryCards?.profitMargin ?? 0;

    const currentKPIs = REPORTS_KPI_CONFIGS[companyType as IndustryEnum] ?? REPORTS_KPI_CONFIGS[IndustryEnum.TRANSPORTATION_AND_LOGISTICS] ?? [];

    const getIcon = (iconName: string) => {
        const IconComp = (LucideIcons as any)[iconName];
        if (IconComp) return <IconComp size={16} />;
        return <LucideIcons.Activity size={16} />;
    };

    const getKpiValue = (key: string, format: string) => {
        let val = 0;
        if (key === 'totalRevenue') val = totalRevenue;
        else if (key === 'netProfit') val = netProfit;
        else if (key === 'totalExpenses') val = totalExpenses;
        else if (key === 'profitMargin') return `${profitMargin.toFixed(1)}%`;
        
        if (format === 'currency') {
            return formatCurrency(val);
        }
        if (format === 'percent') {
            return `${val.toFixed(1)}%`;
        }
        return String(val);
    };

    const getTrendValue = (key: string) => {
        if (key === 'totalRevenue') return revenueChange !== 0 ? `${revenueChange >= 0 ? '+' : ''}${revenueChange}%` : undefined;
        if (key === 'netProfit') return profitChange !== 0 ? `${profitChange >= 0 ? '+' : ''}${profitChange}%` : undefined;
        if (key === 'totalExpenses') return expenseChange !== 0 ? `${expenseChange >= 0 ? '+' : ''}${expenseChange}%` : undefined;
        return undefined;
    };

    const getIsDownTrend = (key: string) => {
        if (key === 'totalRevenue') return revenueChange < 0;
        if (key === 'netProfit') return profitChange < 0;
        if (key === 'totalExpenses') return expenseChange > 0;
        return false;
    };

    // Use filtered APIs values, falling back to base reportDetail property if not fetched yet
    const currentRevenueTrend = revenueTrend?.revenueTrend || reportDetail?.revenueTrend || [];
    const mappedRevenueData = currentRevenueTrend.map((item: any) => ({
        name: item.month || item.name || item.date || '',
        revenue: item.revenue ?? 0,
        netProfit: item.netProfit ?? item.profit ?? 0
    }));

    const currentExpenseBreakdown = expenseBreakdown?.expenseBreakdown || reportDetail?.expenseBreakdown || [];
    const mappedExpenses = currentExpenseBreakdown.map((item: any, index: number) => ({
        name: item.category || item.name || 'Expense',
        value: item.percentage ?? item.value ?? 0,
        amount: item.amount ?? 0,
        color: item.color || ['#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#a855f7', '#06b6d4'][index % 6]
    }));

    const sumOfBreakdown = mappedExpenses.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
    const displayTotalExpenses = sumOfBreakdown > 0 ? sumOfBreakdown : totalExpenses;

    const mappedRawTable = (rawDataTable || []).map((row: any) => ({
        category: row.category || row.name || 'N/A',
        value: row.value !== undefined ? (typeof row.value === 'number' ? `$${row.value.toLocaleString()}` : String(row.value)) : (row.amount !== undefined ? `$${row.amount.toLocaleString()}` : '$0'),
        percent: row.percent || (row.percentage !== undefined ? `${row.percentage}%` : '0%'),
        status: row.status || 'Completed',
        note: row.note || ''
    }));

    const getStatusBadge = (status: string) => {
        const s = status?.toLowerCase() || '';
        if (s === 'processed' || s === 'completed' || s === 'success') {
            return (
                <div className="px-3 py-1 bg-[#f0fdf4] dark:bg-green-900/30 border border-[#dcfce7] dark:border-green-800 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                    <span className="text-[11px] font-bold text-[#166534] dark:text-green-400 font-inter uppercase tracking-wider">Processed</span>
                </div>
            );
        }
        if (s === 'processing' || s === 'pending') {
            return (
                <div className="px-3 py-1 bg-[#fffbeb] dark:bg-amber-900/30 border border-[#fef3c7] dark:border-amber-800 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-pulse" />
                    <span className="text-[11px] font-bold text-[#b45309] dark:text-amber-400 font-inter uppercase tracking-wider">Processing</span>
                </div>
            );
        }
        return (
            <div className="px-3 py-1 bg-[#fef2f2] dark:bg-red-900/30 border border-[#fee2e2] dark:border-red-800 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                <span className="text-[11px] font-bold text-[#b91c1c] dark:text-red-400 font-inter uppercase tracking-wider">{status || 'Failed'}</span>
            </div>
        );
    };

    const revenueChange = comparisonWithPreviousPeriod?.revenueChangePercent ?? 0;
    const expenseChange = comparisonWithPreviousPeriod?.expenseChangePercent ?? 0;
    const profitChange = comparisonWithPreviousPeriod?.profitChangePercent ?? 0;

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="flex items-center">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-800 text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-[0px_2px_4px_0px_rgba(0,0,0,0.06)] font-inter"
                >
                    <ArrowLeft size={16} />
                    Back to Reports
                </button>
            </div>

            <div className="w-full bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-8 sm:gap-16">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 font-inter uppercase tracking-wider">Period</p>
                        <p className="text-[14px] sm:text-[16px] font-medium text-slate-800 dark:text-slate-100 font-inter">
                            {formatMonthYear(reportInfo?.periodStartDate) || 'N/A'}
                        </p>
                    </div>
                    <div className="hidden sm:block w-[1px] h-10 bg-slate-100 dark:bg-slate-700" />
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 font-inter uppercase tracking-wider">Type</p>
                        <p className="text-[14px] sm:text-[16px] font-medium text-slate-800 dark:text-slate-100 font-inter capitalize">
                            {reportInfo?.type ? reportInfo.type.replace(/_/g, ' ') : 'N/A'}
                        </p>
                    </div>
                    <div className="hidden sm:block w-[1px] h-10 bg-slate-100 dark:bg-slate-700" />
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 font-inter uppercase tracking-wider">Range</p>
                        <p className="text-[14px] sm:text-[16px] font-medium text-slate-800 dark:text-slate-100 font-inter">
                            {reportInfo?.periodStartDate ? `${formatDate(reportInfo.periodStartDate)} – ${formatDate(reportInfo.periodEndDate)}` : 'N/A'}
                        </p>
                    </div>
                </div>

                {getStatusBadge(reportInfo?.status)}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentKPIs.map((kpi) => (
                    <KPICard
                        key={kpi.key}
                        icon={getIcon(kpi.icon)}
                        label={kpi.label}
                        value={getKpiValue(kpi.key, kpi.format)}
                        trend={getTrendValue(kpi.key)}
                        sub={kpi.sub}
                        isDown={getIsDownTrend(kpi.key)}
                        noTrendIcon={kpi.key === 'profitMargin'}
                    />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Revenue Over Time Chart */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                    <div className="h-[54px] flex items-center justify-between p-[12px] border-b border-slate-50 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300">
                                <DollarSign size={16} />
                            </div>
                            <h3 className="text-[16px] font-normal text-[#0f172a] dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">Revenue Over Time</h3>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setRevenueTimeframe('Weekly')}
                                className={`w-[72px] h-[30px] px-[12px] py-[5px] flex items-center justify-center gap-[6px] rounded-[8px] text-[12px] font-medium transition-all duration-200 ${revenueTimeframe === 'Weekly'
                                    ? 'bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)]'
                                    : 'bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-600 text-slate-500 dark:text-slate-400 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                Weekly
                            </button>
                            <button
                                onClick={() => setRevenueTimeframe('Monthly')}
                                className={`w-[72px] h-[30px] px-[12px] py-[5px] flex items-center justify-center gap-[6px] rounded-[8px] text-[12px] font-medium transition-all duration-200 ${revenueTimeframe === 'Monthly'
                                    ? 'bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)]'
                                    : 'bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-600 text-slate-500 dark:text-slate-400 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>
                    <div className="h-[300px] sm:h-[492px] w-full relative py-[12px] px-[16px] flex flex-col gap-[12px]">
                        <div className="flex-1 w-full relative rounded-[10px] border border-[rgba(26,21,83,0.08)] dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/50 flex flex-col overflow-hidden">
                            <div className="flex-1 w-full relative min-h-[200px]">
                                {isMounted && mappedRevenueData.length > 0 ? (
                                    <div className="absolute inset-2 min-h-0 min-w-0">
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                            <AreaChart data={mappedRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                                    tickFormatter={formatYAxisValue}
                                                />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    stroke="#8b5cf6"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorRevenue)"
                                                    activeDot={{ r: 6, fill: "#fff", stroke: "#8b5cf6", strokeWidth: 3 }}
                                                />
                                                {mappedRevenueData.some((d: any) => d.netProfit !== 0) && (
                                                    <Area
                                                        type="monotone"
                                                        dataKey="netProfit"
                                                        stroke="#fbbf24"
                                                        strokeWidth={3}
                                                        fillOpacity={1}
                                                        fill="url(#colorProfit)"
                                                        activeDot={{ r: 6, fill: "#fff", stroke: "#fbbf24", strokeWidth: 3 }}
                                                    />
                                                )}
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                        <DollarSign size={40} className="mb-2 text-slate-300" />
                                        <span className="text-[13px] font-medium font-inter">No trend data available</span>
                                    </div>
                                )}
                            </div>

                            {/* Chart Legend - Styled inside the inner box */}
                            {mappedRevenueData.length > 0 && (
                                <div className="flex items-center justify-center gap-8 py-3 bg-white dark:bg-slate-800 border-t border-[rgba(26,21,83,0.08)] dark:border-slate-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
                                        <span className="text-[14px] font-normal text-slate-500 dark:text-slate-400 font-inter leading-[132%] capitalize tracking-[0%]">Revenue</span>
                                    </div>
                                    {mappedRevenueData.some((d: any) => d.netProfit !== 0) && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                                            <span className="text-[14px] font-normal text-slate-500 dark:text-slate-400 font-inter leading-[132%] capitalize tracking-[0%]">Net Profit</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Expense Breakdown Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                    <div className="h-[54px] flex items-center justify-between p-[12px] border-b border-slate-50 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300">
                                <PieChart size={16} />
                            </div>
                            <h3 className="text-[16px] font-normal text-[#0f172a] dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">Expense Breakdown</h3>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setExpenseTimeframe('Weekly')}
                                className={`w-[72px] h-[30px] px-[12px] py-[5px] flex items-center justify-center gap-[6px] rounded-[8px] text-[12px] font-medium transition-all duration-200 ${expenseTimeframe === 'Weekly'
                                    ? 'bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)]'
                                    : 'bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-600 text-slate-500 dark:text-slate-400 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                Weekly
                            </button>
                            <button
                                onClick={() => setExpenseTimeframe('Monthly')}
                                className={`w-[72px] h-[30px] px-[12px] py-[5px] flex items-center justify-center gap-[6px] rounded-[8px] text-[12px] font-medium transition-all duration-200 ${expenseTimeframe === 'Monthly'
                                    ? 'bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)]'
                                    : 'bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-600 text-slate-500 dark:text-slate-400 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-between h-[360px]">
                        {mappedExpenses.length > 0 ? (
                            <>
                                <div className="relative w-full h-[200px] flex items-center justify-center">
                                    {isMounted && (
                                        <ResponsiveContainer width="100%" height={200} minWidth={0} minHeight={0}>
                                            <RePieChart>
                                                <Pie
                                                    data={mappedExpenses}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={50}
                                                    outerRadius={75}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {mappedExpenses.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value: any, name: any, props: any) => {
                                                    const amount = props.payload?.amount;
                                                    return [amount > 0 ? `${Number(value).toFixed(1)}% (${formatCurrency(amount)})` : `${Number(value).toFixed(1)}%`, name];
                                                }} />
                                            </RePieChart>
                                        </ResponsiveContainer>
                                    )}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-5px]">
                                        <span className="text-[12px] text-slate-400 font-medium font-inter">Total</span>
                                        <span className="text-[22px] font-bold text-slate-800 dark:text-slate-100 font-inter leading-none">
                                            {formatCurrency(displayTotalExpenses)}
                                        </span>
                                    </div>
                                </div>

                                {/* Custom Legend */}
                                <div className="grid grid-cols-2 gap-x-2 gap-y-3 w-full max-h-[140px] overflow-y-auto no-scrollbar mt-2">
                                    {mappedExpenses.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                            <span className="text-[13px] font-medium text-[#0a092e] dark:text-slate-200 font-inter leading-[20px] tracking-[0%] truncate">
                                                {item.name} ({Number(item.value).toFixed(1)}% {item.amount > 0 ? `- ${formatCurrency(item.amount)}` : ''})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <PieChart size={40} className="mb-2 text-slate-300" />
                                <span className="text-[13px] font-medium font-inter">No breakdown available</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Insights and Comparison Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* AI Insights */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                    <div className="h-[54px] flex items-center p-[12px] gap-3 border-b border-slate-50 dark:border-slate-700">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300">
                            <Sparkles size={16} />
                        </div>
                        <h3 className="text-[16px] font-normal text-[#0f172a] dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">AI Insights</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {aiInsights && aiInsights.length > 0 ? (
                            aiInsights.map((insight: any, idx: number) => {
                                const borderColors: any = {
                                    neutral: 'bg-blue-500',
                                    warning: 'bg-amber-500',
                                    danger: 'bg-red-500',
                                    positive: 'bg-green-500',
                                    success: 'bg-green-500',
                                };
                                const bgColors: any = {
                                    neutral: 'bg-[#eff6ff] dark:bg-blue-900/30 text-[#2563eb] dark:text-blue-400',
                                    warning: 'bg-[#fffbeb] dark:bg-amber-900/30 text-[#f59e0b] dark:text-amber-400',
                                    danger: 'bg-[#fef2f2] dark:bg-red-900/30 text-[#ef4444] dark:text-red-400',
                                    positive: 'bg-[#f0fdf4] dark:bg-green-900/30 text-[#22c55e] dark:text-green-400',
                                    success: 'bg-[#f0fdf4] dark:bg-green-900/30 text-[#22c55e] dark:text-green-400',
                                };
                                const type = insight.type || 'neutral';
                                return (
                                    <div key={idx} className="flex gap-4">
                                        <div className={`w-1 ${borderColors[type] || 'bg-slate-400'} rounded-full shrink-0`} />
                                        <div className="space-y-2">
                                            <span className={`px-2 py-0.5 ${bgColors[type] || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'} text-[11px] font-bold rounded-[4px] font-inter`}>
                                                {insight.title || 'Insight'}
                                            </span>
                                            <p className="text-[14px] text-slate-600 dark:text-slate-300 font-inter leading-[22px]">
                                                {insight.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400 h-full min-h-[150px]">
                                <Sparkles size={32} className="mb-2 text-slate-300" />
                                <span className="text-[13px] font-medium font-inter">No insights generated yet</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Comparison Card */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                    <div className="h-[54px] flex items-center p-[12px] gap-3 border-b border-slate-50 dark:border-slate-700">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300">
                            <TrendingUp size={16} />
                        </div>
                        <h3 className="text-[16px] font-normal text-[#0f172a] dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">Comparison with Prev. Period</h3>
                    </div>
                    <div className="px-[33px] py-[16px] space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] font-normal text-[#0f172a] dark:text-slate-200 font-inter leading-[20px] tracking-[0%]">Revenue</span>
                            <div className={`flex items-center gap-2 ${revenueChange >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                                {revenueChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                <span className="text-[14px] font-bold font-inter">{Math.abs(revenueChange)}%</span>
                            </div>
                        </div>
                        <div className="w-full h-[1px] bg-slate-50 dark:bg-slate-700" />
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] font-normal text-[#0f172a] dark:text-slate-200 font-inter leading-[20px] tracking-[0%]">Profit</span>
                            <div className={`flex items-center gap-2 ${profitChange >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                                {profitChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                <span className="text-[14px] font-bold font-inter">{Math.abs(profitChange)}%</span>
                            </div>
                        </div>
                        <div className="w-full h-[1px] bg-slate-50 dark:bg-slate-700" />
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] font-normal text-[#0f172a] dark:text-slate-200 font-inter leading-[20px] tracking-[0%]">Expenses</span>
                            <div className={`flex items-center gap-2 ${expenseChange <= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                                {expenseChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                <span className="text-[14px] font-bold font-inter">{Math.abs(expenseChange)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Raw Data Table Section */}
            <div className="bg-white dark:bg-slate-800 rounded-[12px] border border-[#f2f2f3] dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                <div className="h-[54px] flex items-center p-[12px] gap-3 border-b border-[#f2f2f3] dark:border-slate-700 bg-white dark:bg-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300">
                        <Table size={16} />
                    </div>
                    <h3 className="text-[16px] font-normal text-[#0f172a] dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">Raw Data Table</h3>
                </div>
                <div className="p-[16px]">
                    <div className="rounded-[12px] overflow-x-auto no-scrollbar">
                        <table className="w-full min-w-[800px] text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-[#e2e8f0] dark:border-slate-600 h-[54px]">
                                    <th className="w-[208px] px-6 py-4 text-[13px] font-medium text-slate-400 font-inter border-r border-[#e2e8f0] dark:border-slate-600">Category</th>
                                    <th className="w-[175px] px-6 py-4 text-[13px] font-medium text-slate-400 font-inter border-r border-[#e2e8f0] dark:border-slate-600 text-center">Value</th>
                                    <th className="w-[175px] px-6 py-4 text-[13px] font-medium text-slate-400 font-inter border-r border-[#e2e8f0] dark:border-slate-600 text-center">% Of Total</th>
                                    <th className="w-[223px] px-6 py-4 text-[13px] font-medium text-slate-400 font-inter text-center">Tags</th>
                                    <th className="w-[347px] px-6 py-4 text-[13px] font-medium text-slate-400 font-inter">Note</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e2e8f0] dark:divide-slate-700 border border-[#e2e8f0] dark:border-slate-700">
                                {mappedRawTable.length > 0 ? (
                                    mappedRawTable.map((row: any, idx: number) => (
                                        <tr key={idx} className="h-[54px]">
                                            <td className="w-[208px] px-6 py-4 text-[14px] font-bold text-slate-700 dark:text-slate-200 font-inter border-r border-[#e2e8f0] dark:border-slate-700">
                                                {row.category}
                                            </td>
                                            <td className="w-[175px] px-6 py-4 text-[14px] font-medium text-slate-600 dark:text-slate-300 font-inter border-r border-[#e2e8f0] dark:border-slate-700 text-center">
                                                {row.value}
                                            </td>
                                            <td className="w-[175px] px-6 py-4 text-[14px] font-medium text-slate-600 dark:text-slate-300 font-inter border-r border-[#e2e8f0] dark:border-slate-700 text-center">
                                                {row.percent}
                                            </td>
                                            <td className="w-[223px] px-6 py-4 border-r border-[#e2e8f0] dark:border-slate-700 text-center">
                                                <div className="flex justify-center">
                                                    <span className={`inline-flex items-center gap-[2px] w-[97px] h-[20px] pt-[2px] pr-[6px] pb-[2px] pl-[4px] border rounded-[4px] font-inter text-[10px] font-bold ${row.status === 'Completed' || row.status === 'Processed'
                                                        ? 'bg-[#f2fffa] dark:bg-green-900/30 border-[#bee5d0] dark:border-green-800 text-[#16a34a] dark:text-green-400'
                                                        : 'bg-[#fef2f2] dark:bg-red-900/30 border-[#fee2f2] dark:border-red-800 text-[#dc2626] dark:text-red-400'
                                                        }`}>
                                                        {row.status} <Activity size={10} />
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="w-[347px] px-6 py-4 text-[14px] font-normal text-[#0b1c30] dark:text-slate-300 font-inter leading-[20px] tracking-[0%]">
                                                {row.note}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-inter text-[14px]">
                                            No raw table data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

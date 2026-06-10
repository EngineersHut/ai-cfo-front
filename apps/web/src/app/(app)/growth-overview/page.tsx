"use client";

import React, { useState } from 'react';
import {
    TrendingUp,
    Users,
    Target,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Pin,
    BarChart3,
    LineChart,
    PieChart as PieChartIcon,
    ArrowRight,
    Briefcase,
    AreaChart as AreaChartIcon,
    Calendar,
    BarChart,
    DollarSign,
    Banknote,
    Wallet
} from 'lucide-react';
import {
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Area,
    AreaChart
} from 'recharts';
import KPICard from '@/components/common/KPICard';
import DetailedMetricsCard from '@/components/common/DetailedMetricsCard';
import { healthData, revenueData } from '@/data/dashboardData';
import AIInsights from '../dashboard/components/AIInsights';
import { useDispatch, useSelector } from '@/store';
import { fetchGrowthData } from '@/store/slices/growth';
import { useEffect } from 'react';
import { IndustryEnum, GROWTH_KPI_CONFIGS, GROWTH_ADDITIONAL_KPI_CONFIGS, GROWTH_HEADER_CONFIGS } from '@/config/industryConfig';
import * as LucideIcons from 'lucide-react';

// Custom Gauge Components
const RADIAN = Math.PI / 180;
const NeedleLayer = ({ value, cx, cy, iR, oR }: any) => {
    const ang = 180.0 * (1 - value / 100);
    const length = oR + 15;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 8;
    const x0 = cx;
    const y0 = cy;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return (
        <svg className="absolute inset-0 pointer-events-none z-50 w-full h-full">
            <g>
                <circle cx={x0} cy={y0} r={r + 4} fill="#1a2153" stroke="none" />
                <path d={`M${xba} ${yba}L${xbb} ${ybb}L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill="#1a2153" />
                <circle cx={x0} cy={y0} r={3} fill="#fff" stroke="none" />
            </g>
        </svg>
    );
};

const renderOuterLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, name } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-RADIAN * midAngle);
    const y = cy + radius * Math.sin(-RADIAN * midAngle);

    return (
        <text
            x={x}
            y={y}
            fill="#1a2153"
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[11px] font-bold tracking-tight font-inter"
            style={{ transform: `rotate(${90 - midAngle}deg)`, transformOrigin: `${x}px ${y}px` }}
        >
            {name}
        </text>
    );
};

const IconMap: any = {
    TrendingUp: <TrendingUp size={18} />,
    Calendar: <Calendar size={18} />,
    BarChart: <BarChart size={18} />,
    DollarSign: <DollarSign size={18} />,
    Banknote: <Banknote size={18} />,
    Wallet: <Wallet size={18} />,
    Zap: <Zap size={18} />,
    Target: <Target size={18} />
};

export default function GrowthOverview() {
    const [timeframe, setTimeframe] = useState('Quarterly');
    const [activeChart, setActiveChart] = useState('line');

    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.growth);
    const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
    const [companyType, setCompanyType] = useState<string>(IndustryEnum.FLEET_MANAGEMENT);

    useEffect(() => {
        const savedCompanyId = localStorage.getItem('selectedCompany');
        if (savedCompanyId) {
            setCurrentCompanyId(savedCompanyId);
        }
        const savedType = localStorage.getItem('selectedCompanyType');
        if (savedType) {
            setCompanyType(savedType);
        }

        const interval = setInterval(() => {
            const savedId = localStorage.getItem('selectedCompany');
            if (savedId !== currentCompanyId) {
                setCurrentCompanyId(savedId);
            }
            const savedTypeVal = localStorage.getItem('selectedCompanyType');
            if (savedTypeVal && savedTypeVal !== companyType) {
                setCompanyType(savedTypeVal);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentCompanyId, companyType]);

    useEffect(() => {
        if (currentCompanyId) {
            dispatch(fetchGrowthData(currentCompanyId, timeframe));
        }
    }, [currentCompanyId, timeframe, dispatch]);

    const activeHeader = GROWTH_HEADER_CONFIGS[companyType as IndustryEnum] || GROWTH_HEADER_CONFIGS[IndustryEnum.FLEET_MANAGEMENT];
    const currentKPIs = GROWTH_KPI_CONFIGS[companyType as IndustryEnum] || GROWTH_KPI_CONFIGS[IndustryEnum.FLEET_MANAGEMENT];
    const currentAdditionalKPIs = GROWTH_ADDITIONAL_KPI_CONFIGS[companyType as IndustryEnum] || GROWTH_ADDITIONAL_KPI_CONFIGS[IndustryEnum.FLEET_MANAGEMENT];

    const getIcon = (iconName: string) => {
        const IconComp = (LucideIcons as any)[iconName];
        if (IconComp) return <IconComp size={18} />;
        return <LucideIcons.Activity size={18} />;
    };

    const getKpiValue = (key: string, format: string) => {
        const val = data?.cards?.[key];
        if (val === undefined || val === null) {
            if (format === 'currency') return '$0';
            if (format === 'percent') return '0%';
            return '0';
        }

        let cleanVal = val;
        if (typeof val === 'object' && val !== null) {
            if (val.value !== undefined) {
                cleanVal = val.value;
            }
        }

        const num = Number(cleanVal);
        if (isNaN(num)) return String(cleanVal);

        if (format === 'currency') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(num);
        }
        if (format === 'percent') {
            // If it's a ratio <= 1 and not 0, multiply by 100
            if (num > 0 && num <= 1) {
                return `${(num * 100).toFixed(1)}%`;
            }
            return `${num.toFixed(1)}%`;
        }
        return num.toLocaleString();
    };

    const getTrendValue = (key: string) => {
        const val = data?.cards?.[key];
        if (val && typeof val === 'object' && val.trend !== undefined) {
            return val.trend;
        }
        if (key === 'monthlyGrowthPercent') return '+12.5%';
        if (key === 'quarterlyGrowthPercent') return '+1.5%';
        if (key === 'yearlyGrowthPercent') return '-1.2%';
        return '+1.5%';
    };

    const getIsDown = (key: string) => {
        const val = data?.cards?.[key];
        if (val && typeof val === 'object' && val.trend !== undefined) {
            return val.trend.includes('-');
        }
        if (key === 'yearlyGrowthPercent') return true;
        return false;
    };

    const score = data?.growthHealth?.growthHealthScore ?? 0;
    const status = score >= 80 ? 'EXCELLENT' : score >= 60 ? 'GOOD' : score >= 40 ? 'FAIR' : 'POOR';
    const growthHealth = {
        score,
        status,
        metrics: [
            { label: 'Revenue Growth', value: data?.growthHealth?.revenueGrowthScore !== undefined ? `${data.growthHealth.revenueGrowthScore}%` : '0%' },
            { label: 'Client Retention', value: data?.growthHealth?.clientRetentionScore !== undefined ? `${data.growthHealth.clientRetentionScore}%` : '0%' },
            { label: 'Scaling Efficiency', value: data?.growthHealth?.scalingEfficiencyScore !== undefined ? `${data.growthHealth.scalingEfficiencyScore}%` : '0%' }
        ]
    };

    const growthTrendData = data?.growthTrend || [];

    const insights = data?.insights?.map((item: any, idx: number) => ({
        id: idx.toString(),
        title: item.title,
        description: item.description,
        percentage: item.percentage || '',
        color: item.color || '#6366f1',
        bgColor: item.bgColor || '#e0e7ff',
        textColor: item.textColor || '#4f46e5'
    })) || [];

    const gaugeGradients = [
        { id: 'gradPoor', stops: [{ offset: '0%', color: '#ef4444' }, { offset: '100%', color: '#b91c1c' }] },
        { id: 'gradFair', stops: [{ offset: '0%', color: '#f59e0b' }, { offset: '100%', color: '#b45309' }] },
        { id: 'gradGood', stops: [{ offset: '0%', color: '#eab308' }, { offset: '100%', color: '#a16207' }] },
        { id: 'gradExcellent', stops: [{ offset: '0%', color: '#10b981' }, { offset: '100%', color: '#047857' }] },
    ];

    const outerHealthData = [
        { name: 'POOR', value: 25, color: '#fee2e2' },
        { name: 'FAIR', value: 25, color: '#fef3c7' },
        { name: 'GOOD', value: 25, color: '#fef9c3' },
        { name: 'EXCELLENT', value: 25, color: '#dcfce7' },
    ];

    const innerHealthData = [
        { value: 25 }, { value: 25 }, { value: 25 }, { value: 25 }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="w-full h-auto sm:h-[64px] flex flex-col sm:flex-row sm:items-center justify-between gap-[10px] pt-[4px] pb-[4px]">
                <div className="space-y-1">
                    <h1 className="text-[24px] font-medium text-slate-800 font-inter leading-[32px] tracking-[0%]">{activeHeader.title}</h1>
                    <p className="text-[14px] font-normal text-slate-400 font-inter leading-[20px] tracking-[0%]">{activeHeader.subtitle}</p>
                </div>

                <div className="w-[265px] h-[48px] flex items-center justify-between p-[5px] bg-white border border-slate-100 rounded-[8px] shadow-sm shrink-0">
                    {['Monthly', 'Quarterly', 'Yearly'].map((option) => (
                        <button
                            key={option}
                            onClick={() => setTimeframe(option)}
                            className={`w-[86px] h-[36px] flex items-center justify-center py-[4px] px-[16px] text-[12px] font-semibold rounded-[8px] transition-all duration-200 ${timeframe === option
                                ? 'bg-[#2563eb] text-white shadow-md border border-[#2563eb]'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Grid - Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {currentKPIs.map((metric, i) => (
                    <KPICard
                        key={i}
                        label={metric.label}
                        value={getKpiValue(metric.key, metric.format)}
                        trend={getTrendValue(metric.key)}
                        isDown={getIsDown(metric.key)}
                        icon={getIcon(metric.icon)}
                        sub={metric.sub}
                    />
                ))}
            </div>

            {/* Summary Grid - Row 2 (Compact) - Inline Implementation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentAdditionalKPIs.map((metric, i) => (
                    <div key={i} className="h-[110px] bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col p-0 hover:shadow-md transition-all duration-300 overflow-hidden">
                        {/* Top Section - 50% (55px) */}
                        <div className="h-[55px] flex items-center gap-3 border-b border-slate-100 px-4 bg-slate-50/30">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                {getIcon(metric.icon)}
                            </div>
                            <span className="text-[14px] font-normal text-slate-500 font-inter leading-[20px] tracking-[0%]">{metric.label}</span>
                        </div>

                        {/* Bottom Section - 50% (55px) */}
                        <div className="h-[55px] flex items-center justify-between px-4">
                            <span className="text-[24px] font-medium text-slate-900 font-inter leading-[32px] tracking-[0%]">{getKpiValue(metric.key, metric.format)}</span>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-[4px] border text-[12px] font-medium ${!getIsDown(metric.key) ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'
                                }`}>
                                {!getIsDown(metric.key) ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {getTrendValue(metric.key)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Revenue Over Time Chart (Span 2) */}

                <div className="lg:col-span-2 w-full h-[490px] bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    {/* Chart Header - 68px */}
                    <div className="h-[68px] flex items-center justify-between p-[12px] gap-[12px] border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                <Briefcase size={16} />
                            </div>
                            <h3 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">Growth Over Time</h3>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-[4px] text-[12px] font-normal font-inter leading-[16px] tracking-[0%]`} style={{ backgroundColor: 'rgba(242, 255, 250, 1)', color: 'rgba(44, 172, 104, 1)' }}>
                            <ArrowUpRight size={12} style={{ color: 'rgba(44, 172, 104, 1)' }} />
                            12-Month Trend
                        </div>
                    </div>

                    {/* Chart Body - 412px */}
                    <div className="h-[412px] flex-1 w-full border border-[rgba(26,21,83,0.08)] relative py-[12px] px-[16px] flex flex-col gap-[12px]">
                        <div className="flex-1 w-full relative rounded-[10px] border border-[rgba(26,21,83,0.08)] bg-slate-50/30 flex flex-col overflow-hidden">
                            <div className="flex-1 w-full relative p-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={growthTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ffcc99" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#ffcc99" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorClient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                                            tickFormatter={(value) => `${value}%`}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="monthly"
                                            stroke="#2563eb"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorMonthly)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#ffcc99"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="client"
                                            stroke="#f97316"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorClient)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="target"
                                            stroke="#94a3b8"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            fill="none"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Chart Legend - Styled inside the inner box */}
                            <div className="flex items-center justify-center gap-6 py-3 bg-white border-t border-[rgba(26,21,83,0.08)]">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#2563eb]" />
                                    <span className="text-[14px] font-normal text-slate-500 font-inter tracking-[0%]">Monthly Growth %</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ffcc99]" />
                                    <span className="text-[14px] font-normal text-slate-500 font-inter tracking-[0%]">Revenue Growth %</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#f97316]" />
                                    <span className="text-[14px] font-normal text-slate-500 font-inter tracking-[0%]">Client Growth %</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#94a3b8]" />
                                    <span className="text-[14px] font-normal text-slate-500 font-inter tracking-[0%]">Target (8%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Right Widgets Column */}
                <div className="space-y-4">
                    {/* Company Health Meter */}

                    <div className="h-[380px] bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                        {/* Header - 54px */}
                        <div className="h-[54px] flex items-center p-[12px] gap-[12px] border-b border-slate-50">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                <Pin size={16} />
                            </div>
                            <h3 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">Growth Health</h3>
                        </div>

                        {/* Body */}
                        <div className="flex-1 flex flex-col">
                            <div className="relative h-[180px] w-full flex items-center justify-center">
                                <div className="w-[260px] h-[180px] relative mx-auto">
                                    {/* Compact Gauge Chart with ZERO Gaps */}
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <defs>
                                                {gaugeGradients.map((grad) => (
                                                    <linearGradient key={grad.id} id={grad.id} x1="0" y1="0" x2="0" y2="1">
                                                        {grad.stops.map((stop, i) => (
                                                            <stop key={i} offset={stop.offset} stopColor={stop.color} />
                                                        ))}
                                                    </linearGradient>
                                                ))}
                                            </defs>
                                            {/* Outer Arc - Touching the inner arc (No Gap) */}
                                            <Pie
                                                data={outerHealthData}
                                                cx={130}
                                                cy={140}
                                                startAngle={180}
                                                endAngle={0}
                                                innerRadius={85}
                                                outerRadius={115}
                                                paddingAngle={0}
                                                dataKey="value"
                                                stroke="none"
                                                labelLine={false}
                                                label={renderOuterLabel}
                                            >
                                                {outerHealthData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            {/* Compact Inner Arc - Still 60px Thick (40 to 100) */}
                                            <Pie
                                                data={healthData}
                                                cx={130}
                                                cy={140}
                                                startAngle={180}
                                                endAngle={0}
                                                innerRadius={30}
                                                outerRadius={85}
                                                paddingAngle={0}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {healthData.map((entry, index) => {
                                                    const gradientIds = ['gradPoor', 'gradFair', 'gradGood', 'gradExcellent'];
                                                    return <Cell key={`cell-${index}`} fill={`url(#${gradientIds[index]})`} />;
                                                })}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>

                                    {/* Independent Needle Layer */}
                                    <NeedleLayer value={growthHealth.score} cx={130} cy={140} iR={30} oR={85} />
                                </div>
                            </div>

                            <div className="text-center mt-[-10px] mb-2">
                                <p className="text-[11px] font-normal text-slate-600 mb-0.5 font-inter leading-none tracking-[0%]">Today Health</p>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-[9px] font-normal text-slate-400 uppercase tracking-[0%] font-inter leading-none text-center">{growthHealth.status}</span>
                                    <span className="text-[14px] font-semibold text-slate-900 font-inter leading-none tracking-[0%]">{growthHealth.score}</span>
                                </div>
                            </div>

                            {/* Health Metrics Details */}
                            <div className="px-5 space-y-6 border-t border-slate-50 pt-2">
                                {growthHealth.metrics.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-[12px] font-normal text-slate-700 font-inter leading-none">{item.label}</span>
                                        <span className="text-[12px] font-semibold text-slate-900 font-inter leading-none">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>



                </div>
            </div>

            {/* AI Insights Row */}

            <div className="">
                <AIInsights insights={insights} />
            </div>

        </div>
    );
}

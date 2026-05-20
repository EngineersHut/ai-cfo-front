"use client";

import React, { useState } from 'react';
import {
    AlertCircle,
    CheckCircle2,
    Activity,
    TrendingUp,
    Truck,
    Pin,
    Info,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Briefcase
} from 'lucide-react';
import {

    ResponsiveContainer,

    Cell,
    PieChart as RePieChart,
    Pie
} from 'recharts';
import KPICard from '@/components/common/KPICard';
import DetailedMetricsCard from '@/components/common/DetailedMetricsCard';
import {
    operationalMetrics,

    coreOperationsData,

    costEfficiencyData
} from '@/data/operationalData';
import { healthData } from '@/data/dashboardData';

// Custom Gauge Components
const RADIAN = Math.PI / 180;
const NeedleLayer = ({ value, cx, cy, iR, oR }: any) => {
    const ang = 180.0 * (1 - value / 100);
    const length = oR + 15;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 8; // Sleeker needle width
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
                {/* Solid Navy Pivot - Proportional */}
                <circle cx={x0} cy={y0} r={r + 4} fill="#1a2153" stroke="none" />
                {/* Sleeker Needle */}
                <path d={`M${xba} ${yba}L${xbb} ${ybb}L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill="#1a2153" />
                {/* Center White Dot */}
                <circle cx={x0} cy={y0} r={3} fill="#fff" stroke="none" />
            </g>
        </svg>
    );
};

// Custom Label Component for Outer Gauge Arc
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

export default function OperationalOverview() {
    const [timeframe, setTimeframe] = useState('Monthly');
    const gaugeGradients = [
        {
            id: 'gradPoor',
            stops: [
                { offset: '32.29%', color: '#FF0508' },
                { offset: '33.05%', color: '#FF0C0B' },
                { offset: '37.63%', color: '#FF2F1A' },
                { offset: '41.92%', color: '#FF4924' },
                { offset: '45.79%', color: '#FF592B' },
                { offset: '48.86%', color: '#FF5E2D' }
            ]
        },
        { id: 'gradFair', stops: [{ offset: '0%', color: '#ffb74d' }, { offset: '100%', color: '#f57c00' }] },
        { id: 'gradGood', stops: [{ offset: '0%', color: '#fff176' }, { offset: '100%', color: '#fbc02d' }] },
        { id: 'gradExcellent', stops: [{ offset: '0%', color: '#69f0ae' }, { offset: '100%', color: '#2e7d32' }] },
    ];

    // Data for the outer arc (Soft tints)
    const outerHealthData = [
        { name: 'POOR', value: 25, color: '#ffebee' },
        { name: 'FAIR', value: 25, color: '#fff3e0' },
        { name: 'GOOD', value: 25, color: '#fffde7' },
        { name: 'EXCELLENT', value: 25, color: '#e8f5e9' },
    ];
    ``

    return (
        <div className=" space-y-8 animate-in fade-in duration-500">
            <div className="w-full h-auto sm:h-[64px] flex flex-col sm:flex-row sm:items-center justify-between gap-[10px] pt-[4px] pb-[4px]">
                <div className="space-y-1">
                    <h1 className="text-[24px] font-medium text-slate-800 font-inter leading-[32px] tracking-[0%]">Operational Overview</h1>
                    <p className="text-[14px] font-normal text-slate-400 font-inter leading-[20px] tracking-[0%]">Track fleet performance, cost efficiency, and driv.</p>
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

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {operationalMetrics.map((metric, i) => (
                    <KPICard
                        key={i}
                        label={metric.label}
                        value={metric.value}
                        trend={metric.trend}
                        isDown={!metric.isUp}
                        icon={metric.icon}
                        sub={metric.sub}
                        noTrendIcon={metric.noTrendIcon}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Core Operations Card - Spans 2 columns */}
                <DetailedMetricsCard
                    title="Core Operations"
                    icon={<Truck size={16} />}
                    isLive="Live"
                    data={coreOperationsData}
                    className="lg:col-span-2"
                />

                {/* Operational Health Card */}


                <div className="h-[374px] bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    {/* Header - 54px */}
                    <div className="h-[54px] flex items-center p-[12px] gap-[12px] border-b border-slate-50">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <Pin size={16} />
                        </div>
                        <h3 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">Operational Health</h3>
                    </div>

                    {/* Body */}
                    <div className="flex-1 flex flex-col">
                        <div className="relative h-[180px] w-full flex items-center justify-center">
                            <div className="w-[260px] h-[180px] relative mx-auto">
                                {/* Compact Gauge Chart with ZERO Gaps */}
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
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
                                    </RePieChart>
                                </ResponsiveContainer>

                                {/* Independent Needle Layer */}
                                <NeedleLayer value={84} cx={130} cy={140} iR={30} oR={85} />
                            </div>
                        </div>

                        <div className="text-center mt-[-10px] mb-2">
                            <p className="text-[11px] font-normal text-slate-600 mb-0.5 font-inter leading-none tracking-[0%]">Today Health</p>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-[9px] font-normal text-slate-400 uppercase tracking-[0%] font-inter leading-none text-center">EXCELLENT</span>
                                <span className="text-[14px] font-semibold text-slate-900 font-inter leading-none tracking-[0%]">84</span>
                            </div>
                        </div>

                        {/* Health Metrics Details */}
                        <div className="px-5 space-y-6 border-t border-slate-50 pt-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-normal text-slate-700 font-inter leading-none">Fleet Efficiency</span>
                                <span className="text-[12px] font-semibold text-slate-900 font-inter leading-none">98%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-normal text-slate-700 font-inter leading-none">Delivery Success Rate</span>
                                <span className="text-[12px] font-semibold text-slate-900 font-inter leading-none">84%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-normal text-slate-700 font-inter leading-none">Cost Efficiency</span>
                                <span className="text-[12px] font-semibold text-slate-900 font-inter leading-none">84%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DetailedMetricsCard
                title="Cost Efficiency"
                icon={<Truck size={16} />}
                isLive="2 above benchmark"
                data={costEfficiencyData}
                className="lg:col-span-2"
            />
            <DetailedMetricsCard
                title="Fleet & Driver Utilization"
                icon={<Truck size={16} />}
                isLive=""
                data={costEfficiencyData}
                className="lg:col-span-2"
            />
            <DetailedMetricsCard
                title="Driver Performance"
                icon={<Truck size={16} />}
                isLive="2 above benchmark"
                data={costEfficiencyData}
                className="lg:col-span-2"
            />
        </div>
    );
}

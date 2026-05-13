"use client";

import React, { useState } from 'react';
import {
    Activity,
    Zap,
    BarChart3,
    Clock,
    Users,
    TrendingUp,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import KPICard from '@/components/common/KPICard';

export default function OperationalOverview() {
    const [timeframe, setTimeframe] = useState('Monthly');
    const metrics = [
        { label: 'Operational Efficiency', value: '94.2%', trend: '+2.4%', isUp: true, icon: <Zap size={18} />, sub: 'vs. last month' },
        { label: 'Resource Utilization', value: '88.5%', trend: '+1.2%', isUp: true, icon: <Users size={18} />, sub: 'Optimal range' },
        { label: 'Process Cycle Time', value: '4.2 days', trend: 'Stable', isUp: false, icon: <Clock size={18} />, sub: 'Across 12 units', noTrendIcon: true },
        { label: 'Output Capacity', value: '1.2M units', trend: '+150K', isUp: true, icon: <BarChart3 size={18} />, sub: 'Projected +5%' },
    ];

    const departmentPerformance = [
        { dept: 'Production', efficiency: 96, health: 'Optimal', load: 82 },
        { dept: 'Logistics', efficiency: 89, health: 'Warning', load: 94 },
        { dept: 'Quality Control', efficiency: 98, health: 'Optimal', load: 75 },
        { dept: 'Supply Chain', efficiency: 85, health: 'Suboptimal', load: 88 },
    ];

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
                {metrics.map((metric, i) => (
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Departmental Efficiency */}
                <div className="p-6 rounded-[16px] border border-slate-100 bg-white shadow-sm flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-slate-800">Departmental Performance</h3>
                        <Activity size={18} className="text-slate-400" />
                    </div>

                    <div className="space-y-6">
                        {departmentPerformance.map((dept, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[14px] font-medium text-slate-800">{dept.dept}</p>
                                        <p className={`text-[11px] font-medium ${dept.health === 'Optimal' ? 'text-emerald-500' :
                                            dept.health === 'Warning' ? 'text-amber-500' : 'text-red-500'
                                            }`}>{dept.health}</p>
                                    </div>
                                    <p className="text-[14px] font-bold text-slate-900">{dept.efficiency}%</p>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${dept.efficiency > 90 ? 'bg-emerald-500' :
                                            dept.efficiency > 85 ? 'bg-amber-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${dept.efficiency}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health */}
                <div className="p-6 rounded-[16px] border border-slate-100 bg-white shadow-sm flex flex-col gap-6">
                    <h3 className="text-[16px] font-semibold text-slate-800">Operational Health Check</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex flex-col gap-2">
                            <CheckCircle2 size={18} className="text-emerald-600" />
                            <p className="text-[13px] font-bold text-emerald-900">Uptime</p>
                            <p className="text-[20px] font-bold text-emerald-600 tracking-tight">99.9%</p>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col gap-2">
                            <TrendingUp size={18} className="text-blue-600" />
                            <p className="text-[13px] font-bold text-blue-900">Throughput</p>
                            <p className="text-[20px] font-bold text-blue-600 tracking-tight">+12.4%</p>
                        </div>
                    </div>

                    <div className="flex-1 p-4 rounded-xl bg-slate-50/50 border border-slate-100 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-slate-500">
                            <AlertCircle size={16} />
                            <p className="text-[12px] font-medium uppercase tracking-wider">Potential Bottlenecks</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[13px]">
                                <span className="text-slate-600">Inventory Turnover</span>
                                <span className="text-amber-600 font-bold">Slow</span>
                            </div>
                            <div className="flex items-center justify-between text-[13px]">
                                <span className="text-slate-600">Vender Lead Time</span>
                                <span className="text-red-500 font-bold">High</span>
                            </div>
                            <div className="flex items-center justify-between text-[13px]">
                                <span className="text-slate-600">Equipment Maintenance</span>
                                <span className="text-emerald-500 font-bold">Scheduled</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

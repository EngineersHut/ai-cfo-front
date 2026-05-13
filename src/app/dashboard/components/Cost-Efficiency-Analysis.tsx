"use client";

import React from 'react';
import {
    Pin,
    FileDown,
    Info,
    ShieldCheck,
    Zap,
    Plus,
    Play
} from 'lucide-react';
import { detailedCostData } from '@/data/dashboardData';
import { useDashboardSettings } from '@/context/DashboardContext';

const IconMap: any = {
    ShieldCheck: ShieldCheck,
    Zap: Zap,
    Plus: Plus,
    Play: Play
};

export default function CostEfficiencyAnalysis() {
    const { summary, breakdown, unitEconomics, insights } = detailedCostData;
    const { visibility } = useDashboardSettings();

    return (
        <div className="w-full bg-white rounded-[16px] border border-slate-100 shadow-sm p-[16px]">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <Pin size={18} className="text-slate-300 -rotate-45" />
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">Cost & Efficiency Analysis</h2>
                        <span className="text-[12px] text-slate-400 font-normal font-inter leading-[16px] tracking-[0%]">Q2 2026 · Auto-refreshed every 15 min</span>
                    </div>
                </div>
                <button className="w-[130px] h-[36px] flex items-center pt-[4px] pr-[16px] pb-[4px] pl-[12px] gap-[6px] rounded-[8px] border border-slate-200 bg-white text-slate-600 text-[14px] font-normal font-inter leading-[20px] tracking-[0%] hover:bg-slate-50 transition-all shadow-sm">
                    <FileDown size={16} />
                    Export CSV
                </button>
            </div>

            {visibility['expenseBreakdown'] !== false && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
                    {summary.map((card, i) => (
                        <div key={i} className=" h-[84px] p-[12px] rounded-[12px] border border-slate-100 bg-slate-50/20 flex flex-col gap-[10px]">
                            <span className="text-[10.5px] font-medium text-slate-400 uppercase font-inter leading-[15.75px] tracking-[0px]">{card.label}</span>
                            <div className="flex items-center justify-between">
                                <span className="text-[24px] font-medium text-slate-900 font-inter leading-[32px] tracking-[0%]">{card.value}</span>
                                <div className={`px-2 py-0.5 rounded-[4px] text-[11px] font-medium flex items-center gap-1 ${card.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                                    }`}>
                                    {card.trend}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary Row */}


            {/* Two-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Table Column */}
                <div className="lg:col-span-7 flex flex-col">
                    <div className="grid grid-cols-12 mb-6 border-b border-slate-50 pb-4">
                        <div className="col-span-5 text-[11px] font-semibold text-slate-300 uppercase tracking-widest">Metric</div>
                        <div className="col-span-3 text-[11px] font-semibold text-slate-300 uppercase tracking-widest text-center">Value</div>
                        <div className="col-span-2 text-[11px] font-semibold text-slate-300 uppercase tracking-widest text-center">Vs Prior</div>
                        <div className="col-span-2 text-[11px] font-semibold text-slate-300 uppercase tracking-widest text-right">Distribution</div>
                    </div>

                    <div className="space-y-8">
                        {/* Cost Breakdown */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Cost Breakdown</h3>
                            {breakdown.map((item, i) => (
                                <div key={i} className="grid grid-cols-12 items-center group py-1">
                                    <div className="col-span-5 flex items-center gap-2">
                                        <span className="text-[14px] font-medium text-slate-700">{item.metric}</span>
                                        <Info size={14} className="text-slate-300 cursor-help" />
                                    </div>
                                    <div className="col-span-3 flex flex-col items-center">
                                        <span className="text-[14px] font-bold text-slate-800">{item.value}</span>
                                        <span className="text-[11px] text-slate-400">{item.sub}</span>
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        <div className={`px-2 py-0.5 rounded-[4px] text-[11px] font-medium border ${item.trend.includes('+') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            item.trend === 'Stable' ? 'bg-slate-50 text-slate-500 border-slate-100' : 'bg-red-50 text-red-500 border-red-100'
                                            }`}>
                                            {item.trend}
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${item.distribution}%`, backgroundColor: item.color }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Unit Economics */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Unit Economics</h3>
                            {unitEconomics.map((item, i) => (
                                <div key={i} className="grid grid-cols-12 items-center py-1">
                                    <div className="col-span-5 flex items-center gap-2">
                                        <span className="text-[14px] font-medium text-slate-700">{item.metric}</span>
                                        <Info size={14} className="text-slate-300 cursor-help" />
                                    </div>
                                    <div className="col-span-3 flex flex-col items-center">
                                        <span className="text-[14px] font-bold text-slate-800">{item.value}</span>
                                        <span className="text-[11px] text-slate-400">{item.sub}</span>
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        <div className={`px-2 py-0.5 rounded-[4px] text-[11px] font-medium border ${item.trend.includes('-') ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                            {item.trend}
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${item.distribution}%`, backgroundColor: item.color }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-8 flex items-center gap-6 pt-6">
                        <span className="text-[11px] text-slate-400">Legend:</span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-indigo-500 rounded-full" />
                                <span className="text-[11px] text-slate-500">Normal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-amber-500 rounded-full" />
                                <span className="text-[11px] text-slate-500">Near limit</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-red-500 rounded-full" />
                                <span className="text-[11px] text-slate-500">Above target</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Insights Column */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <Pin size={16} className="-rotate-45" />
                        </div>
                        <div>
                            <h3 className="text-[16px] font-semibold text-slate-800 font-inter">CFO Insights</h3>
                            <p className="text-[12px] text-slate-400">Powered by AI analysis</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {insights.map((insight) => {
                            const Icon = IconMap[insight.icon] || Info;
                            return (
                                <div key={insight.id} className="p-4 rounded-[12px] border bg-blue-50/40 border-blue-100/50">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-1.5 rounded-md bg-blue-100 text-blue-600">
                                            <Icon size={14} />
                                        </div>
                                        <h4 className="text-[13px] font-bold text-blue-900 font-inter">{insight.title}</h4>
                                    </div>
                                    <ul className="space-y-3">
                                        {insight.points.map((point: string, j: number) => {
                                            const isWarning = point.includes('above') || point.includes('increased');
                                            const bulletColor = isWarning ? 'bg-amber-500' : 'bg-emerald-500';
                                            return (
                                                <li key={j} className="flex gap-3 text-[12px] leading-relaxed text-slate-600 font-inter">
                                                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${bulletColor}`} />
                                                    {point}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    {/* Analyse CTA */}
                    <div className="p-4 bg-white rounded-[12px] border border-slate-100 shadow-sm flex items-center justify-between mt-auto">
                        <div className="space-y-1">
                            <h4 className="text-[13px] font-bold text-slate-800 font-inter">Run Deep Analysis</h4>
                            <p className="text-[11px] text-slate-400">Get AI-generated cost reduction plan</p>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 rounded-[10px] text-white text-[13px] font-semibold hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
                            <Plus size={16} />
                            Analyse
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

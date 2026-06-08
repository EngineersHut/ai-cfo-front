"use client";

import {
    Pin,
    FileDown,
    Info,
    ShieldCheck,
    Zap,
    Plus,
    Play
} from 'lucide-react';
import { useSelector } from '@/store';
import { useDashboardSettings } from '@/context/DashboardContext';

const IconMap: any = {
    ShieldCheck: ShieldCheck,
    Zap: Zap,
    Plus: Plus,
    Play: Play
};

export default function CostEfficiencyAnalysis() {
    const { costEfficiency, cfoInsights } = useSelector((state) => state.dashboard);
    const { summary, breakdown, unitEconomics, insights } = costEfficiency;
    const { visibility } = useDashboardSettings();

    return (
        <div className="w-full bg-white rounded-[16px] border border-slate-100 shadow-sm p-[16px]">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-2 sm:pb-0">
                <div className="flex items-start sm:items-center gap-3">
                    <Pin size={18} className="text-slate-300 -rotate-45 mt-1 sm:mt-0 shrink-0" />
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                        <h2 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">Cost & Efficiency Analysis</h2>
                        <span className="text-[12px] text-slate-400 font-normal font-inter leading-[16px] tracking-[0%]">Q2 2026 · Auto-refreshed every 15 min</span>
                    </div>
                </div>
                <button className="w-[130px] h-[36px] flex items-center pt-[4px] pr-[16px] pb-[4px] pl-[12px] gap-[6px] rounded-[8px] border border-slate-200 bg-white text-slate-600 text-[14px] font-normal font-inter leading-[20px] tracking-[0%] hover:bg-slate-50 transition-all shadow-sm shrink-0 self-start sm:self-auto">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Table Column */}
                {visibility['costAnalysis'] !== false && (<>
                    <div className="py-[19px] px-[17px] flex border border-[#e2e8f0] rounded-[12px] flex-col bg-white min-h-[535.25px]">
                        <div className="w-full overflow-x-auto md:overflow-x-visible scrollbar-thin">
                            <div className="min-w-[600px] md:min-w-0 pb-2">
                                <div className="grid grid-cols-12 mb-3">
                                    <div className="col-span-5 text-[10px] font-semibold text-slate-300 uppercase font-inter leading-[15px] tracking-[0.7px]">Metric</div>
                                    <div className="col-span-3 text-[10px] font-semibold text-slate-300 uppercase font-inter leading-[15px] tracking-[0.7px] text-left">Value</div>
                                    <div className="col-span-2 text-[10px] font-semibold text-slate-300 uppercase font-inter leading-[15px] tracking-[0.7px] text-left">Vs Prior</div>
                                    <div className="col-span-2 text-[10px] font-semibold text-slate-300 uppercase font-inter leading-[15px] tracking-[0.7px] text-right">Distribution</div>
                                </div>

                                <div className="space-y-4">
                                    {/* Cost Breakdown */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 ">
                                            <h3 className="text-[10px] font-semibold text-slate-500 uppercase font-inter leading-[15px] tracking-[0.8px] shrink-0">Cost Breakdown</h3>
                                            <div className="flex-1 h-px bg-slate-50" />
                                        </div>
                                        {breakdown.map((item, i) => (
                                            <div key={i} className="grid grid-cols-12 items-center group py-1">
                                                <div className="col-span-5 flex items-center gap-2">
                                                    <span className="text-[12.5px] font-normal text-slate-700 font-inter leading-[18.75px] tracking-[0px]">{item.metric}</span>
                                                    <Info size={14} className="text-slate-300 cursor-help" />
                                                </div>
                                                <div className="col-span-3 flex flex-col items-start">
                                                    <span className="text-[12.5px] font-semibold text-slate-800 font-inter leading-[18.75px] tracking-[0px]">{item.value}</span>
                                                    <span className="text-[10.5px] font-normal text-slate-400 font-inter leading-[15.75px] tracking-[0px]">{item.sub}</span>
                                                </div>
                                                <div className="col-span-2 flex justify-start">
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
                                        <div className="flex items-center gap-3 mb-4">
                                            <h3 className="text-[10px] font-semibold text-slate-500 uppercase font-inter leading-[15px] tracking-[0.8px] shrink-0">Unit Economics</h3>
                                            <div className="flex-1 h-px bg-slate-50" />
                                        </div>
                                        {unitEconomics.map((item, i) => (
                                            <div key={i} className="grid grid-cols-12 items-center py-1">
                                                <div className="col-span-5 flex items-center gap-2">
                                                    <span className="text-[12.5px] font-normal text-slate-700 font-inter leading-[18.75px] tracking-[0px]">{item.metric}</span>
                                                    <Info size={14} className="text-slate-300 cursor-help" />
                                                </div>
                                                <div className="col-span-3 flex flex-col items-start">
                                                    <span className="text-[12.5px] font-semibold text-slate-800 font-inter leading-[18.75px] tracking-[0px]">{item.value}</span>
                                                    <span className="text-[10.5px] font-normal text-slate-400 font-inter leading-[15.75px] tracking-[0px]">{item.sub}</span>
                                                </div>
                                                <div className="col-span-2 flex justify-start">
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
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-6 border-t border-slate-50">
                            <span className="text-[12.5px] font-normal text-slate-400 font-inter leading-[18.75px] tracking-[0px] shrink-0">Legend:</span>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-[18px] h-[5px] bg-blue-600 rounded-full" />
                                    <span className="text-[12.5px] font-normal text-slate-500 font-inter leading-[18.75px] tracking-[0px]">Normal</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-[18px] h-[5px] bg-orange-500 rounded-full" />
                                    <span className="text-[12.5px] font-normal text-slate-500 font-inter leading-[18.75px] tracking-[0px]">Near limit</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-[18px] h-[5px] bg-red-600 rounded-full" />
                                    <span className="text-[12.5px] font-normal text-slate-500 font-inter leading-[18.75px] tracking-[0px]">Above target</span>
                                </div>
                            </div>
                        </div>
                    </div>





                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                <Pin size={16} className="-rotate-45" />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">CFO Insights</h3>
                                <p className="text-[12px] text-slate-400 font-normal font-inter leading-[16px] tracking-[0%]">Powered by AI analysis</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {cfoInsights && cfoInsights.length > 0 ? (
                                cfoInsights.map((insight, idx) => {
                                    const colors = [
                                        { bg: 'bg-blue-50/40 border-blue-100/50', iconBg: 'bg-blue-100 text-blue-600', bullet: 'bg-blue-500' },
                                        { bg: 'bg-emerald-50/40 border-emerald-100/50', iconBg: 'bg-emerald-100 text-emerald-600', bullet: 'bg-emerald-500' },
                                        { bg: 'bg-amber-50/40 border-amber-100/50', iconBg: 'bg-amber-100 text-amber-600', bullet: 'bg-amber-500' },
                                        { bg: 'bg-purple-50/40 border-purple-100/50', iconBg: 'bg-purple-100 text-purple-600', bullet: 'bg-purple-500' }
                                    ];
                                    const style = colors[idx % colors.length];
                                    return (
                                        <div key={idx} className={`w-full p-[12px] gap-[10px] rounded-[12px] border ${style.bg} flex flex-col`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-md ${style.iconBg}`}>
                                                    <ShieldCheck size={14} />
                                                </div>
                                                <h4 className="text-[12.5px] font-semibold text-slate-800 font-inter leading-[18.75px] tracking-[0px]">{insight.title}</h4>
                                            </div>
                                            <p className="text-[11.5px] font-normal text-slate-600 font-inter leading-[17.25px] tracking-[0px] pl-[34px]">
                                                {insight.description}
                                            </p>
                                        </div>
                                    );
                                })
                            ) : (
                                insights.map((insight) => {
                                    const Icon = IconMap[insight.icon] || Info;
                                    return (
                                        <div key={insight.id} className="w-full  p-[12px] gap-[10px] rounded-[12px] border bg-blue-50/40 border-blue-100/50 flex flex-col">
                                            <div className="flex items-center gap-3 ">
                                                <div className="p-1.5 rounded-md bg-blue-100 text-blue-600">
                                                    <Icon size={14} />
                                                </div>
                                                <h4 className="text-[12.5px] font-semibold text-blue-900 font-inter leading-[18.75px] tracking-[0px]">{insight.title}</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {insight.points.map((point: string, j: number) => {
                                                    const isWarning = point.includes('above') || point.includes('increased');
                                                    const bulletColor = isWarning ? 'bg-amber-500' : 'bg-emerald-500';
                                                    return (
                                                        <li key={j} className="flex gap-3 text-[11.5px] font-normal text-slate-600 font-inter leading-[17.25px] tracking-[0px]">
                                                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${bulletColor}`} />
                                                            {point}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Analyse CTA */}
                        <div className="p-4 bg-white rounded-[12px] border border-slate-100 shadow-sm flex items-center justify-between mt-auto">
                            <div className="space-y-1">
                                <h4 className="text-[12.5px] font-semibold text-slate-800 font-inter leading-[18.75px] tracking-[0px]">Run Deep Analysis</h4>
                                <p className="text-[11px] text-slate-400 font-normal font-inter leading-[16.5px] tracking-[0px]">Get AI-generated cost reduction plan</p>
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 rounded-[10px] text-white text-[13px] font-semibold hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
                                <Plus size={16} />
                                Analyse
                            </button>
                        </div>
                    </div>
                </>
                )}
            </div>
        </div>
    );
}

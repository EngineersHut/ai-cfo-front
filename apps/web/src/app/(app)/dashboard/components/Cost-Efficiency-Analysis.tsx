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
import { detailedCostData } from '@/data/dashboardData';

const IconMap: any = {
    ShieldCheck: ShieldCheck,
    Zap: Zap,
    Plus: Plus,
    Play: Play
};

export default function CostEfficiencyAnalysis() {
    const { costEfficiency: rawCost, cfoInsights } = useSelector((state) => state.dashboard);
    const { visibility } = useDashboardSettings();
 
    // Dynamic formatter that safely extracts nested object values
    const formatVal = (val: any, format: 'currency' | 'percent' | 'number') => {
        if (val === undefined || val === null) return '';
        
        let cleanVal = val;
        if (typeof val === 'object' && val !== null) {
            if (val.value !== undefined) {
                cleanVal = val.value;
            } else {
                return '';
            }
        }

        const num = Number(cleanVal);
        if (isNaN(num)) return String(cleanVal);
        if (format === 'currency') {
            if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(num);
        }
        if (format === 'percent') {
            if (num > 0 && num <= 1) {
                return `${(num * 100).toFixed(1)}%`;
            }
            return `${num.toFixed(1)}%`;
        }
        return new Intl.NumberFormat('en-US').format(num);
    };

    const getTrend = (val: any, fallback: string) => {
        if (val === undefined || val === null) return fallback;
        if (typeof val === 'object' && val.trend !== undefined) {
            return val.trend;
        }
        return fallback;
    };

    const getIsUp = (val: any, fallback: boolean) => {
        if (val === undefined || val === null) return fallback;
        if (typeof val === 'object' && val.trend !== undefined) {
            return !val.trend.includes('-');
        }
        return fallback;
    };
 
    const summary = [
        { 
            id: 'totalExpenses', 
            label: 'Total Expenses', 
            value: rawCost?.totalExpenses !== undefined ? formatVal(rawCost.totalExpenses, 'currency') : 'N/A', 
            trend: rawCost?.totalExpenses !== undefined ? getTrend(rawCost.totalExpenses, 'Stable') : '', 
            isUp: rawCost?.totalExpenses !== undefined ? getIsUp(rawCost.totalExpenses, false) : false
        },
        { 
            id: 'costRevenue', 
            label: 'Cost of Revenue', 
            value: rawCost?.costOfRevenue !== undefined ? formatVal(rawCost.costOfRevenue, 'percent') : 'N/A', 
            trend: rawCost?.costOfRevenue !== undefined ? getTrend(rawCost.costOfRevenue, 'Stable') : '', 
            isUp: rawCost?.costOfRevenue !== undefined ? getIsUp(rawCost.costOfRevenue, false) : false
        },
        { 
            id: 'costClient', 
            label: 'Cost per Client', 
            value: rawCost?.costPerClient !== undefined ? formatVal(rawCost.costPerClient, 'currency') : 'N/A', 
            trend: rawCost?.costPerClient !== undefined ? getTrend(rawCost.costPerClient, 'Stable') : '', 
            isUp: rawCost?.costPerClient !== undefined ? getIsUp(rawCost.costPerClient, false) : false
        },
        { 
            id: 'opExpRatio', 
            label: 'Operating Expense Ratio', 
            value: rawCost?.operatingExpenseRatio !== undefined ? formatVal(rawCost.operatingExpenseRatio, 'percent') : 'N/A', 
            trend: rawCost?.operatingExpenseRatio !== undefined ? getTrend(rawCost.operatingExpenseRatio, 'Stable') : '', 
            isUp: rawCost?.operatingExpenseRatio !== undefined ? getIsUp(rawCost.operatingExpenseRatio, false) : false
        }
    ];
 
    const breakdown = detailedCostData.breakdown.map((item, idx) => {
        let val = 'N/A';
        let trend = '';
        let distribution = 0;
        if (item.metric === 'Total Expenses' && rawCost?.totalExpenses !== undefined) {
            val = formatVal(rawCost.totalExpenses, 'currency');
            trend = getTrend(rawCost.totalExpenses, 'Stable');
            distribution = item.distribution;
        } else if (item.metric === 'Cost % of Revenue' && rawCost?.costOfRevenue !== undefined) {
            val = formatVal(rawCost.costOfRevenue, 'percent');
            trend = getTrend(rawCost.costOfRevenue, 'Stable');
            distribution = item.distribution;
        } else if (item.metric === 'Fixed Cost' && rawCost?.fixedCost !== undefined) {
            val = formatVal(rawCost.fixedCost, 'currency');
            trend = getTrend(rawCost.fixedCost, 'Stable');
            distribution = item.distribution;
        } else if (item.metric === 'Variable Cost' && rawCost?.variableCost !== undefined) {
            val = formatVal(rawCost.variableCost, 'currency');
            trend = getTrend(rawCost.variableCost, 'Stable');
            distribution = item.distribution;
        }
        return { ...item, value: val, trend, distribution };
    });
 
    const unitEconomics = detailedCostData.unitEconomics.map((item, idx) => {
        let val = 'N/A';
        let trend = '';
        let distribution = 0;
        if (item.metric === 'Cost per Client' && rawCost?.costPerClient !== undefined) {
            val = formatVal(rawCost.costPerClient, 'currency');
            trend = getTrend(rawCost.costPerClient, 'Stable');
            distribution = item.distribution;
        } else if (item.metric === 'Cost per Employee' && rawCost?.costPerEmployee !== undefined) {
            val = formatVal(rawCost.costPerEmployee, 'currency');
            trend = getTrend(rawCost.costPerEmployee, 'Stable');
            distribution = item.distribution;
        } else if (item.metric === 'Operating Expense Ratio' && rawCost?.operatingExpenseRatio !== undefined) {
            val = formatVal(rawCost.operatingExpenseRatio, 'percent');
            trend = getTrend(rawCost.operatingExpenseRatio, 'Stable');
            distribution = item.distribution;
        }
        return { ...item, value: val, trend, distribution };
    });
 
    const insights = [];

    return (
        <div className="w-full bg-white dark:bg-slate-800 rounded-[16px] border border-slate-100 dark:border-slate-700 shadow-sm p-[16px]">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-2 sm:pb-0">
                <div className="flex items-start sm:items-center gap-3">
                    <Pin size={18} className="text-slate-300 dark:text-slate-400 -rotate-45 mt-1 sm:mt-0 shrink-0" />
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                        <h2 className="text-[16px] font-normal text-slate-800 dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">Cost & Efficiency Analysis</h2>
                        <span className="text-[12px] text-slate-400 dark:text-slate-500 font-normal font-inter leading-[16px] tracking-[0%]">Q2 2026 · Auto-refreshed every 15 min</span>
                    </div>
                </div>
                <button className="w-[130px] h-[36px] flex items-center pt-[4px] pr-[16px] pb-[4px] pl-[12px] gap-[6px] rounded-[8px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[14px] font-normal font-inter leading-[20px] tracking-[0%] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm shrink-0 self-start sm:self-auto">
                    <FileDown size={16} />
                    Export CSV
                </button>
            </div>

            {visibility['expenseBreakdown'] !== false && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
                    {summary.map((card, i) => (
                        <div key={i} className=" h-[84px] p-[12px] rounded-[12px] border border-slate-100 dark:border-slate-700 bg-slate-50/20 dark:bg-slate-800/50 flex flex-col gap-[10px]">
                            <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 uppercase font-inter leading-[15.75px] tracking-[0px]">{card.label}</span>
                            <div className="flex items-center justify-between">
                                <span className="text-[24px] font-medium text-slate-900 dark:text-slate-100 font-inter leading-[32px] tracking-[0%]">{card.value}</span>
                                <div className={`px-2 py-0.5 rounded-[4px] text-[11px] font-medium flex items-center gap-1 ${card.isUp ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'
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
                    <div className="py-[19px] px-[17px] flex border border-[#e2e8f0] dark:border-slate-700 rounded-[12px] flex-col bg-white dark:bg-slate-800 min-h-[535.25px]">
                        <div className="w-full overflow-x-auto md:overflow-x-visible scrollbar-thin">
                            <div className="min-w-[600px] md:min-w-0 pb-2">
                                <div className="grid grid-cols-12 mb-3">
                                    <div className="col-span-5 text-[10px] font-semibold text-slate-300 dark:text-slate-500 uppercase font-inter leading-[15px] tracking-[0.7px]">Metric</div>
                                    <div className="col-span-3 text-[10px] font-semibold text-slate-300 dark:text-slate-500 uppercase font-inter leading-[15px] tracking-[0.7px] text-left">Value</div>
                                    <div className="col-span-2 text-[10px] font-semibold text-slate-300 dark:text-slate-500 uppercase font-inter leading-[15px] tracking-[0.7px] text-left">Vs Prior</div>
                                    <div className="col-span-2 text-[10px] font-semibold text-slate-300 dark:text-slate-500 uppercase font-inter leading-[15px] tracking-[0.7px] text-right">Distribution</div>
                                </div>

                                <div className="space-y-4">
                                    {/* Cost Breakdown */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 ">
                                            <h3 className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase font-inter leading-[15px] tracking-[0.8px] shrink-0">Cost Breakdown</h3>
                                            <div className="flex-1 h-px bg-slate-50 dark:bg-slate-700" />
                                        </div>
                                        {breakdown.map((item, i) => (
                                            <div key={i} className="grid grid-cols-12 items-center group py-1">
                                                <div className="col-span-5 flex items-center gap-2">
                                                    <span className="text-[12.5px] font-normal text-slate-700 dark:text-slate-300 font-inter leading-[18.75px] tracking-[0px]">{item.metric}</span>
                                                    <Info size={14} className="text-slate-300 dark:text-slate-500 cursor-help" />
                                                </div>
                                                <div className="col-span-3 flex flex-col items-start">
                                                    <span className="text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 font-inter leading-[18.75px] tracking-[0px]">{item.value}</span>
                                                    <span className="text-[10.5px] font-normal text-slate-400 dark:text-slate-500 font-inter leading-[15.75px] tracking-[0px]">{item.sub}</span>
                                                </div>
                                                <div className="col-span-2 flex justify-start">
                                                    <div className={`px-2 py-0.5 rounded-[4px] text-[11px] font-medium border ${item.trend.includes('+') ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' :
                                                        item.trend === 'Stable' ? 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-slate-100 dark:border-slate-600' : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 border-red-100 dark:border-red-800'
                                                        }`}>
                                                        {item.trend}
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-700 rounded-full overflow-hidden">
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
                                            <h3 className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase font-inter leading-[15px] tracking-[0.8px] shrink-0">Unit Economics</h3>
                                            <div className="flex-1 h-px bg-slate-50 dark:bg-slate-700" />
                                        </div>
                                        {unitEconomics.map((item, i) => (
                                            <div key={i} className="grid grid-cols-12 items-center py-1">
                                                <div className="col-span-5 flex items-center gap-2">
                                                    <span className="text-[12.5px] font-normal text-slate-700 dark:text-slate-300 font-inter leading-[18.75px] tracking-[0px]">{item.metric}</span>
                                                    <Info size={14} className="text-slate-300 dark:text-slate-500 cursor-help" />
                                                </div>
                                                <div className="col-span-3 flex flex-col items-start">
                                                    <span className="text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 font-inter leading-[18.75px] tracking-[0px]">{item.value}</span>
                                                    <span className="text-[10.5px] font-normal text-slate-400 dark:text-slate-500 font-inter leading-[15.75px] tracking-[0px]">{item.sub}</span>
                                                </div>
                                                <div className="col-span-2 flex justify-start">
                                                    <div className={`px-2 py-0.5 rounded-[4px] text-[11px] font-medium border ${item.trend.includes('-') ? 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 border-red-100 dark:border-red-800' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                                                        }`}>
                                                        {item.trend}
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-700 rounded-full overflow-hidden">
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
                        <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-6 border-t border-slate-50 dark:border-slate-700">
                            <span className="text-[12.5px] font-normal text-slate-400 dark:text-slate-500 font-inter leading-[18.75px] tracking-[0px] shrink-0">Legend:</span>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-[18px] h-[5px] bg-blue-600 rounded-full" />
                                    <span className="text-[12.5px] font-normal text-slate-500 dark:text-slate-400 font-inter leading-[18.75px] tracking-[0px]">Normal</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-[18px] h-[5px] bg-orange-500 rounded-full" />
                                    <span className="text-[12.5px] font-normal text-slate-500 dark:text-slate-400 font-inter leading-[18.75px] tracking-[0px]">Near limit</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-[18px] h-[5px] bg-red-600 rounded-full" />
                                    <span className="text-[12.5px] font-normal text-slate-500 dark:text-slate-400 font-inter leading-[18.75px] tracking-[0px]">Above target</span>
                                </div>
                            </div>
                        </div>
                    </div>





                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300">
                                <Pin size={16} className="-rotate-45" />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-normal text-slate-800 dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">CFO Insights</h3>
                                <p className="text-[12px] text-slate-400 dark:text-slate-500 font-normal font-inter leading-[16px] tracking-[0%]">Powered by AI analysis</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {cfoInsights && cfoInsights.length > 0 ? (
                                cfoInsights.map((insight, idx) => {
                                    const colors = [
                                        { bg: 'bg-blue-50/40 dark:bg-blue-900/20 border-blue-100/50 dark:border-blue-800/30', iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400', bullet: 'bg-blue-500' },
                                        { bg: 'bg-emerald-50/40 dark:bg-emerald-900/20 border-emerald-100/50 dark:border-emerald-800/30', iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400', bullet: 'bg-emerald-500' },
                                        { bg: 'bg-amber-50/40 dark:bg-amber-900/20 border-amber-100/50 dark:border-amber-800/30', iconBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400', bullet: 'bg-amber-500' },
                                        { bg: 'bg-purple-50/40 dark:bg-purple-900/20 border-purple-100/50 dark:border-purple-800/30', iconBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400', bullet: 'bg-purple-500' }
                                    ];
                                    const style = colors[idx % colors.length];
                                    return (
                                        <div key={idx} className={`w-full p-[12px] gap-[10px] rounded-[12px] border ${style.bg} flex flex-col`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-md ${style.iconBg}`}>
                                                    <ShieldCheck size={14} />
                                                </div>
                                                <h4 className="text-[12.5px] font-semibold text-slate-800 dark:text-slate-200 font-inter leading-[18.75px] tracking-[0px]">{insight.title}</h4>
                                            </div>
                                            <p className="text-[11.5px] font-normal text-slate-600 dark:text-slate-400 font-inter leading-[17.25px] tracking-[0px] pl-[34px]">
                                                {insight.description}
                                            </p>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 bg-slate-50/30 dark:bg-slate-800/30 rounded-[12px] border border-dashed border-slate-200 dark:border-slate-700 text-center min-h-[220px]">
                                    <ShieldCheck className="w-8 h-8 text-slate-300 dark:text-slate-500 mb-2" />
                                    <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 font-inter">No CFO Insights Yet</p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-inter max-w-[200px] mt-1 mx-auto">Insights will appear here once financial data is uploaded.</p>
                                </div>
                            )}
                        </div>

                        {/* Analyse CTA */}
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between mt-auto">
                            <div className="space-y-1">
                                <h4 className="text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 font-inter leading-[18.75px] tracking-[0px]">Run Deep Analysis</h4>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-normal font-inter leading-[16.5px] tracking-[0px]">Get AI-generated cost reduction plan</p>
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

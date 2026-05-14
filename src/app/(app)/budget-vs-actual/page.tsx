"use client";

import React, { useState } from 'react';
import {
    Wallet,
    TrendingDown,
    TrendingUp,
    PieChart as PieChartIcon,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    AlertCircle,
    CheckCircle2,
    Briefcase,
    Pin,
    DollarSign,
    SquarePen,
    Plus
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import KPICard from '@/components/common/KPICard';
import DetailedMetricsCard from '@/components/common/DetailedMetricsCard';
import {
    budgetMetrics,
    departmentBudgetData,
    budgetTrendData,
    varianceAnalysisData,
    budgetSummaryData,
    budgetPlanningData
} from '@/data/budgetData';

export default function BudgetVsActual() {
    const [timeframe, setTimeframe] = useState('Quarterly');

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="w-full h-auto sm:h-[64px] flex flex-col sm:flex-row sm:items-center justify-between gap-[10px] pt-[4px] pb-[4px]">
                <div className="space-y-1">
                    <h1 className="text-[24px] font-medium text-slate-800 font-inter leading-[32px] tracking-[0%]">Budget vs Actual</h1>
                    <p className="text-[14px] font-normal text-slate-400 font-inter leading-[20px] tracking-[0%]">Compare planned vs actual performance and manage f.</p>
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
                {budgetMetrics.map((metric, i) => (
                    <KPICard
                        key={i}
                        label={metric.label}
                        value={metric.value}
                        trend={metric.trend}
                        isDown={!metric.isUp}
                        icon={metric.icon}
                        sub={metric.sub}
                        showTrend={false}
                    />
                ))}
            </div>

            {/* Budget vs Actual Summary Table */}
            <div className="w-full h-[410px] bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                <div className="h-[64px] flex items-center justify-between px-6 border-b border-slate-50 bg-slate-50/20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                            <DollarSign size={16} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[13px] font-semibold text-slate-900 font-inter leading-[19.5px] tracking-[0%]">Budget vs Actual Summary</h3>
                            <span className="text-[10.5px] text-slate-400 font-normal font-inter leading-[15.75px] tracking-[0%]">Editable · variance auto-computed</span>
                        </div>
                    </div>
                    <button className="w-[140px] h-[23.75px] flex items-center justify-center gap-[5px] py-[3px] px-[9px] text-[10.5px] font-normal text-slate-400 border border-slate-200 rounded-[6px] hover:bg-slate-50 transition-colors font-inter leading-[15.75px]">
                        <SquarePen size={12} />
                        Click any cell to edit
                    </button>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc] border-b border-[#e2e3f0] h-[36.75px]">
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Metric</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Budget</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Actual</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Variance %</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Formula / Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {budgetSummaryData.map((row, index) => (
                                <tr key={index} className="hover:bg-slate-50/30 transition-colors h-[56px] border-b border-[#f1f5f9]">
                                    <td className="px-6 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-[12.5px] font-medium text-slate-900 font-inter leading-[18.75px]">{row.metric}</span>
                                            {row.isAutoComputed && <span className="text-[10px] text-slate-300 font-normal font-inter leading-[15px] tracking-[0%]">Auto-computed</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter leading-[18.75px]">
                                            {row.isPercentage ? `${row.budget}%` : `$ ${row.budget.toLocaleString()}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter leading-[18.75px]">
                                            {row.isPercentage ? `${row.actual}%` : `$ ${row.actual.toLocaleString()}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className={`w-[62px] h-[20.5px] inline-flex items-center gap-[2px] pt-[2px] pr-[6px] pb-[2px] pl-[4px] rounded-[4px] border text-[11px] font-semibold font-inter leading-[16.5px] ${row.variance < 0
                                            ? 'bg-[#fbf1f2] text-[#dc2626] border-[#eab7bc]'
                                            : 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
                                            }`}>
                                            {row.variance > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                            {Math.abs(row.variance)}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-[12.5px] font-medium text-slate-400 font-inter leading-[18.75px]">{row.notes}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Budget Planning Table */}

            <div className="w-full bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden mb-6">
                <div className="h-[65.25px] flex items-center justify-between pt-[14px] pr-[18px] pb-[14px] pl-[18px] border-b border-[#e2e8f0] bg-[#fafbfc]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                            <DollarSign size={16} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[13px] font-semibold text-slate-900 font-inter leading-[19.5px] tracking-normal">Budget Planning Table</h3>
                            <span className="text-[10.5px] text-slate-400 font-normal font-inter leading-[15.75px] tracking-normal">Editable spreadsheet · changes reflect in forecast summary</span>
                        </div>
                    </div>
                    <button className="w-[121.8px] h-[32px] flex items-center justify-center gap-2 rounded-[7px] border border-[#2563eb] bg-[#eff6ff] text-[#2563eb] text-[12px] font-medium font-inter leading-[18px] transition-colors hover:bg-blue-100">
                        <Plus size={14} />
                        Add Line Item
                    </button>
                </div>

                <div className="overflow-auto h-[1070px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] h-[52.5px]">
                                <th className="px-6 py-0 text-[10.5px] font-bold text-[#64748b] uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[60%]">Metric / Category</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-[#64748b] uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Amount ($)</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-[#64748b] uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%] text-right">% of Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* REVENUE SECTION */}
                            <tr className="bg-[#f8fafc] h-[30px] border-b border-[#e2e8f0]">
                                <td colSpan={3} className="pt-[7px] pr-[18px] pb-[7px] pl-[18px] text-[10px] font-bold text-slate-400 uppercase tracking-[1px] font-inter">REVENUE</td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">1</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">Forecast Revenue</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 145,000</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">100 <span className="text-[10px] text-slate-300">%</span></td>
                            </tr>

                            {/* DIRECT COSTS SECTION */}
                            <tr className="bg-[#f8fafc] h-[30px] border-b border-[#e2e8f0]">
                                <td colSpan={3} className="pt-[7px] pr-[18px] pb-[7px] pl-[18px] text-[10px] font-bold text-slate-400 uppercase tracking-[1px] font-inter">DIRECT & VARIABLE COSTS</td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">2</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">Variable Costs</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 28,500</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">19.7 <span className="text-[10px] text-slate-300">%</span></td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">3</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">Logistics Costs</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 12,200</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">8.4 <span className="text-[10px] text-slate-300">%</span></td>
                            </tr>

                            {/* OPERATING EXPENSES SECTION */}
                            <tr className="bg-[#f8fafc] h-[30px] border-b border-[#e2e8f0]">
                                <td colSpan={3} className="pt-[7px] pr-[18px] pb-[7px] pl-[18px] text-[10px] font-bold text-slate-400 uppercase tracking-[1px] font-inter">OPERATING EXPENSES</td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">4</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">Operating Expenses</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 18,400</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">12.7 <span className="text-[10px] text-slate-300">%</span></td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">5</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">Sales & Marketing</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 14,200</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">9.8 <span className="text-[10px] text-slate-300">%</span></td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">6</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">General & Admin</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 8,600</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">5.9 <span className="text-[10px] text-slate-300">%</span></td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">7</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">Financial Costs</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 3,200</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">2.2 <span className="text-[10px] text-slate-300">%</span></td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">8</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">Hiring & HR</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 6,800</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">4.7 <span className="text-[10px] text-slate-300">%</span></td>
                            </tr>

                            {/* GROWTH & EXPANSION SECTION */}
                            <tr className="bg-[#f8fafc] h-[30px] border-b border-[#e2e8f0]">
                                <td colSpan={3} className="pt-[7px] pr-[18px] pb-[7px] pl-[18px] text-[10px] font-bold text-slate-400 uppercase tracking-[1px] font-inter">GROWTH & EXPANSION</td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">9</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">Operations Expansion</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 9,500</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">6.6 <span className="text-[10px] text-slate-300">%</span></td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">10</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">CAPEX</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 12,000</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">8.3 <span className="text-[10px] text-slate-300">%</span></td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">11</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">Financing</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 4,800</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">3.3 <span className="text-[10px] text-slate-300">%</span></td>
                            </tr>

                            {/* LEADERSHIP & COMPLIANCE SECTION */}
                            <tr className="bg-[#f8fafc] h-[30px] border-b border-[#e2e8f0]">
                                <td colSpan={3} className="pt-[7px] pr-[18px] pb-[7px] pl-[18px] text-[10px] font-bold text-slate-400 uppercase tracking-[1px] font-inter">LEADERSHIP & COMPLIANCE</td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">12</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">Leadership Costs</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 8,200</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">5.7 <span className="text-[10px] text-slate-300">%</span></td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">13</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">Compliance</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 2,400</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">1.7 <span className="text-[10px] text-slate-300">%</span></td>
                            </tr>

                            {/* FINANCIAL SUMMARY SECTION */}
                            <tr className="bg-[#f8fafc] h-[30px] border-b border-[#e2e8f0]">
                                <td colSpan={3} className="pt-[7px] pr-[18px] pb-[7px] pl-[18px] text-[10px] font-bold text-slate-400 uppercase tracking-[1px] font-inter">FINANCIAL SUMMARY</td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] bg-emerald-50/10 hover:bg-emerald-50/20 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[14px] font-bold text-emerald-600 font-inter text-center">Σ</span>
                                        <div className="flex flex-col">
                                            <span className="text-[12.5px] font-medium text-slate-900 font-inter leading-[18.75px]">Forecast Profit</span>
                                            <span className="text-[10px] text-slate-400 font-normal font-inter leading-[15px]">Revenue - All Expenses</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-emerald-600 font-inter">$ 16,200</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-emerald-600 font-inter">11.2 <span className="text-[10px] text-emerald-300">%</span></td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">14</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">Forecast Cash Position</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">$ 32,800</td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">—</td>
                            </tr>
                            <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-0">
                                    <div className="flex items-center gap-6">
                                        <span className="w-6 text-[11px] font-medium text-slate-300 font-inter text-center">15</span>
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter">Expected Growth Rate</span>
                                    </div>
                                </td>
                                <td className="px-6 py-0 text-[12.5px] font-medium text-slate-600 font-inter">18.2 <span className="text-[10px] text-slate-300">%</span></td>
                                <td className="px-6 py-0 text-right pr-12 text-[12.5px] font-medium text-slate-600 font-inter">—</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="h-[55px] flex items-center pt-[11px] pr-[18px] pl-[50px] border-t border-[#f1f5f9] bg-white">
                    <button className="w-[1089px] h-[34px] flex items-center justify-center gap-2 rounded-[7px] border border-dashed border-[#cbd5e1] text-[#64748b] text-[12px] font-medium font-inter leading-[18px] transition-all hover:bg-slate-50 hover:border-slate-400">
                        <Plus size={14} />
                        Add Line Item
                    </button>
                </div>

            </div>

        </div>
    );
}

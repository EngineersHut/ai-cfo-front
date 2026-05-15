"use client";

import React from 'react';
import {
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Wallet,
    PieChart,
    Activity,
    ArrowLeft,
    Sparkles
} from 'lucide-react';
import KPICard from '@/components/common/KPICard';
import { revenueData, expenseBreakdownData } from '@/data/reportsData';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart as RePieChart,
    Pie,
    Cell,
    Area,
    AreaChart
} from 'recharts';

interface ReportDetailProps {
    reportId?: string;
    onBack: () => void;
}

export default function ReportDetail({ reportId, onBack }: ReportDetailProps) {
    const [revenueTimeframe, setRevenueTimeframe] = React.useState<'Weekly' | 'Monthly'>('Monthly');
    const [expenseTimeframe, setExpenseTimeframe] = React.useState<'Weekly' | 'Monthly'>('Monthly');

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="w-full bg-white rounded-[12px] border border-slate-100 p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-16">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 font-inter uppercase tracking-wider">Period</p>
                        <p className="text-[16px] font-medium text-slate-800 font-inter">March 2025</p>
                    </div>
                    <div className="w-[1px] h-10 bg-slate-100" />
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 font-inter uppercase tracking-wider">Type</p>
                        <p className="text-[16px] font-medium text-slate-800 font-inter">Monthly</p>
                    </div>
                    <div className="w-[1px] h-10 bg-slate-100" />
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 font-inter uppercase tracking-wider">Range</p>
                        <p className="text-[16px] font-medium text-slate-800 font-inter">Mar 1 – 31, 2025</p>
                    </div>
                </div>

                <div className="px-3 py-1 bg-[#f0fdf4] border border-[#dcfce7] rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                    <span className="text-[11px] font-bold text-[#166534] font-inter uppercase tracking-wider">Processed</span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    icon={<DollarSign size={16} />}
                    label="Revenue"
                    value="$128,400"
                    trend="+12.5%"
                    sub="vs last mo."
                />
                <KPICard
                    icon={<PieChart size={16} />}
                    label="Net Profit"
                    value="$32,800"
                    trend="1.5%"
                    sub="vs last mo."
                />
                <KPICard
                    icon={<Wallet size={16} />}
                    label="Expense"
                    value="$95,600"
                    trend="1.2%"
                    sub="savings optimized"
                    isDown={true}
                />
                <KPICard
                    icon={<Activity size={16} />}
                    label="Cash Flow"
                    value="$42,100"
                    sub="Health index: 94"
                    noTrendIcon={true}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Revenue Over Time Chart */}
                <div className="lg:col-span-3 bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="h-[54px] flex items-center justify-between p-[12px] border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                <DollarSign size={16} />
                            </div>
                            <h3 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Revenue Over Time</h3>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setRevenueTimeframe('Weekly')}
                                className={`w-[72px] h-[30px] px-[12px] py-[5px] flex items-center justify-center gap-[6px] rounded-[8px] text-[12px] font-medium transition-all duration-200 ${revenueTimeframe === 'Weekly'
                                    ? 'bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)]'
                                    : 'bg-white border border-[#e2e8f0] text-slate-500 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:text-slate-700'}`}
                            >
                                Weekly
                            </button>
                            <button
                                onClick={() => setRevenueTimeframe('Monthly')}
                                className={`w-[72px] h-[30px] px-[12px] py-[5px] flex items-center justify-center gap-[6px] rounded-[8px] text-[12px] font-medium transition-all duration-200 ${revenueTimeframe === 'Monthly'
                                    ? 'bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)]'
                                    : 'bg-white border border-[#e2e8f0] text-slate-500 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:text-slate-700'}`}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>
                    <div className="h-[492px] flex-1 w-full relative py-[12px] px-[16px] flex flex-col gap-[12px]">
                        <div className="flex-1 w-full relative rounded-[10px] border border-[rgba(26,21,83,0.08)] bg-slate-50/30 flex flex-col overflow-hidden">
                            <div className="flex-1 w-full relative p-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                                            tickFormatter={(value) => `${value / 100}k`}
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
                                        <Area
                                            type="monotone"
                                            dataKey="netProfit"
                                            stroke="#fbbf24"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorProfit)"
                                            activeDot={{ r: 6, fill: "#fff", stroke: "#fbbf24", strokeWidth: 3 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Chart Legend - Styled inside the inner box */}
                            <div className="flex items-center justify-center gap-8 py-3 bg-white border-t border-[rgba(26,21,83,0.08)]">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
                                    <span className="text-[14px] font-normal text-slate-500 font-inter leading-[132%] capitalize tracking-[0%]">Revenue</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                                    <span className="text-[14px] font-normal text-slate-500 font-inter leading-[132%] capitalize tracking-[0%]">Net Profit</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expense Breakdown Chart */}
                <div className="lg:col-span-2 bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="h-[54px] flex items-center justify-between p-[12px] border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                <PieChart size={16} />
                            </div>
                            <h3 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Expense Breakdown</h3>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setExpenseTimeframe('Weekly')}
                                className={`w-[72px] h-[30px] px-[12px] py-[5px] flex items-center justify-center gap-[6px] rounded-[8px] text-[12px] font-medium transition-all duration-200 ${expenseTimeframe === 'Weekly'
                                    ? 'bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)]'
                                    : 'bg-white border border-[#e2e8f0] text-slate-500 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:text-slate-700'}`}
                            >
                                Weekly
                            </button>
                            <button
                                onClick={() => setExpenseTimeframe('Monthly')}
                                className={`w-[72px] h-[30px] px-[12px] py-[5px] flex items-center justify-center gap-[6px] rounded-[8px] text-[12px] font-medium transition-all duration-200 ${expenseTimeframe === 'Monthly'
                                    ? 'bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)]'
                                    : 'bg-white border border-[#e2e8f0] text-slate-500 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:text-slate-700'}`}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center h-[340px]">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={240}>
                                <RePieChart>
                                    <Pie
                                        data={expenseBreakdownData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {expenseBreakdownData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RePieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-10px]">
                                <span className="text-[12px] text-slate-400 font-medium font-inter">Total</span>
                                <span className="text-[24px] font-bold text-slate-800 font-inter leading-none">$320.50</span>
                            </div>
                        </div>

                        {/* Custom Legend */}
                        <div className="grid grid-cols-2 gap-x-2 gap-y-3  w-full ">
                            {expenseBreakdownData.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[13px] font-medium text-[#0a092e] font-inter leading-[20px] tracking-[0%]">
                                        {item.name} ({item.value}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Insights and Comparison Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* AI Insights */}
                <div className="lg:col-span-3 bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="h-[54px] flex items-center p-[12px] gap-3 border-b border-slate-50">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <Sparkles size={16} />
                        </div>
                        <h3 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">AI Insights</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex gap-4">
                            <div className="w-1 bg-[#2563eb] rounded-full shrink-0" />
                            <div className="space-y-2">
                                <span className="px-2 py-0.5 bg-[#eff6ff] text-[#2563eb] text-[11px] font-bold rounded-[4px] font-inter">Bank statements (40%)</span>
                                <p className="text-[14px] text-slate-600 font-inter leading-[22px]">
                                    Revenue growth driven by increased customer retention and reduced churn in the enterprise segment.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1 bg-[#f59e0b] rounded-full shrink-0" />
                            <div className="space-y-2">
                                <span className="px-2 py-0.5 bg-[#fffbeb] text-[#f59e0b] text-[11px] font-bold rounded-[4px] font-inter">Income statements (40%)</span>
                                <p className="text-[14px] text-slate-600 font-inter leading-[22px]">
                                    Revenue growth driven by increased customer retention and reduced churn in the enterprise segment.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1 bg-[#22c55e] rounded-full shrink-0" />
                            <div className="space-y-2">
                                <span className="px-2 py-0.5 bg-[#f0fdf4] text-[#22c55e] text-[11px] font-bold rounded-[4px] font-inter">Tax Document (10%)</span>
                                <p className="text-[14px] text-slate-600 font-inter leading-[22px]">
                                    Revenue growth driven by increased customer retention and reduced churn in the enterprise segment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparison Card */}
                <div className="lg:col-span-2 bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="h-[54px] flex items-center p-[12px] gap-3 border-b border-slate-50">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <TrendingUp size={16} />
                        </div>
                        <h3 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Comparison with Prev. Period</h3>
                    </div>
                    <div className="px-[33px] py-[16px] space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] font-normal text-[#0f172a] font-inter leading-[20px] tracking-[0%]">Revenue</span>
                            <div className="flex items-center gap-2 text-[#22c55e]">
                                <ArrowUpRight size={16} />
                                <span className="text-[14px] font-bold font-inter">10%</span>
                            </div>
                        </div>
                        <div className="w-full h-[1px] bg-slate-50" />
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] font-normal text-[#0f172a] font-inter leading-[20px] tracking-[0%]">Profit</span>
                            <div className="flex items-center gap-2 text-[#22c55e]">
                                <ArrowUpRight size={16} />
                                <span className="text-[14px] font-bold font-inter">8%</span>
                            </div>
                        </div>
                        <div className="w-full h-[1px] bg-slate-50" />
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] font-normal text-[#0f172a] font-inter leading-[20px] tracking-[0%]">Expenses</span>
                            <div className="flex items-center gap-2 text-[#22c55e]">
                                <ArrowDownRight size={16} />
                                <span className="text-[14px] font-bold font-inter">3%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

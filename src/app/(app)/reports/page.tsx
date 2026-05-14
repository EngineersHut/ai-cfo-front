"use client";

import React, { useState } from 'react';
import {
    List,
    Activity,
    Plus,
    Search,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Table as TableIcon,
    ChevronDown,
    FileText
} from 'lucide-react';

import { reportsData } from '@/data/reportsData';

export default function ReportsPage() {
    const [view, setView] = useState<'list' | 'timeline'>('list');
    const [activePeriod, setActivePeriod] = useState<string>('Jan 2025');

    return (
        <div className="flex flex-col gap-5 p-[12px] max-w-[1400px] mx-auto animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <div className="space-y-1">
                    <h1 className="text-[24px] font-medium text-slate-800 font-inter leading-[32px] tracking-[0%]">Report Timeline</h1>
                    <p className="text-[14px] font-normal text-slate-400 font-inter leading-[20px] tracking-[0%]">Your Q1 2026 financial performance metrics have been consolidated. AI CFO has identified 3 key optimization trends..</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="w-[290px] h-[48px] p-[5px] flex items-center bg-white border border-[#e2e8f0] rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]">
                        <button
                            onClick={() => setView('list')}
                            className={`flex-1 h-[36px] flex items-center justify-center gap-[10px] px-[12px] py-[4px] rounded-[8px] text-[14px] font-normal font-inter leading-[20px] transition-all whitespace-nowrap ${view === 'list'
                                ? 'bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)] border border-white/10'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <List size={18} />
                            List View
                        </button>
                        <button
                            onClick={() => setView('timeline')}
                            className={`flex-1 h-[36px] flex items-center justify-center gap-[10px] px-[12px] py-[4px] rounded-[8px] text-[14px] font-normal font-inter leading-[20px] transition-all whitespace-nowrap ${view === 'timeline'
                                ? 'bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)] border border-white/10'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Activity size={18} />
                            Timeline View
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <select defaultValue="Monthly" className="appearance-none w-[105px] h-[36px] pt-[4px] pr-[32px] pb-[4px] pl-[12px] bg-white border border-[#e2e8f0] rounded-[8px] text-[14px] font-medium text-[#131b2e] font-inter leading-[20px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all">
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <button className="w-[130px] h-[36px] flex items-center justify-center gap-[6px] pt-[4px] pr-[12px] pb-[4px] pl-[12px] bg-[#2563eb] text-white rounded-[8px] border border-white/10 text-[14px] font-normal font-inter leading-[20px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)] hover:bg-blue-700 transition-all">
                            <Plus size={18} />
                            Add Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {view === 'list' ? (
                <div className="w-full h-[523px] bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    {/* Table Header Controls */}
                    <div className="h-[60px] flex items-center justify-between p-[12px] border-b border-[#f2f2f3] bg-white gap-[12px]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                <TableIcon size={16} />
                            </div>
                            <h3 className="text-[16px] font-normal text-[#131b2e] font-inter leading-[24px]">Raw Data Table</h3>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-[247px] h-[36px] pl-10 pr-4 bg-white border border-[#e2e8f0] rounded-[8px] text-[13px] font-inter focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]"
                            />
                        </div>
                    </div>

                    {/* Main Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f6f8fa] border-b border-[#f1f5f9] h-[70px]">
                                    <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-normal w-[225.6px] border-r border-[#f1f5f9]">Period</th>
                                    <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-normal text-center w-[225.6px] border-r border-[#f1f5f9]">Report Type</th>
                                    <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-normal text-center w-[225.6px] border-r border-[#f1f5f9]">Status</th>
                                    <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-normal text-center w-[225.6px] border-r border-[#f1f5f9]">Date Range</th>
                                    <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-normal text-center w-[225.6px]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f5f9]">
                                {reportsData.map((report) => (
                                    <tr key={report.id} className="h-[70px] hover:bg-slate-50/50 transition-colors group border-b border-[#f1f5f9]">
                                        <td className="px-[24px] py-[16px] text-[14px] font-medium text-[#0a092e] font-inter leading-[20px] w-[225.6px] border-r border-[#f1f5f9]">
                                            {report.period}
                                        </td>
                                        <td className="px-[24px] py-[16px] text-center text-[14px] font-medium text-[#0a092e] font-inter leading-[20px] w-[225.6px] border-r border-[#f1f5f9]">
                                            {report.type}
                                        </td>
                                        <td className="px-[24px] py-[16px] text-center w-[225.6px] border-r border-[#f1f5f9]">
                                            <div className="inline-flex items-center justify-center gap-[6px] w-[92px] h-[20px] rounded-[4px] bg-[#f2fffa] border border-[#bee5d0] text-[#2cac68] text-[14px] font-normal font-inter leading-[20px]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#2cac68]" />
                                                {report.status}
                                            </div>
                                        </td>
                                        <td className="px-[24px] py-[16px] text-center text-[14px] font-medium text-[#0a092e] font-inter leading-[20px] w-[225.6px] border-r border-[#f1f5f9]">
                                            {report.dateRange}
                                        </td>
                                        <td className="px-[24px] py-[16px] text-center w-[225.6px]">
                                            <button className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="w-full bg-white rounded-[16px] border border-slate-100 p-[12px] shadow-sm">
                    {/* Timeline Header */}
                    <div className="h-[52px] flex items-center gap-[12px] p-[12px] border-b border-[#f2f2f3] bg-white mb-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                            <Activity size={16} />
                        </div>
                        <h2 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px]">Timeline View</h2>
                    </div>

                    {/* Timeline Slider Container */}
                    <div className="relative pt-3 pb-8 overflow-hidden">
                        {/* Timeline Line - Positioned to hit dot center */}
                        <div className="absolute top-[73px] left-0 w-full h-[2px] bg-slate-100 z-0" />

                        <div className="flex items-start gap-8 overflow-x-auto no-scrollbar pb-4 relative z-10">
                            {reportsData.map((report, idx) => (
                                <div
                                    key={report.id}
                                    className="flex-shrink-0 w-[280px] flex flex-col items-center cursor-pointer"
                                    onClick={() => setActivePeriod(report.period)}
                                >
                                    {/* Month Label - Positioned above the line */}
                                    <span className={`text-[12px] font-bold font-inter mb-[32px] uppercase tracking-widest transition-colors duration-300 ${activePeriod === report.period ? 'text-[#5345cc]' : 'text-slate-400'}`}>
                                        {report.period}
                                    </span>

                                    {/* Node Dot - Centered on the line */}
                                    <div className="relative mb-4   h-6 flex items-center justify-center">
                                        {activePeriod === report.period ? (
                                            <div className="w-6 h-6 rounded-full border-[4px] border-[#5345cc] bg-white z-20 shadow-sm transition-all duration-300" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full bg-[#f1f5f9] flex items-center justify-center z-10">
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Card */}
                                    <div className={`w-full p-6 rounded-[24px] border transition-all duration-300 shadow-sm relative group ${activePeriod === report.period
                                        ? 'bg-[#5345cc] border-[#5345cc] text-white shadow-xl shadow-[#5345cc]/20 scale-[1.02] z-20'
                                        : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
                                        }`}>
                                        {/* Status Badge */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${activePeriod === report.period
                                                ? 'bg-white/10 border-white/20 text-white'
                                                : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                                }`}>
                                                <div className={`w-1 h-1 rounded-full ${activePeriod === report.period ? 'bg-white' : 'bg-emerald-500'}`} />
                                                {report.status}
                                            </div>
                                            <button className={`${activePeriod === report.period ? 'text-white/60 hover:text-white' : 'text-slate-300 hover:text-slate-500'}`}>
                                                <ChevronDown size={18} />
                                            </button>
                                        </div>

                                        {/* Title & Desc */}
                                        <h4 className={`text-[16px] font-bold font-inter mb-2 ${activePeriod === report.period ? 'text-white' : 'text-slate-800'}`}>
                                            {report.type}
                                        </h4>
                                        <p className={`text-[13px] font-normal font-inter leading-relaxed mb-6 ${activePeriod === report.period ? 'text-white/80' : 'text-slate-500'}`}>
                                            {idx === 0 ? 'Verified and matches expected balance' :
                                                idx === 1 ? 'Successfully validated and accepted' :
                                                    idx === 2 ? 'Format not supported, needs re-upload' :
                                                        'Verified and processed successfully'}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-current/10">
                                            <div className="flex items-center gap-2">
                                                {activePeriod === report.period ? (
                                                    <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-white">
                                                        <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                                                        IN PROGRESS
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
                                                        <FileText size={14} />
                                                        {report.dateRange.split(' - ')[1]}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

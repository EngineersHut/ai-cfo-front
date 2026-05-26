"use client";

import React, { useState } from 'react';
import Modal from '../../../../components/common/Modal';
import {
    TrendingUp,
    Cpu,
    Layers,
    Download,
    CheckCircle,
    CheckCircle2,
    FileSpreadsheet,
    Link as LinkIcon,
    ChevronDown,
    FileText,
    Trash2,
    X,
    Info,
    Pin
} from 'lucide-react';
import {
    ResponsiveContainer,
    LineChart as ReLineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts';
import { aiInsightsData } from '@/data/dashboardData';

interface ExportReportProps {
    reportName?: string;
    onFinalize: () => void;
    onTriggerToast: (msg: string) => void;
}

export default function ExportReport({ reportName, onFinalize, onTriggerToast }: ExportReportProps) {
    const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [includeSections, setIncludeSections] = useState({
        kpiSummary: true,
        visualCharts: true,
        aiInsights: true,
        rawTransactions: false
    });

    // Double Series Chart Data matching the exact curve in screenshot (Revenue vs Net Profit)
    const doubleSeriesChartData = [
        { month: 'Jan', revenue: 34000, netProfit: 41000 },
        { month: 'Feb', revenue: 34000, netProfit: 41000 },
        { month: 'Mar', revenue: 29000, netProfit: 34000 },
        { month: 'Apr', revenue: 29000, netProfit: 34000 },
        { month: 'May', revenue: 41000, netProfit: 28000 },
        { month: 'Jun', revenue: 41000, netProfit: 28000 },
        { month: 'Jul', revenue: 53000, netProfit: 31000 },
        { month: 'Aug', revenue: 41000, netProfit: 37000 },
        { month: 'Sep', revenue: 41000, netProfit: 37000 },
        { month: 'Oct', revenue: 32000, netProfit: 42000 },
        { month: 'Nov', revenue: 41000, netProfit: 36000 },
        { month: 'Dec', revenue: 41000, netProfit: 36000 },
    ];

    return (
        <div className="space-y-6 animate-in zoom-in-95 duration-500 pb-10">

            {/* Header bar matching exact screenshot */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-5">
                <div className="space-y-1">
                    <h1 className="text-[26px] font-bold text-slate-850 font-inter tracking-tight">Export Report</h1>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[13.5px] font-medium text-slate-400 font-inter">Financial Intelligence Division -</span>
                        <span className="text-[13.5px] font-bold text-slate-700 font-inter">
                            {reportName || "Financial Summary March 2026"}
                        </span>
                    </div>
                </div>
                <div className="text-left md:text-right mt-3 md:mt-0">
                    <span className="text-[16px] font-bold text-[#8c5cf6] font-inter uppercase tracking-wide">REPORT #4402-25</span>
                    <p className="text-[12px] text-slate-400 font-inter mt-0.5">Generated: March 14, 2025</p>
                </div>
            </div>

            {/* Success notification banner exactly as shown in screenshot */}
            <div className="w-full bg-[#e8f5e9] border border-[#c8e6c9]/50 h-[48px] px-4 rounded-[8px] flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2e7d32] flex items-center justify-center text-white shrink-0">
                    <CheckCircle size={13} className="text-white" />
                </div>
                <span className="text-[13.5px] font-medium text-[#2e7d32] font-inter">Your report has been generated successfully</span>
            </div>

            {/* Three Columns Forecast KPIs Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* KPI 1: Revenue Forecast */}
                <div className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between min-h-[142px]">
                    <div className="flex items-center justify-between pb-1">
                        <div className="flex items-center gap-2.5 text-[#64748b]">
                            <div className="w-[32px] h-[32px] bg-[#f8fafc] border border-slate-100 rounded-[8px] flex items-center justify-center text-[#64748b] shrink-0 shadow-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 20a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V10c0-2 1.5-4 4-5V3a2 2 0 0 1 4 0v2c2.5 1 4 3 4 5v10Z" />
                                    <path d="M8 8h8" />
                                    <path d="M12 12v6" />
                                    <path d="M9.5 15h5" />
                                </svg>
                            </div>
                            <span className="text-[14px] font-normal font-inter leading-[20px] text-[#64748b]">Revenue Forecast</span>
                        </div>
                        <span className="w-[100px] h-[24px] pt-[4px] pr-[8px] pb-[4px] pl-[8px] rounded-[4px] bg-[#f1f5f9] text-[12px] font-normal font-inter leading-[16px] text-[#0f172a] align-middle flex items-center justify-center">Next 3 months</span>
                    </div>

                    {/* Horizontal Divider Line */}
                    <div className="w-full border-t border-slate-100 my-2" />

                    <div className="flex items-end justify-between pt-1">
                        <div className="space-y-0.5">
                            <h2 className="text-[26px] font-bold text-slate-800 font-inter leading-none">$128,400</h2>
                            <span className="text-[11.5px] text-slate-400 font-inter">vs last mo.</span>
                        </div>
                        <span className="text-[11.5px] font-bold px-2.5 py-1 rounded-[6px] border border-[#a5d6a7]/60 bg-[#e8f5e9] text-[#2e7d32] font-inter">
                            ↗ +12.5%
                        </span>
                    </div>
                </div>

                {/* KPI 2: Profit Forecast */}
                <div className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between min-h-[142px]">
                    <div className="flex items-center justify-between pb-1">
                        <div className="flex items-center gap-2.5 text-[#64748b]">
                            <div className="w-[32px] h-[32px] bg-[#f8fafc] border border-slate-100 rounded-[8px] flex items-center justify-center text-[#64748b] shrink-0 shadow-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="8" width="14" height="13" rx="2" />
                                    <path d="M7 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2" />
                                    <path d="M7 12h6" />
                                    <path d="M7 16h4" />
                                </svg>
                            </div>
                            <span className="text-[14px] font-normal font-inter leading-[20px] text-[#64748b]">Profit Forecast</span>
                        </div>
                        <span className="w-[100px] h-[24px] pt-[4px] pr-[8px] pb-[4px] pl-[8px] rounded-[4px] bg-[#f1f5f9] text-[12px] font-normal font-inter leading-[16px] text-[#0f172a] align-middle flex items-center justify-center">Next 3 months</span>
                    </div>

                    {/* Horizontal Divider Line */}
                    <div className="w-full border-t border-slate-100 my-2" />

                    <div className="flex items-end justify-between pt-1">
                        <div className="space-y-0.5">
                            <h2 className="text-[26px] font-bold text-slate-800 font-inter leading-none">$32,800</h2>
                            <span className="text-[11.5px] text-slate-400 font-inter">vs last mo.</span>
                        </div>
                        <span className="text-[11.5px] font-bold px-2.5 py-1 rounded-[6px] border border-[#a5d6a7]/60 bg-[#e8f5e9] text-[#2e7d32] font-inter">
                            ↗ 1.5%
                        </span>
                    </div>
                </div>

                {/* KPI 3: Cash Flow Forecast */}
                <div className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between min-h-[142px]">
                    <div className="flex items-center justify-between pb-1">
                        <div className="flex items-center gap-2.5 text-[#64748b]">
                            <div className="w-[32px] h-[32px] bg-[#f8fafc] border border-slate-100 rounded-[8px] flex items-center justify-center text-[#64748b] shrink-0 shadow-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M12 2v2" />
                                    <path d="M12 20v2" />
                                    <path d="M2 12h2" />
                                    <path d="M20 12h2" />
                                </svg>
                            </div>
                            <span className="text-[14px] font-normal font-inter leading-[20px] text-[#64748b]">Cash Flow Forecast</span>
                        </div>
                        <span className="w-[100px] h-[24px] pt-[4px] pr-[8px] pb-[4px] pl-[8px] rounded-[4px] bg-[#f1f5f9] text-[12px] font-normal font-inter leading-[16px] text-[#0f172a] align-middle flex items-center justify-center">Next 3 months</span>
                    </div>

                    {/* Horizontal Divider Line */}
                    <div className="w-full border-t border-slate-100 my-2" />

                    <div className="flex items-end justify-between pt-1">
                        <div className="space-y-0.5">
                            <h2 className="text-[26px] font-bold text-slate-800 font-inter leading-none">$42,100</h2>
                            <span className="text-[11.5px] text-slate-400 font-inter">Health index: 94</span>
                        </div>
                        <span className="text-[11.5px] font-bold px-2.5 py-1 rounded-[6px] border border-[#a5d6a7]/60 bg-[#e8f5e9] text-[#2e7d32] font-inter">
                            Stable
                        </span>
                    </div>
                </div>
            </div>

            {/* Double Columns: Revenue Analysis Recharts + Export Config */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">

                {/* Left Card: Revenue Analysis Chart */}
                <div className="lg:col-span-2 bg-white rounded-[16px] border border-slate-100 p-5 shadow-sm flex flex-col justify-between min-h-[420px]">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                        <div className="flex items-center gap-2 text-slate-800 font-inter font-bold">
                            <TrendingUp size={18} className="text-violet-500" />
                            <span>Revenue Analysis</span>
                        </div>
                    </div>

                    {/* Line Chart Section */}
                    <div className="h-[280px] w-full relative">
                        {/* Dotted vertical projection line at July exactly matching screenshot */}
                        <div className="absolute left-[54%] top-[10%] bottom-[8%] w-0 border-r-2 border-dashed border-slate-300 pointer-events-none" />

                        {/* Custom Tooltip floating indicator inside graph exactly like the mockup! */}
                        <div className="absolute top-[26%] left-[34%] bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-4 py-3 z-10 flex flex-col gap-1.5 animate-bounce font-inter">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#8c5cf6]" />
                                <span className="text-[12.5px] font-bold text-slate-800">$4,502</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                                <span className="text-[12.5px] font-bold text-slate-600">2,589</span>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <ReLineChart data={doubleSeriesChartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                <Tooltip cursor={{ stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '3 3' }} />
                                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 5, fill: '#fff', stroke: '#8b5cf6', strokeWidth: 2 }} activeDot={{ r: 7 }} />
                                <Line type="monotone" dataKey="netProfit" stroke="#f97316" strokeWidth={2.5} dot={{ r: 5, fill: '#fff', stroke: '#f97316', strokeWidth: 2 }} activeDot={{ r: 7 }} />
                            </ReLineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Chart Custom Legend matching mockup perfectly */}
                    <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-600" />
                            <span className="text-[12px] font-medium text-slate-500 font-inter">Revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#fca5a5]" />
                            <span className="text-[12px] font-medium text-slate-500 font-inter">Net Profit</span>
                        </div>
                    </div>
                </div>

                {/* Right Card: Export Configuration Controls */}
                <div className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-sm flex flex-col justify-between min-h-[420px]">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-1">
                            <Layers size={18} className="text-[#0f172a]" />
                            <span className="text-[16px] font-normal font-inter leading-[24px] text-[#0f172a]">Export Configuration</span>
                        </div>

                        {/* File Format Selector Buttons */}
                        <div className="space-y-2">
                            <label className="text-[14px] font-medium font-inter leading-[20px] text-black">File Format</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'pdf', title: 'PDF', icon: Download },
                                    { id: 'csv', title: 'CSV', icon: FileText },
                                    { id: 'excel', title: 'Excel', icon: FileSpreadsheet }
                                ].map((fmt) => {
                                    const Icon = fmt.icon;
                                    return (
                                        <button
                                            key={fmt.id}
                                            type="button"
                                            onClick={() => setExportFormat(fmt.id as any)}
                                            className={`h-[38px] px-3 rounded-[8px] flex items-center justify-center gap-1.5 text-[12.5px] font-semibold font-inter transition-all ${exportFormat === fmt.id
                                                ? 'bg-[#2563eb] text-white shadow-sm'
                                                : 'bg-[#f8fafc] border border-slate-200 text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >
                                            <Icon size={14} />
                                            {fmt.title}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reporting Period Selector */}
                        <div className="space-y-2">
                            <label className="text-[14px] font-medium  font-inter leading-[20px] text-black">Reporting Period</label>
                            <div className="relative pt-2 group">
                                <select
                                    className="w-full h-[38px] pl-3 pr-10 border border-slate-200 rounded-[8px] text-[13px] font-inter focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm bg-white cursor-pointer appearance-none"
                                    defaultValue="current"
                                >
                                    <option value="current">March 2025 (Current)</option>
                                    <option value="q1">Q1 2025 Baseline</option>
                                    <option value="fy25">Full Year 2025</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors pointer-events-none">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Include Sections Checkbox Group */}
                        <div className="space-y-2.5">
                            <label className="text-[14px] font-medium font-inter leading-[20px] text-black">Include Sections</label>
                            <div className="space-y-2 pt-2">
                                {[
                                    { id: 'kpiSummary', label: 'KPI Summary' },
                                    { id: 'visualCharts', label: 'Visual Charts' },
                                    { id: 'aiInsights', label: 'AI Insights' },
                                    { id: 'rawTransactions', label: 'Raw Transactional Data' }
                                ].map((sec) => (
                                    <label key={sec.id} className="flex items-center gap-3 cursor-pointer group select-none">
                                        <div className="relative flex items-center justify-center shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={(includeSections as any)[sec.id]}
                                                onChange={(e) => setIncludeSections(prev => ({ ...prev, [sec.id]: e.target.checked }))}
                                                className="absolute opacity-0 w-0 h-0 cursor-pointer"
                                            />
                                            <div
                                                className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-all duration-200 ${(includeSections as any)[sec.id]
                                                    ? 'bg-[#2563eb] border-[#2563eb]'
                                                    : 'bg-white border-[#cbd5e1] hover:border-[#94a3b8]'
                                                    }`}
                                            >
                                                {(includeSections as any)[sec.id] && (
                                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-white stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1.5 4L4 6.5L8.5 1.5" stroke="white" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-[12px] font-normal font-inter leading-[16px] text-[#0f172a] transition-colors">{sec.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Configuration Card Footer Action buttons */}
                    <div className="space-y-3 pt-5 border-t border-slate-50 mt-6">
                        <button
                            type="button"
                            onClick={onFinalize}
                            className="w-full h-[40px] bg-[#2563eb] hover:bg-blue-700 text-white font-semibold font-inter text-[13.5px] rounded-[8px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.15)]"
                        >
                            <Trash2 size={14} />
                            Delete Report
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsShareModalOpen(true)}
                            className="w-full h-[40px] bg-[#f8fafc] hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold font-inter text-[13.5px] rounded-[8px] flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                            <LinkIcon size={14} />
                            Generate Share Link
                        </button>
                        <p className="text-[10.5px] text-slate-400 font-inter text-center leading-relaxed px-2">
                            Exporting a secure link will allow stakeholders to view this live report for 7 days. Encrypted with AES-256 standards.
                        </p>
                    </div>
                </div>

            </div>
            <div className="w-full h-auto md:h-[174px] bg-white rounded-[12px] border border-slate-100 shadow-sm overflow-hidden pb-4 md:pb-0">
                {/* Header */}
                <div className="h-[54px] flex items-center p-[12px] gap-[12px] border-b border-slate-50">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <Pin size={16} />
                    </div>
                    <h3 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">AI Insights</h3>
                </div>

                {/* Insights Grid */}
                <div className="p-[16px] grid grid-cols-1 md:grid-cols-3 gap-10">
                    {aiInsightsData.map((item) => (
                        <div key={item.id} className="flex gap-2 group">
                            {/* Left Indicator Bar */}
                            <div
                                className="w-1 rounded-full shrink-0 h-full min-h-[60px]"
                                style={{ backgroundColor: item.color }}
                            />

                            <div className="space-y-1">
                                {/* Category Badge */}
                                <div
                                    className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[12px] font-normal font-inter leading-[16px] tracking-[0%] align-middle"
                                    style={{ backgroundColor: item.bgColor, color: item.textColor }}
                                >
                                    {item.title} <span className="ml-1 opacity-70">{item.percentage}</span>
                                </div>

                                {/* Insight Text */}
                                <p className="text-[14px] text-slate-600 font-inter font-normal leading-[20px] tracking-[0%] align-middle">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* High-Fidelity Share Report Modal using the common Modal component! */}
            <Modal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                width="380px"
                className="pb-6 pt-0"
            >
                <div className="flex flex-col items-center justify-center px-6">
                    {/* Top Link Icon inside rounded box */}
                    <div className="w-[48px] h-[48px] bg-[#f8fafc] border border-slate-100 rounded-[12px] flex items-center justify-center text-[#2563eb] mb-4 shadow-sm">
                        <LinkIcon size={20} className="stroke-[2.5]" />
                    </div>

                    {/* Modal Title */}
                    <h3 className="text-[19px] font-bold text-slate-800 font-inter mb-1.5 text-center">
                        Share Report Link
                    </h3>

                    {/* Modal Description */}
                    <p className="text-[13px] font-normal text-slate-500 font-inter text-center max-w-[280px] leading-relaxed mb-5">
                        Anyone with this link can view the report. No login required.
                    </p>

                    {/* Link Text Display and Copy container */}
                    <div className="w-full bg-[#f8fafc] border border-slate-100 rounded-[8px] p-1.5 pl-3 flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11.5px] font-mono text-slate-500 select-all truncate max-w-[190px]">
                            https://app.aicfo.com/share/rpt_784539
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText("https://app.aicfo.com/share/rpt_784539");
                                onTriggerToast("Link copied to clipboard!");
                            }}
                            className="h-[28px] px-3.5 bg-[#2563eb] hover:bg-blue-700 text-white text-[11.5px] font-semibold rounded-[6px] transition-all flex items-center justify-center active:scale-95 shadow-sm shrink-0"
                        >
                            Copy Link
                        </button>
                    </div>

                    {/* Link Expires Info row */}
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-inter mb-6 w-full justify-start pl-1">
                        <Info size={13} className="text-slate-400 stroke-[2]" />
                        <span>Link expires in 7 days</span>
                    </div>

                    {/* Action Buttons row */}
                    <div className="flex items-center gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => setIsShareModalOpen(false)}
                            className="flex-1 h-[38px] bg-[#2563eb] hover:bg-blue-700 text-white text-[13px] font-semibold rounded-[8px] flex items-center justify-center active:scale-95 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.1)]"
                        >
                            Done
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsShareModalOpen(false)}
                            className="flex-1 h-[38px] bg-[#f8fafc] hover:bg-slate-50 border border-slate-200 text-slate-650 text-[13px] font-semibold rounded-[8px] flex items-center justify-center active:scale-95 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

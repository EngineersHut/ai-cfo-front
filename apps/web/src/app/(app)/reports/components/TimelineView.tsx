"use client";

import React from 'react';
import { 
    Activity, 
    MoreVertical, 
    FileText,
    Eye
} from 'lucide-react';

interface TimelineViewProps {
    reportsData: any[];
    activePeriod: string;
    setActivePeriod: (period: string) => void;
    onDeleteClick: (e: React.MouseEvent, report: any) => void;
    onReportClick: (report: any) => void;
}

const getPeriodString = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const getReportTypeLabel = (type?: string) => {
    if (!type) return 'N/A';
    switch (type) {
        case 'income_statement': return 'Income Statement';
        case 'balance_sheet': return 'Balance Sheet';
        case 'cash_flow': return 'Cash Flow';
        case 'financial_statement': return 'Financial Statement';
        case 'other': return 'Other';
        default: return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
};

const getEndDateStr = (report: any) => {
    if (report.periodEndDate) {
        const d = new Date(report.periodEndDate);
        if (!isNaN(d.getTime())) {
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }
    if (report.dateRange && report.dateRange.includes(' - ')) {
        return report.dateRange.split(' - ')[1];
    }
    return report.dateRange || 'N/A';
};

const getStatusLabel = (status?: string) => {
    const s = status ? status.toLowerCase() : 'processing';
    if (s === 'completed' || s === 'processed' || s === 'success' || s === 'analyzed') {
        return 'Analyzed';
    }
    if (s === 'failed') {
        return 'Failed';
    }
    return 'Processing';
};

const getStatusStyles = (status?: string) => {
    const s = status ? status.toLowerCase() : 'processing';
    if (s === 'completed' || s === 'processed' || s === 'success' || s === 'analyzed') {
        return {
            bg: 'bg-[#f2fffa] dark:bg-emerald-900/30',
            border: 'border-[#bee5d0] dark:border-emerald-800',
            text: 'text-[#2cac68] dark:text-emerald-400',
            dot: 'bg-[#2cac68] dark:bg-emerald-400'
        };
    }
    if (s === 'failed') {
        return {
            bg: 'bg-rose-50 dark:bg-rose-900/30',
            border: 'border-rose-200 dark:border-rose-800',
            text: 'text-rose-600 dark:text-rose-400',
            dot: 'bg-rose-600 dark:bg-rose-400'
        };
    }
    // processing or default
    return {
        bg: 'bg-blue-50 dark:bg-blue-900/30 animate-pulse',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
        dot: 'bg-blue-600 dark:bg-blue-400'
    };
};

export default function TimelineView({ 
    reportsData, 
    activePeriod, 
    setActivePeriod, 
    onDeleteClick,
    onReportClick
}: TimelineViewProps) {
    return (
        <div className="w-full bg-white dark:bg-slate-800 rounded-[16px] border border-slate-100 dark:border-slate-700 p-[12px] shadow-sm">
            {/* Timeline Header */}
            <div className="h-[52px] flex items-center gap-[12px] p-[12px] border-b border-[#f2f2f3] dark:border-slate-700 bg-white dark:bg-slate-800 mb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300">
                    <Activity size={16} />
                </div>
                <h2 className="text-[16px] font-normal text-[#0f172a] dark:text-slate-100 font-inter leading-[24px]">Timeline View</h2>
            </div>

            {/* Timeline Slider Container */}
            <div className="relative pt-3 pb-8 overflow-hidden">
                {/* Timeline Line - Positioned to hit dot center */}
                <div className="absolute top-[73px] left-0 w-full h-[2px] bg-slate-100 dark:bg-slate-700 z-0" />

                <div className="flex items-start gap-8 overflow-x-auto no-scrollbar pb-4 relative z-10">
                    {reportsData.map((report, idx) => {
                        const reportPeriod = report.periodStartDate || report.period || '';
                        const isPeriodActive = activePeriod === reportPeriod;
                        const statusStyles = getStatusStyles(report.uploadStatus || report.status);

                        return (
                            <div
                                key={report._id || report.id}
                                className="flex-shrink-0 w-[256px] flex flex-col items-center cursor-pointer"
                                onClick={() => setActivePeriod(reportPeriod)}
                            >
                                {/* Month Label - Positioned above the line */}
                                <span className={`text-[12px] font-bold font-inter mb-[32px] uppercase tracking-widest transition-colors duration-300 ${isPeriodActive ? 'text-[#5345cc] dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {getPeriodString(reportPeriod)}
                                </span>

                                {/* Node Dot - Centered on the line */}
                                <div className="relative mb-4 h-6 flex items-center justify-center">
                                    {isPeriodActive ? (
                                        <div className="w-6 h-6 rounded-full border-[4px] border-[#5345cc] dark:border-indigo-400 bg-white dark:bg-slate-800 z-20 shadow-sm transition-all duration-300" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full bg-[#f1f5f9] dark:bg-slate-700 flex items-center justify-center z-10">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#94a3b8] dark:bg-slate-500" />
                                        </div>
                                    )}
                                </div>

                                {/* Card */}
                                <div 
                                    className={`w-[256px] h-[190px] p-[20px] rounded-[12px] border transition-all duration-300 shadow-sm relative group flex flex-col gap-[14px] ${isPeriodActive
                                    ? 'bg-[#5345cc] border-[#5345cc] text-white shadow-xl shadow-[#5345cc]/20 scale-[1.02] z-20'
                                    : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
                                    }`}>
                                    {/* Status Badge */}
                                    <div className="flex items-center justify-between">
                                        <div className={`inline-flex items-center gap-[6px] w-[92px] h-[20px] rounded-[4px] border text-[14px] font-normal font-inter leading-[20px] pt-[2px] pr-[6px] pb-[2px] pl-[4px] ${isPeriodActive ? 'bg-white/10 border-white/20 text-white' : `${statusStyles.bg} ${statusStyles.border} ${statusStyles.text}`}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${isPeriodActive ? 'bg-white' : statusStyles.dot}`} />
                                            {getStatusLabel(report.uploadStatus || report.status)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onReportClick(report);
                                                }}
                                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isPeriodActive ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:text-blue-400'}`}
                                                title="View Report"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteClick(e, report);
                                                }}
                                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isPeriodActive ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30'}`}
                                                title="Delete Report"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Title & Desc */}
                                    <div className="flex flex-col gap-2">
                                        <h4 className={`text-[14px] font-medium font-inter leading-[20px] ${isPeriodActive ? 'text-white' : 'text-[#0a092e] dark:text-slate-200'}`}>
                                            {getReportTypeLabel(report.reportType || report.type)}
                                        </h4>
                                        <p className={`text-[14px] font-normal font-inter leading-[20px] line-clamp-2 ${isPeriodActive ? 'text-white/80' : 'text-[#64748b] dark:text-slate-400'}`}>
                                            {idx === 0 ? 'Verified and matches expected balance' :
                                                idx === 1 ? 'Successfully validated and accepted' :
                                                    idx === 2 ? 'Format not supported, needs re-upload' :
                                                        'Verified and processed successfully'}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-current/10">
                                        <div className="flex items-center gap-2">
                                            {isPeriodActive ? (
                                                <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-white">
                                                    IN PROGRESS
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-[12px] font-normal text-[#0b1c30] dark:text-slate-300 font-inter leading-[16px]">
                                                    <FileText size={14} className="text-slate-400 dark:text-slate-500" />
                                                    {getEndDateStr(report)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

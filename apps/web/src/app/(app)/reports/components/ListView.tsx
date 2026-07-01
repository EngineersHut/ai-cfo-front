"use client";

import React from 'react';
import {
    Table as TableIcon,
    Search,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Eye
} from 'lucide-react';

interface ListViewProps {
    reportsData: any[];
    onDeleteClick: (e: React.MouseEvent, report: any) => void;
    onReportClick: (report: any) => void;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    searchQuery?: string;
    onSearchChange?: (val: string) => void;
}

const getPeriodString = (startStr?: string, endStr?: string, periodStr?: string) => {
    if (startStr && endStr) {
        const start = new Date(startStr);
        const end = new Date(endStr);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            // Check if they are the same month and year
            if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
                return start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            } else {
                return "Custom Range";
            }
        }
    }
    
    if (startStr) {
        const date = new Date(startStr);
        if (!isNaN(date.getTime())) return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    
    if (periodStr) {
        const date = new Date(periodStr);
        if (!isNaN(date.getTime())) return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return periodStr;
    }
    
    return 'N/A';
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

const getDateRangeString = (startStr?: string, endStr?: string) => {
    if (!startStr || !endStr) return 'N/A';
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return `${startStr} - ${endStr}`;
    }
    const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
    
    // If it's a single month, we don't really need a date range, but we can show start-end days
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
         return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    
    return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`;
};

export default function ListView({
    reportsData,
    onDeleteClick,
    onReportClick,
    pagination,
    onPageChange,
    onLimitChange,
    searchQuery,
    onSearchChange
}: ListViewProps) {
    const currentPage = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const total = pagination?.total ?? reportsData.length;
    const startIdx = total === 0 ? 0 : (currentPage - 1) * limit + 1;
    const endIdx = Math.min(currentPage * limit, total);
    const totalPages = pagination?.totalPages ?? Math.ceil(total / limit) ?? 1;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="w-full h-auto bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
            {/* Table Header Controls */}
            <div className="h-auto flex flex-col sm:flex-row sm:items-center justify-between p-[12px] border-b border-[#f2f2f3] dark:border-slate-700 bg-white dark:bg-slate-800 gap-[12px]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300">
                        <TableIcon size={16} />
                    </div>
                    <h3 className="text-[16px] font-normal text-[#131b2e] dark:text-slate-100 font-inter leading-[24px]">Raw Data Table</h3>
                </div>

                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={14} />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery || ''}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full sm:w-[247px] h-[36px] pl-10 pr-4 bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-600 rounded-[8px] text-[13px] text-slate-800 dark:text-slate-100 font-inter focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/30 focus:border-blue-400 transition-all shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]"
                    />
                </div>
            </div>

            {/* Main Table */}
            <div className="w-full overflow-x-auto md:overflow-x-visible scrollbar-thin">
                <table className="w-full min-w-[850px] md:min-w-0 text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f6f8fa] dark:bg-slate-800/50 border-b border-[#f1f5f9] dark:border-slate-700 h-[70px]">
                            <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] dark:text-slate-400 font-inter leading-[20px] tracking-normal w-[220px] border-r border-[#f1f5f9] dark:border-slate-700">Report Name</th>
                            <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] dark:text-slate-400 font-inter leading-[20px] tracking-normal w-[180px] border-r border-[#f1f5f9] dark:border-slate-700">Period</th>
                            <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] dark:text-slate-400 font-inter leading-[20px] tracking-normal text-center w-[180px] border-r border-[#f1f5f9] dark:border-slate-700">Report Type</th>
                            <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] dark:text-slate-400 font-inter leading-[20px] tracking-normal text-center w-[180px] border-r border-[#f1f5f9] dark:border-slate-700">Status</th>
                            <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] dark:text-slate-400 font-inter leading-[20px] tracking-normal text-center w-[180px] border-r border-[#f1f5f9] dark:border-slate-700">Date Range</th>
                            <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] dark:text-slate-400 font-inter leading-[20px] tracking-normal text-center w-[120px]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9] dark:divide-slate-700">
                        {reportsData.map((report) => {
                            const statusStyles = getStatusStyles(report.uploadStatus || report.status);
                            return (
                            <tr
                                key={report._id || report.id}
                                className="h-[70px] hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group border-b border-[#f1f5f9] dark:border-slate-700"
                            >
                                <td className="px-[24px] py-[16px] text-[14px] font-medium text-[#0a092e] dark:text-slate-200 font-inter leading-[20px] w-[220px] border-r border-[#f1f5f9] dark:border-slate-700">
                                    {report.reportName || 'N/A'}
                                </td>
                                <td className="px-[24px] py-[16px] text-[14px] font-medium text-[#0a092e] dark:text-slate-200 font-inter leading-[20px] w-[180px] border-r border-[#f1f5f9] dark:border-slate-700">
                                    {getPeriodString(report.periodStartDate, report.periodEndDate, report.period)}
                                </td>
                                <td className="px-[24px] py-[16px] text-center text-[14px] font-medium text-[#0a092e] dark:text-slate-200 font-inter leading-[20px] w-[180px] border-r border-[#f1f5f9] dark:border-slate-700">
                                    {getReportTypeLabel(report.reportType || report.type)}
                                </td>
                                <td className="px-[24px] py-[16px] text-center w-[180px] border-r border-[#f1f5f9] dark:border-slate-700">
                                    <div className={`inline-flex items-center justify-center gap-[6px] w-[92px] h-[20px] rounded-[4px] border ${statusStyles.bg} ${statusStyles.border} ${statusStyles.text} text-[14px] font-normal font-inter leading-[20px]`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
                                        {getStatusLabel(report.uploadStatus || report.status)}
                                    </div>
                                </td>
                                <td className="px-[24px] py-[16px] text-center text-[14px] font-medium text-[#0a092e] dark:text-slate-200 font-inter leading-[20px] w-[180px] border-r border-[#f1f5f9] dark:border-slate-700">
                                    {report.periodStartDate && report.periodEndDate
                                        ? getDateRangeString(report.periodStartDate, report.periodEndDate)
                                        : report.dateRange
                                    }
                                </td>
                                <td className="px-[24px] py-[16px] text-center w-[120px]">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onReportClick(report);
                                            }}
                                            className="p-2.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                                            title="View Report"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteClick(e, report);
                                            }}
                                            className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                                            title="Delete Report"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="h-auto py-3 border-t border-[#f2f2f3] dark:border-slate-700 bg-white dark:bg-slate-800 px-[24px] flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-[12px] font-medium text-[#94a3b8] dark:text-slate-400 font-inter uppercase tracking-wider text-center sm:text-left">
                    <span>Showing {startIdx}-{endIdx} of {total} Reports</span>
                    <div className="flex items-center justify-center sm:justify-start gap-2 normal-case text-slate-500 dark:text-slate-400">
                        <span>Rows per page:</span>
                        <select
                            value={limit}
                            onChange={(e) => onLimitChange?.(Number(e.target.value))}
                            className="bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-600 rounded-[6px] px-2 py-0.5 text-[12px] font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (currentPage > 1) onPageChange?.(currentPage - 1);
                        }}
                        disabled={currentPage <= 1}
                        className={`w-[40px] h-[40px] flex items-center justify-center bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-600 rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {pageNumbers.map((num) => (
                        <button
                            key={num}
                            onClick={(e) => {
                                e.stopPropagation();
                                onPageChange?.(num);
                            }}
                            className={`w-[40px] h-[40px] flex items-center justify-center rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] text-[13px] font-medium transition-all ${num === currentPage
                                    ? 'bg-[#2563eb] text-white border-transparent'
                                    : 'bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (currentPage < totalPages) onPageChange?.(currentPage + 1);
                        }}
                        disabled={currentPage >= totalPages}
                        className={`w-[40px] h-[40px] flex items-center justify-center bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-600 rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

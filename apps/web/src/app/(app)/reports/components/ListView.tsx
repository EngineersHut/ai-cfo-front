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
            bg: 'bg-[#f2fffa]',
            border: 'border-[#bee5d0]',
            text: 'text-[#2cac68]',
            dot: 'bg-[#2cac68]'
        };
    }
    if (s === 'failed') {
        return {
            bg: 'bg-rose-50',
            border: 'border-rose-200',
            text: 'text-rose-600',
            dot: 'bg-rose-600'
        };
    }
    // processing or default
    return {
        bg: 'bg-blue-50 animate-pulse',
        border: 'border-blue-200',
        text: 'text-blue-600',
        dot: 'bg-blue-600'
    };
};

const getDateRangeString = (startStr?: string, endStr?: string) => {
    if (!startStr || !endStr) return 'N/A';
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return `${startStr} - ${endStr}`;
    }
    const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
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
        <div className="w-full h-auto bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
            {/* Table Header Controls */}
            <div className="h-auto flex flex-col sm:flex-row sm:items-center justify-between p-[12px] border-b border-[#f2f2f3] bg-white gap-[12px]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <TableIcon size={16} />
                    </div>
                    <h3 className="text-[16px] font-normal text-[#131b2e] font-inter leading-[24px]">Raw Data Table</h3>
                </div>

                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery || ''}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full sm:w-[247px] h-[36px] pl-10 pr-4 bg-white border border-[#e2e8f0] rounded-[8px] text-[13px] font-inter focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]"
                    />
                </div>
            </div>

            {/* Main Table */}
            <div className="w-full overflow-x-auto md:overflow-x-visible scrollbar-thin">
                <table className="w-full min-w-[850px] md:min-w-0 text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f6f8fa] border-b border-[#f1f5f9] h-[70px]">
                            <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-normal w-[220px] border-r border-[#f1f5f9]">Report Name</th>
                            <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-normal w-[180px] border-r border-[#f1f5f9]">Period</th>
                            <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-normal text-center w-[180px] border-r border-[#f1f5f9]">Report Type</th>
                            <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-normal text-center w-[180px] border-r border-[#f1f5f9]">Status</th>
                            <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-normal text-center w-[180px] border-r border-[#f1f5f9]">Date Range</th>
                            <th className="px-[24px] py-[16px] text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-normal text-center w-[120px]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                        {reportsData.map((report) => {
                            const statusStyles = getStatusStyles(report.uploadStatus || report.status);
                            return (
                            <tr
                                key={report._id || report.id}
                                className="h-[70px] hover:bg-slate-50/50 transition-colors group border-b border-[#f1f5f9]"
                            >
                                <td className="px-[24px] py-[16px] text-[14px] font-medium text-[#0a092e] font-inter leading-[20px] w-[220px] border-r border-[#f1f5f9]">
                                    {report.reportName || 'N/A'}
                                </td>
                                <td className="px-[24px] py-[16px] text-[14px] font-medium text-[#0a092e] font-inter leading-[20px] w-[180px] border-r border-[#f1f5f9]">
                                    {getPeriodString(report.periodStartDate || report.period)}
                                </td>
                                <td className="px-[24px] py-[16px] text-center text-[14px] font-medium text-[#0a092e] font-inter leading-[20px] w-[180px] border-r border-[#f1f5f9]">
                                    {getReportTypeLabel(report.reportType || report.type)}
                                </td>
                                <td className="px-[24px] py-[16px] text-center w-[180px] border-r border-[#f1f5f9]">
                                    <div className={`inline-flex items-center justify-center gap-[6px] w-[92px] h-[20px] rounded-[4px] border ${statusStyles.bg} ${statusStyles.border} ${statusStyles.text} text-[14px] font-normal font-inter leading-[20px]`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
                                        {getStatusLabel(report.uploadStatus || report.status)}
                                    </div>
                                </td>
                                <td className="px-[24px] py-[16px] text-center text-[14px] font-medium text-[#0a092e] font-inter leading-[20px] w-[180px] border-r border-[#f1f5f9]">
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
            <div className="h-auto py-3 border-t border-[#f2f2f3] bg-white px-[24px] flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-[12px] font-medium text-[#94a3b8] font-inter uppercase tracking-wider text-center sm:text-left">
                    <span>Showing {startIdx}-{endIdx} of {total} Reports</span>
                    <div className="flex items-center justify-center sm:justify-start gap-2 normal-case text-slate-500">
                        <span>Rows per page:</span>
                        <select
                            value={limit}
                            onChange={(e) => onLimitChange?.(Number(e.target.value))}
                            className="bg-white border border-[#e2e8f0] rounded-[6px] px-2 py-0.5 text-[12px] font-medium text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
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
                        className={`w-[40px] h-[40px] flex items-center justify-center bg-white border border-[#e2e8f0] rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] text-slate-400 hover:bg-slate-50 transition-all ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                    ? 'bg-[#2563eb] text-white'
                                    : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
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
                        className={`w-[40px] h-[40px] flex items-center justify-center bg-white border border-[#e2e8f0] rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] text-slate-400 hover:bg-slate-50 transition-all ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

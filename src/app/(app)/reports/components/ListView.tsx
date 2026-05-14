"use client";

import React from 'react';
import { 
    Table as TableIcon, 
    Search, 
    Trash2, 
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react';

interface ListViewProps {
    reportsData: any[];
    onDeleteClick: (e: React.MouseEvent, report: any) => void;
}

export default function ListView({ reportsData, onDeleteClick }: ListViewProps) {
    return (
        <div className="w-full h-auto bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
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
                                    <button
                                        onClick={(e) => onDeleteClick(e, report)}
                                        className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="h-[60px] border-t border-[#f2f2f3] bg-white px-[24px] flex items-center justify-between">
                <div className="text-[12px] font-medium text-[#94a3b8] font-inter uppercase tracking-wider">
                    Showing 1-4 of 24 Reports
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-[40px] h-[40px] flex items-center justify-center bg-white border border-[#e2e8f0] rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] text-slate-400 hover:bg-slate-50 transition-all">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="w-[40px] h-[40px] flex items-center justify-center bg-[#2563eb] text-white rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] text-[13px] font-medium transition-all">
                        1
                    </button>
                    <button className="w-[40px] h-[40px] flex items-center justify-center bg-white border border-[#e2e8f0] rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all">
                        2
                    </button>
                    <button className="w-[40px] h-[40px] flex items-center justify-center bg-white border border-[#e2e8f0] rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all">
                        3
                    </button>
                    <button className="w-[40px] h-[40px] flex items-center justify-center bg-white border border-[#e2e8f0] rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] text-slate-400 hover:bg-slate-50 transition-all">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

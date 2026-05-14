"use client";

import React from 'react';
import { 
    Activity, 
    MoreVertical, 
    FileText 
} from 'lucide-react';

interface TimelineViewProps {
    reportsData: any[];
    activePeriod: string;
    setActivePeriod: (period: string) => void;
    onDeleteClick: (e: React.MouseEvent, report: any) => void;
}

export default function TimelineView({ 
    reportsData, 
    activePeriod, 
    setActivePeriod, 
    onDeleteClick 
}: TimelineViewProps) {
    return (
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
                            className="flex-shrink-0 w-[256px] flex flex-col items-center cursor-pointer"
                            onClick={() => setActivePeriod(report.period)}
                        >
                            {/* Month Label - Positioned above the line */}
                            <span className={`text-[12px] font-bold font-inter mb-[32px] uppercase tracking-widest transition-colors duration-300 ${activePeriod === report.period ? 'text-[#5345cc]' : 'text-slate-400'}`}>
                                {report.period}
                            </span>

                            {/* Node Dot - Centered on the line */}
                            <div className="relative mb-4 h-6 flex items-center justify-center">
                                {activePeriod === report.period ? (
                                    <div className="w-6 h-6 rounded-full border-[4px] border-[#5345cc] bg-white z-20 shadow-sm transition-all duration-300" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-[#f1f5f9] flex items-center justify-center z-10">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]" />
                                    </div>
                                )}
                            </div>

                            {/* Card */}
                            <div className={`w-[256px] h-[190px] p-[20px] rounded-[12px] border transition-all duration-300 shadow-sm relative group flex flex-col gap-[14px] ${activePeriod === report.period
                                ? 'bg-[#5345cc] border-[#5345cc] text-white shadow-xl shadow-[#5345cc]/20 scale-[1.02] z-20'
                                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
                                }`}>
                                {/* Status Badge */}
                                <div className="flex items-center justify-between">
                                    <div className="inline-flex items-center gap-[6px] w-[92px] h-[20px] rounded-[4px] border border-[#bee5d0] bg-[#f2fffa] text-[#2cac68] text-[14px] font-normal font-inter leading-[20px] pt-[2px] pr-[6px] pb-[2px] pl-[4px]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#2cac68]" />
                                        {report.status}
                                    </div>
                                    <button
                                        onClick={(e) => onDeleteClick(e, report)}
                                        className={`${activePeriod === report.period ? 'text-white/60 hover:text-white' : 'text-slate-300 hover:text-slate-500'} transition-colors`}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                </div>

                                {/* Title & Desc */}
                                <div className="flex flex-col gap-2">
                                    <h4 className={`text-[14px] font-medium font-inter leading-[20px] ${activePeriod === report.period ? 'text-white' : 'text-[#0a092e]'}`}>
                                        {report.type}
                                    </h4>
                                    <p className={`text-[14px] font-normal font-inter leading-[20px] line-clamp-2 ${activePeriod === report.period ? 'text-white/80' : 'text-[#64748b]'}`}>
                                        {idx === 0 ? 'Verified and matches expected balance' :
                                            idx === 1 ? 'Successfully validated and accepted' :
                                                idx === 2 ? 'Format not supported, needs re-upload' :
                                                    'Verified and processed successfully'}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="mt-auto flex items-center justify-between pt-3 border-t border-current/10">
                                    <div className="flex items-center gap-2">
                                        {activePeriod === report.period ? (
                                            <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-white">
                                                IN PROGRESS
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-[12px] font-normal text-[#0b1c30] font-inter leading-[16px]">
                                                <FileText size={14} className="text-slate-400" />
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
    );
}

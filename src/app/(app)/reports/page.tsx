"use client";

import React, { useState } from 'react';
import {
    List,
    Activity,
    Plus,
    ChevronDown,
} from 'lucide-react';

import { reportsData } from '@/data/reportsData';
import ReportUpload from './components/ReportUpload';
import ListView from './components/ListView';
import TimelineView from './components/TimelineView';
import ReportDetail from './components/ReportDetail';
import DeleteModal from './components/DeleteModal';

export default function ReportsPage() {
    const [view, setView] = useState<'list' | 'timeline'>('list');
    const [activePeriod, setActivePeriod] = useState<string>('Jan 2025');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState<any>(null);
    const [isAddingReport, setIsAddingReport] = useState(false);
    const [selectedReport, setSelectedReport] = useState<any>(null);

    const handleDeleteClick = (e: React.MouseEvent, report: any) => {
        e.stopPropagation();
        setReportToDelete(report);
        setIsDeleteModalOpen(true);
    };

    const handleReportClick = (report: any) => {
        setSelectedReport(report);
    };

    return (
        <div className="flex flex-col gap-5  max-w-[1400px] mx-auto animate-in fade-in duration-500">
            {selectedReport ? (
                <ReportDetail 
                    reportId={selectedReport.id} 
                    onBack={() => setSelectedReport(null)} 
                />
            ) : isAddingReport ? (
                <ReportUpload onCancel={() => setIsAddingReport(false)} />
            ) : (
                <>
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
                                <button
                                    onClick={() => setIsAddingReport(true)}
                                    className="w-[130px] h-[36px] flex items-center justify-center gap-[6px] pt-[4px] pr-[12px] pb-[4px] pl-[12px] bg-[#2563eb] text-white rounded-[8px] border border-white/10 text-[14px] font-normal font-inter leading-[20px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)] hover:bg-blue-700 transition-all"
                                >
                                    <Plus size={18} />
                                    Add Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    {view === 'list' ? (
                        <ListView
                            reportsData={reportsData}
                            onDeleteClick={handleDeleteClick}
                            onReportClick={handleReportClick}
                        />
                    ) : (
                        <TimelineView
                            reportsData={reportsData}
                            activePeriod={activePeriod}
                            setActivePeriod={setActivePeriod}
                            onDeleteClick={handleDeleteClick}
                            onReportClick={handleReportClick}
                        />
                    )}
                </>
            )}

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                reportToDelete={reportToDelete}
            />
        </div>
    );
}

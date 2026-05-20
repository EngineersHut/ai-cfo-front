"use client";

import React, { useState } from 'react';
import {
    Calendar,
    FileText,
    UploadCloud,
    Paperclip,
    Info,
    Trash2,
    CheckCircle2
} from 'lucide-react';
import ExportReport from './components/ExportReport';
import { ForecastReport, initialForecastReports } from '../../../data/forecastData';

export default function ForecastReportsPage() {
    const [view, setView] = useState<'library' | 'list' | 'create'>('library');
    const [periodFilter, setPeriodFilter] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');
    const [searchQuery, setSearchQuery] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Dynamic Ingestion state
    const [formData, setFormData] = useState({
        reportName: "",
        reportingPeriod: "",
        files: [] as any[],
        analysisFocus: "conservative" as 'conservative' | 'aggressive' | 'stress_test'
    });

    const [isCompleted, setIsCompleted] = useState(false);
    const [inspectedReport, setInspectedReport] = useState<ForecastReport | null>(null);

    // Initial Premium Data set loaded from shared data folder
    const [reports, setReports] = useState<ForecastReport[]>(initialForecastReports);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            handleInputChange('files', [...formData.files, ...newFiles]);
        }
    };

    const handleRemoveFile = (index: number) => {
        const updated = [...formData.files];
        updated.splice(index, 1);
        handleInputChange('files', updated);
    };

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        // Instant generation with fallback name if none entered
        const finalName = formData.reportName.trim() || "Q1 2026 Operations Baseline";
        setFormData(prev => ({
            ...prev,
            reportName: finalName,
            files: prev.files.length > 0 ? prev.files : [{ name: "baseline_ledger.xlsx", size: 45000 }]
        }));
        setIsCompleted(true);
    };

    const handleFinalize = () => {
        // Reset state back to upload form
        setIsCompleted(false);
        setFormData({
            reportName: "",
            reportingPeriod: "",
            files: [],
            analysisFocus: "conservative"
        });
        triggerToast("Report finalized and saved to the secure vault!");
    };

    return (
        <div className="flex flex-col gap-6 max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-10 relative">

            {/* Dynamic Custom Toast */}
            {toastMessage && (
                <div className="fixed top-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-slate-800 animate-in slide-in-from-top-4 duration-300 font-inter text-[13px]">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {isCompleted ? (
                /* Renders the newly modularized high-fidelity ExportReport component */
                <ExportReport
                    reportName={formData.reportName}
                    onFinalize={handleFinalize}
                    onTriggerToast={triggerToast}
                />
            ) : (
                /* Report Ingestion Form */
                <>
                    {/* New Report Upload Header */}
                    <div className="space-y-1">
                        <h1 className="text-[24px] font-medium text-slate-800 font-inter leading-[32px]">Forcast Reports</h1>
                        <p className="text-[14px] font-normal text-slate-400 font-inter leading-[20px]">Historical projections and predictive analytics library.</p>
                    </div>

                    {/* Grid for Metadata and Precision Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        {/* Metadata Card */}
                        <div className="lg:col-span-2 bg-white rounded-[12px] border border-slate-100 p-[24px] pb-[16px] shadow-sm flex flex-col gap-6">
                            <div className="border-b border-[#f1f5f9] pb-4">
                                <h3 className="text-[18px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">Report metadata</h3>
                                <p className="text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-[0%]">Enter details to establish a secure prediction baseline.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-medium text-slate-600 font-inter block">Report name</label>
                                    <input
                                        type="text"
                                        value={formData.reportName}
                                        onChange={(e) => handleInputChange('reportName', e.target.value)}
                                        placeholder="e.g. Q3 Architecture Sustainability Audit"
                                        className="w-full max-w-[648px] h-[38px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-[14px] font-inter shadow-sm"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-medium text-slate-600 font-inter flex items-center gap-1">
                                        Reporting Period <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group max-w-[648px] w-full">
                                        <input
                                            type="text"
                                            value={formData.reportingPeriod}
                                            onChange={(e) => handleInputChange('reportingPeriod', e.target.value)}
                                            placeholder="mm/dd/yyyy"
                                            className="w-full h-[38px] pl-[10px] pr-[36px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-[14px] font-inter shadow-sm"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors pointer-events-none">
                                            <Calendar size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Precision Analysis Active Card (Blue) */}
                        <div className="bg-[#2563eb] rounded-[12px] p-[18px] text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
                            {/* Subtle Background Pattern */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

                            <div className="space-y-4 relative z-10">
                                <h3 className="text-[16px] font-normal font-inter leading-[24px] tracking-[0%] text-white">Precision Analysis Active</h3>
                                <p className="text-[12px] font-normal text-white font-inter leading-[16px] tracking-[0%]">Uploaded reports are automatically processed by our proprietary AI engine to extract quantitative architectural data.</p>

                                <div className="space-y-2 ">
                                    {[
                                        'Real-time verification',
                                        'Cross-ledger auditing',
                                        'Encrypted data ingestion'
                                    ].map((feature) => (
                                        <div key={feature} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                                <CheckCircle2 size={14} className="text-white" />
                                            </div>
                                            <span className="text-[14px] font-medium font-inter leading-[20px] tracking-[0%] text-white">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-3 pt-5 border-t border-white/10 flex items-center justify-between relative z-10">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#2563eb] bg-slate-200 overflow-hidden ring-2 ring-white/10 hover:translate-y-[-4px] transition-transform cursor-pointer">
                                            <img src={`https://i.pravatar.cc/100?u=ai-cfo-${i}`} alt="user" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[13px] font-medium font-inter text-blue-100">Trusted by 24 regional partners</span>
                            </div>
                        </div>
                    </div>

                    {/* Document Assets Card */}
                    <div className="bg-white rounded-[12px] border border-slate-100 p-[16px] shadow-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                                    <FileText size={20} />
                                </div>
                                <h3 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Document Assets</h3>
                            </div>
                            <div className="w-[100px] h-[23px] rounded-[2px] bg-[#f6f8fa] flex items-center justify-center text-[10px] font-semibold text-[#64748b] font-inter leading-[15px] tracking-[0px] uppercase">
                                Secure Upload
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-slate-200 rounded-[16px] p-8 flex flex-col items-center justify-center gap-6 bg-slate-50/20 hover:bg-slate-50 hover:border-blue-200 transition-all cursor-pointer group">
                            <div className="w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                                <UploadCloud width={44} height={32} className="text-[#94a3b8]" />
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="text-[18px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Drag and drop documents here</h4>
                                <p className="text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-[0%] text-center">PDF, CSV, or XLSX formats supported (Max 50MB)</p>
                            </div>
                            {formData.files.length > 0 && (
                                <div className="w-full max-w-[500px] bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 mx-auto">
                                    <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Queue: {formData.files.length} document(s)</div>
                                    <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-2">
                                        {formData.files.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-white border border-slate-100 rounded-lg p-2 text-[12.5px] font-medium text-slate-700">
                                                <div className="flex items-center gap-2 truncate">
                                                    <FileText size={14} className="text-blue-500" />
                                                    <span className="truncate">{file.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-normal">({(file.size / 1024).toFixed(1)} KB)</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFile(idx)}
                                                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="relative">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileBrowse}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <button className="mt-4 w-[140px] h-[40px] pt-[4px] pr-[16px] pb-[4px] pl-[12px] gap-[6px] bg-white border border-[#e2e8f0] rounded-[8px] text-[14px] font-normal text-[#0f172a] font-inter leading-[20px] tracking-[0%] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:bg-slate-50 transition-all flex items-center pointer-events-none">
                                    <Paperclip size={16} className="text-[#64748b]" />
                                    Browse Files
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="flex flex-col gap-6 ">
                        <div className="w-full h-[68px] px-4 rounded-[12px] border border-[#f2f2f3] bg-white flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3 text-slate-500">
                                <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Info size={18} />
                                </div>
                                <p className="text-[14px] font-inter text-[#434654] font-normal leading-[20px] tracking-[0px]">Final submission will trigger an email notification to the compliance team.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleGenerate}
                                    className="w-[140px] h-[36px] px-[12px] py-[4px] gap-[6px] bg-[#2563eb] text-[#f8fafc] font-normal font-inter text-[14px] leading-[20px] tracking-[0%] rounded-[8px] border border-white/10 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)] hover:bg-blue-700 transition-all flex items-center justify-center active:scale-95"
                                >
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

"use client";

import React from 'react';
import {
    Calendar,
    CheckCircle2,
    FileText,
    UploadCloud,
    Search,
    Info
} from 'lucide-react';

interface ReportUploadProps {
    onCancel: () => void;
}

export default function ReportUpload({ onCancel }: ReportUploadProps) {
    return (
        <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* New Report Upload Header */}
            <div className="space-y-1">
                <h1 className="text-[24px] font-medium text-slate-800 font-inter leading-[32px]">New Report Upload</h1>
                <p className="text-[14px] font-normal text-slate-400 font-inter leading-[20px]">Integrate new financial data points into the Precision Ledger ecosystem. Ensure all documents meet our architectural quant standards for processing.</p>
            </div>

            {/* Grid for Metadata and Precision Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                {/* Metadata Card */}
                <div className="lg:col-span-2 bg-white rounded-[12px] border border-slate-100 p-[24px] pb-[16px] shadow-sm flex flex-col gap-6">
                    <div className="border-b border-[#f1f5f9] pb-4">
                        <h3 className="text-[18px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">Report metadata</h3>
                        <p className="text-[14px] font-normal text-[#64748b] font-inter leading-[20px] tracking-[0%]">Enter your email and password to Login</p>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-6">
                            <label className="text-[14px] font-medium text-slate-600 font-inter">Report name</label>
                            <input
                                type="text"
                                placeholder="e.g. Q3 Architecture Sustainability Audit"
                                className="w-full max-w-[648px] h-[38px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-[14px] font-inter shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[14px] font-medium text-slate-600 font-inter flex items-center gap-1">
                                Reporting Period <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="mm/dd/yyyy"
                                    className="w-full max-w-[648px] h-[38px] px-[10px] py-[8px] rounded-[8px] border border-[#e2e8f0] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-[14px] font-inter shadow-sm"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors">
                                    <Calendar size={20} />
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
            <div className="bg-white rounded-[12px] border border-slate-100 p-8 shadow-sm flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                            <FileText size={20} />
                        </div>
                        <h3 className="text-[18px] font-semibold text-slate-800 font-inter">Document Assets</h3>
                    </div>
                    <div className="px-4 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-400 rounded-[6px] tracking-[0.1em] border border-slate-100 shadow-sm uppercase">
                        Secure Upload
                    </div>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-[16px] p-16 flex flex-col items-center justify-center gap-6 bg-slate-50/20 hover:bg-slate-50 hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-[#2563eb] group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-500 shadow-sm">
                        <UploadCloud size={40} />
                    </div>
                    <div className="text-center space-y-2">
                        <h4 className="text-[18px] font-semibold text-slate-800 font-inter">Drag and drop documents here</h4>
                        <p className="text-[14px] text-slate-400 font-inter">PDF, CSV, or XLSX formats supported (Max 50MB)</p>
                    </div>
                    <button className="mt-4 h-[44px] px-8 bg-white border border-slate-200 rounded-[10px] text-[14px] font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-3 active:scale-95">
                        <Search size={16} className="text-slate-400" />
                        Browse Files
                    </button>
                </div>
            </div>

            {/* Footer Section */}
            <div className="flex items-center justify-between py-6 border-t border-slate-100 mt-2">
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                        <Info size={18} />
                    </div>
                    <p className="text-[14px] font-inter text-slate-500 font-medium">Final submission will trigger an email notification to the compliance team.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onCancel}
                        className="h-[48px] px-10 text-slate-600 font-semibold hover:bg-slate-100 rounded-[12px] transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button className="h-[48px] px-10 bg-[#2563eb] text-white font-semibold rounded-[12px] shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-95 flex items-center gap-2">
                        Generate Report
                    </button>
                </div>
            </div>
        </div>
    );
}

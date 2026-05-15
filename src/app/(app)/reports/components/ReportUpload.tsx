"use client";

import React, { useState } from 'react';
import {
    Calendar,
    CheckCircle2,
    FileText,
    UploadCloud,
    Paperclip,
    Info,
    Loader2,
    CheckCircle,
    BadgeCheck
} from 'lucide-react';
import { useEffect } from 'react';

interface ReportUploadProps {
    onCancel: () => void;
}

export default function ReportUpload({ onCancel }: ReportUploadProps) {
    const [formData, setFormData] = useState({
        reportName: "",
        reportingPeriod: "",
        files: [] as any[]
    });

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const steps = [
        "Scanning Bank statements...",
        "Scanning Income statements...",
        "Tax document statements...",
        "Scanning Invoice..."
    ];

    useEffect(() => {
        if (isAnalyzing && analysisStep < steps.length) {
            const timer = setTimeout(() => {
                setAnalysisStep(prev => prev + 1);
            }, 1500); // 1.5 seconds per step
            return () => clearTimeout(timer);
        } else if (isAnalyzing && analysisStep === steps.length) {
            const timer = setTimeout(() => {
                setIsAnalyzing(false);
                setIsCompleted(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isAnalyzing, analysisStep]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerate = () => {
        setIsAnalyzing(true);
        setAnalysisStep(0);
        console.log("Generate Report Payload (FormData):", formData);
    };

    const handleFileBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            handleInputChange('files', newFiles);
            console.log("Files selected:", newFiles);
        }
    };

    if (isAnalyzing) {
        return (
            <div className="min-h-[500px] flex flex-col items-center justify-center bg-[#f8fafc]/50 rounded-[24px] p-12 animate-in fade-in duration-700">
                <div className="flex flex-col gap-12 w-full max-w-[500px]">
                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-[3px] border-indigo-100" />
                            <div className="absolute w-8 h-8 rounded-full border-[3px] border-indigo-600 border-t-transparent animate-spin" />
                        </div>
                        <h2 className="text-[20px] font-semibold text-slate-800 font-inter">Analyzing your financial documents...</h2>
                    </div>

                    <div className="space-y-6 ml-2">
                        {steps.map((step, index) => (
                            <div
                                key={step}
                                className={`flex items-center gap-4 transition-all duration-700 ${index <= analysisStep ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-2'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500 ${index < analysisStep ? 'bg-indigo-600' : 'bg-slate-200'
                                    }`}>
                                    {index < analysisStep ? (
                                        <CheckCircle size={14} className="text-white" />
                                    ) : (
                                        <div className={`w-2 h-2 rounded-full bg-indigo-600 ${index === analysisStep ? 'animate-pulse' : 'opacity-0'}`} />
                                    )}
                                </div>
                                <span className={`text-[18px] font-normal font-inter leading-[24px] tracking-[0%] transition-colors duration-500 ${index <= analysisStep ? 'text-[#0f172a]' : 'text-slate-400'
                                    }`}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isCompleted) {
        return (
            <div className="min-h-[500px] flex flex-col items-center justify-center bg-white rounded-[24px] p-12 animate-in zoom-in-95 duration-1000">
                <div className="w-[60px] h-[60px] rounded-[15px] bg-[#27ae60] flex items-center justify-center text-white mb-8 transform hover:scale-110 transition-transform cursor-pointer">
                    <BadgeCheck size={32} />
                </div>
                <h2 className="text-[24px] font-medium text-[#2e2e37] font-inter leading-[32px] tracking-[0%] mb-1">Your financial analysis is ready</h2>
                <p className="text-[18px] font-normal text-[#0f172a] font-inter text-center max-w-2xl mb-6 leading-[24px] tracking-[0%]">
                    All documents have been successfully processed and verified. <br />
                    Success Points
                </p>
                <button
                    onClick={onCancel}
                    className="w-[100px] h-[36px] px-[12px] py-[4px] gap-[6px] bg-[#2563eb] text-[#f8fafc] font-normal font-inter text-[14px] leading-[20px] tracking-[0%] rounded-[8px] border border-white/10 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)] hover:bg-blue-700 transition-all flex items-center justify-center active:scale-95"
                >
                    All Report
                </button>
            </div>
        );
    }

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
                                value={formData.reportName}
                                onChange={(e) => handleInputChange('reportName', e.target.value)}
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
                                    value={formData.reportingPeriod}
                                    onChange={(e) => handleInputChange('reportingPeriod', e.target.value)}
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
        </div>
    );
}

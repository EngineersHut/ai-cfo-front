"use client";

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    reportToDelete: any;
    isDeleting?: boolean;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, reportToDelete, isDeleting }: DeleteModalProps) {
    if (!isOpen) return null;

    const reportIdentifier = reportToDelete?.reportName || 
        (reportToDelete?.period ? `${reportToDelete.period} ${reportToDelete.type || ''}` : '') || 
        'this report';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[12px] shadow-2xl w-[401px] h-[408px] overflow-hidden animate-in zoom-in-95 duration-200 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isDeleting}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <X size={20} />
                </button>

                <div className="p-[32px] h-full flex flex-col items-center text-center gap-[24px]">
                    {/* Warning Icon Container */}
                    <div className="w-[80px] h-[80px] rounded-3xl flex items-center justify-center mb-2">
                        <div className="w-[60px] h-[60px] bg-[#eb5757] rounded-[15px] flex items-center justify-center shadow-lg shadow-red-100 pt-[7.5px] pb-[7.5px] px-[16.88px]">
                            <AlertTriangle className="text-white" size={28} strokeWidth={2.5} />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-[24px] font-medium text-[#2e2e37] font-inter leading-[32px]">Delete Report?</h2>

                    {/* Description */}
                    <p className="text-[15px] text-[#4b5563] leading-[24px] font-inter">
                        This action cannot be undone. All data associated with <span className="font-bold text-[#111827]">"{reportIdentifier}"</span> will be permanently removed from the CFO vault.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 w-full">
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="w-[336px] h-[36px] bg-[#eb5757] text-white rounded-[8px] text-[14px] font-bold hover:opacity-90 transition-all flex items-center justify-center pt-[14px] pb-[14px] opacity-100 rotate-0 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Report'
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="w-[336px] h-[36px] bg-[#f6f8fa] text-[#394c84] rounded-[8px] text-[16px] font-normal font-inter leading-[24px] flex items-center justify-center p-[20px] opacity-100 rotate-0 transition-all hover:bg-[#eef2f6] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

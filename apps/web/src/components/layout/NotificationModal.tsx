"use client";

import React from 'react';
import { X, RotateCw, Inbox } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-3 w-[320px] bg-white border border-slate-200/60 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 p-4 animate-in fade-in zoom-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-[16px] font-semibold text-[#0a092e] font-inter">Notifications</span>
        <div className="flex items-center gap-2">
          <button className="text-slate-400 hover:text-slate-600 transition-colors p-1" onClick={() => {}}>
            <RotateCw size={16} />
          </button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors p-1" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div className="w-[50px] h-[50px] rounded-xl border border-slate-100 bg-slate-50/55 flex items-center justify-center text-slate-300">
          <Inbox size={22} strokeWidth={1.5} />
        </div>
        <span className="text-[13px] font-medium text-slate-400 font-inter">No new notifications</span>
      </div>

      {/* Footer */}
      <div className="pt-2">
        <button
          onClick={onClose}
          className="w-full h-[38px] flex items-center justify-center border border-slate-200 rounded-[12px] bg-white text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors font-inter"
        >
          Close
        </button>
      </div>
    </div>
  );
}

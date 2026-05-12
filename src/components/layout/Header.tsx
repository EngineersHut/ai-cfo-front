"use client";

import React from 'react';
import {
  ChevronDown,
  Sun,
  Settings,
  Bell,
  SlidersHorizontal,
  Download,
  Plus,
  Building2
} from 'lucide-react';

export default function Header() {
  return (
    <header className="h-[60px] bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">

      {/* Left Section: Breadcrumbs (Toggle removed as it's now in Sidebar) */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-all group">
            <div className="w-8 h-8 bg-white rounded-lg border border-slate-100 flex items-center justify-center shadow-sm">
              <Building2 size={16} className="text-slate-400 group-hover:text-blue-500" />
            </div>
            <span className="text-[14px] font-bold text-slate-700">Acme Inc</span>
            <ChevronDown size={14} className="text-slate-300" />
          </div>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <span className="text-[14px] font-medium text-slate-400">Overview</span>
        </div>
      </div>

      {/* Right Section: Icons + Actions */}
      <div className="flex items-center gap-3">
        {/* Functional Icons */}
        <div className="flex items-center gap-1.5 mr-2">
          <IconButton icon={<Sun size={18} />} />
          <IconButton icon={<Settings size={18} />} />
          <IconButton icon={<Bell size={18} />} />
        </div>

        <div className="h-6 w-px bg-slate-200 mr-2" />

        {/* Buttons Group */}
        <div className="flex items-center gap-3">
          <button className="h-[40px] px-4 flex items-center gap-2 text-[13px] font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all text-slate-700">
            <SlidersHorizontal size={16} className="text-slate-400" /> Customize
          </button>
          <button className="h-[40px] px-4 flex items-center gap-2 text-[13px] font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all text-slate-700">
            <Download size={16} className="text-slate-400" /> Export
          </button>
          <button className="h-[40px] px-5 flex items-center gap-2 text-[13px] font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
            <Plus size={18} /> Add Report
          </button>
        </div>
      </div>
    </header>
  );
}

function IconButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all">
      {icon}
    </button>
  );
}

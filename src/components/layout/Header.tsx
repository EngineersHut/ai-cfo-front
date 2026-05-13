"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Sun,
  Settings,
  Bell,
  SlidersHorizontal,
  Download,
  Plus,
  Check
} from 'lucide-react';
import { workspaceOptions, WorkspaceOption } from '@/components/common/Option';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceOption>(workspaceOptions[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[60px] bg-white  flex items-center justify-between px-8 sticky top-0 z-10">

      {/* Left Section: Workspace Selector with Dropdown */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
              {selectedWorkspace.icon}
            </div>
            <span className="text-[15px] font-normal text-[#1e293b] font-inter">
              {selectedWorkspace.label}
            </span>
            <ChevronDown
              size={16}
              className={`text-slate-400 ml-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-3 w-[240px] bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-2 border-b border-slate-50 mb-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Workspaces</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {workspaceOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => {
                      setSelectedWorkspace(option);
                      setIsOpen(false);
                    }}
                    className={`group flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all ${selectedWorkspace.id === option.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                  >
                    <div className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${selectedWorkspace.id === option.id
                      ? 'bg-white border-blue-200 text-blue-600 shadow-sm'
                      : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-slate-600'
                      }`}>
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] truncate ${selectedWorkspace.id === option.id ? 'font-semibold text-blue-600' : 'font-normal text-slate-700'
                        }`}>
                        {option.label}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{option.description}</p>
                    </div>
                    {selectedWorkspace.id === option.id && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-6 w-px bg-slate-200 mx-2" />
          <span className="text-[15px] font-normal text-slate-500 font-inter">
            Overview
          </span>
        </div>
      </div>

      {/* Right Section: Icons + Actions */}
      <div className="flex items-center gap-[20px]">
        {/* Functional Icons Group (104x36) */}
        <div className="w-[104px] h-[36px] flex items-center justify-between gap-[16px]">
          <IconButton icon={<Sun size={18} />} />
          <IconButton icon={<Settings size={18} />} />
          <IconButton icon={<Bell size={18} />} />
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* Buttons Group (356px total width group with 10px gap) */}
        <div className="flex items-center gap-[10px]">
          <button className="h-[36px] w-[120px] flex items-center gap-[6px] px-[12px] pr-[16px] py-[4px] bg-white border border-slate-200 rounded-[8px] hover:bg-slate-50 transition-all text-slate-900 group">
            <SlidersHorizontal size={16} className="text-slate-400 group-hover:text-blue-600" />
            <span className="text-[14px] font-normal leading-[20px] font-inter">Customize</span>
          </button>

          <button className="h-[36px] w-[97px] flex items-center gap-[6px] px-[12px] pr-[16px] py-[4px] bg-white border border-slate-200 rounded-[8px] hover:bg-slate-50 transition-all text-slate-900 group">
            <DownloadIcon />
            <span className="text-[14px] font-normal leading-[20px] font-inter">Export</span>
          </button>

          <button className="h-[36px] w-[125px] flex items-center justify-center gap-[6px] px-[12px] py-[4px] bg-blue-600 text-white rounded-[8px] hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-95">
            <Plus size={18} />
            <span className="text-[14px] font-normal leading-[20px] font-inter tracking-normal">Add Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function IconButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
      {icon}
    </button>
  );
}

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="m9 15 3 3 3-3" />
  </svg>
);

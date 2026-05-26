"use client";

import React from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { drawerGroups } from '@/data/drawerData';
import { useDashboardSettings } from '@/context/DashboardContext';

interface CustomizeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomizeDrawer({ isOpen, onClose }: CustomizeDrawerProps) {
  const { visibility, toggleVisibility, resetToDefaults } = useDashboardSettings();

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] transition-opacity duration-300 animate-in fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer Panel - Responsive Width */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[340px] bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.08)] z-[101] transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header - Height 78px, Padding 16px 18px 1px 18px */}
        <div className="h-[78px] border-b border-slate-100 flex items-start justify-between pt-[16px] pr-[18px] pb-[1px] pl-[18px] shrink-0">
          <div className="flex items-start gap-4">
            <div className="w-[24px] h-[24px] bg-[#eff6ff] rounded-[6px] flex items-center justify-center shrink-0 px-[5.5px]">
              <SlidersHorizontal size={13} className="text-[#2563eb]" />
            </div>
            <div className="space-y-0.5 pt-0.5">
              <h2 className="text-[14px] font-semibold text-[#0f172a] font-inter leading-[21px] tracking-[0px]">Customize Dashboard</h2>
              <p className="text-[11px] text-slate-500 font-inter leading-tight">
                Changes apply instantly · auto-saved
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-[28px] h-[28px] flex items-center justify-center rounded-[7px] border border-slate-100 hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900 px-[6px]"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content Area - Mapping Groups */}
        <div className="flex-1 overflow-y-auto pt-[29px] px-[16px] pb-[29px] space-y-[24px]">
          {drawerGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{group.title}</h3>
                <div className="h-px bg-slate-100 w-full" />
              </div>

              <div className="space-y-[11px]">
                {group.sections.map((section) => (
                  <div key={section.id} className="w-[292px] border border-slate-100 rounded-[10px] bg-white flex flex-col overflow-hidden mx-auto shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-2">
                        <section.icon size={15} className="text-blue-500" />
                        <span className="text-[12px] font-semibold text-slate-800 font-inter leading-[18px] tracking-[0px]">{section.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[11px] font-bold rounded-full">{section.count}</span>
                        <button className="text-[10.5px] font-medium text-blue-600 font-inter leading-[15.75px] tracking-[0px] text-center hover:underline">Hide all</button>
                      </div>
                    </div>
                    <div className="flex-1">
                      {section.items.map((item) => (
                        <KPIToggleItem 
                          key={item.id} 
                          id={item.id}
                          icon={item.icon} 
                          label={item.label} 
                          sub={item.sub} 
                          isEnabled={visibility[item.id] ?? true}
                          onToggle={toggleVisibility}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions - Matched to Screenshot */}
        <div className="h-[56px] border-t border-slate-100 bg-white flex items-center justify-between pt-[12px] pr-[18.17px] pb-[12px] pl-[17.95px] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-[11px] font-normal text-slate-500 font-inter leading-[16.5px] tracking-[0px]">All sections visible</span>
          </div>
          
          <button 
            onClick={resetToDefaults}
            className="flex items-center justify-center gap-2 w-[135px] h-[31px] rounded-[7px] border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
          >
            <RotateCcw size={12} className="text-slate-400" />
            <span className="text-[11.5px] font-medium font-inter leading-[17.25px] tracking-[0px] text-center">Reset to defaults</span>
          </button>
        </div>
      </div>
    </>
  );
}

interface ToggleItemProps {
  id: string;
  icon: string;
  label: string;
  sub: string;
  isEnabled: boolean;
  onToggle: (id: string) => void;
}

function KPIToggleItem({ id, icon, label, sub, isEnabled, onToggle }: ToggleItemProps) {
  return (
    <div className="px-4 py-3 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
      <div className="flex items-center gap-3">
        <span className="text-[20px]">{icon}</span>
        <div className="flex flex-col">
          <span className="text-[12.5px] font-medium text-slate-800 font-inter leading-[18.75px] tracking-[0px]">{label}</span>
          <span className="text-[10.5px] font-normal text-slate-400 font-inter leading-[15.75px] tracking-[0px]">{sub}</span>
        </div>
      </div>
      <button 
        onClick={() => onToggle(id)}
        className={`w-[36px] h-[20px] rounded-full relative transition-all duration-300 ${isEnabled ? 'bg-[#2563eb]' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-[16px] h-[16px] bg-white rounded-full transition-all duration-300 shadow-sm ${isEnabled ? 'translate-x-[16px]' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

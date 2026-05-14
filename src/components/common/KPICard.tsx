"use client";

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { KPICardProps } from '@/types/dashboard';

export default function KPICard({
  icon,
  label,
  value,
  unit,
  trend,
  sub,
  showTrend = true,
  isDown = false,
  noTrendIcon = false
}: KPICardProps) {
  return (
    <div className="rounded-[12px] border border-[#e2e8f0] bg-white flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="h-[54px] p-[12px] flex flex-col justify-center gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
            {icon}
          </div>
          <span className="text-[14px] font-normal text-slate-500 font-inter leading-[20px] tracking-[0%] line-clamp-1">
            {label}
          </span>
        </div>
      </div>

      <div className="h-[76px] p-[12px] bg-white border-t border-[#f1f5f9] flex flex-col justify-center gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-medium text-slate-900 font-inter leading-[32px] tracking-[0%]">
              {value}
            </span>
            {unit && <span className="text-[12px] text-slate-400 font-medium">{unit}</span>}
          </div>

          {showTrend && <div className={`flex items-center gap-[2px] pt-[2px] pr-[6px] pb-[2px] pl-[4px] rounded-[4px] border text-[12px] font-normal font-inter leading-[16px] tracking-[0%] shrink-0 ${noTrendIcon ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
            isDown ? 'bg-red-50 text-red-500 border-red-100' :
              'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
            {!noTrendIcon && (isDown ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />)}
            <span className="truncate">{noTrendIcon ? 'Stable' : trend}</span>
          </div>}
        </div>
        <p className="text-[12px] font-normal text-slate-400 font-inter leading-[16px] tracking-[0%] line-clamp-1">
          {sub}
        </p>
      </div>
    </div>
  );
}

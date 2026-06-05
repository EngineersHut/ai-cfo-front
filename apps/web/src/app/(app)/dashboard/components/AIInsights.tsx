"use client";

import { Pin } from 'lucide-react';
import { useSelector } from '@/store';

interface AIInsightItem {
  id: string;
  title: string;
  description: string;
  percentage?: string;
  color?: string;
  bgColor?: string;
  textColor?: string;
}

export default function AIInsights({ insights }: { insights?: AIInsightItem[] }) {
  const { aiInsights: dashboardInsights } = useSelector((state) => state.dashboard);
  const activeInsights = insights || dashboardInsights || [];

  return (
    <div className="w-full h-auto md:h-[174px] bg-white rounded-[12px] border border-slate-100 shadow-sm overflow-hidden pb-4 md:pb-0">
      {/* Header */}
      <div className="h-[54px] flex items-center p-[12px] gap-[12px] border-b border-slate-50">
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
          <Pin size={16} />
        </div>
        <h3 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">AI Insights</h3>
      </div>

      {/* Insights Grid */}
      <div className="p-[16px] grid grid-cols-1 md:grid-cols-3 gap-10">
        {activeInsights.map((item) => (
          <div key={item.id} className="flex gap-2 group">
            {/* Left Indicator Bar */}
            <div
              className="w-1 rounded-full shrink-0 h-full min-h-[60px]"
              style={{ backgroundColor: item.color }}
            />

            <div className="space-y-1">
              {/* Category Badge */}
              <div
                className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[12px] font-normal font-inter leading-[16px] tracking-[0%] align-middle"
                style={{ backgroundColor: item.bgColor, color: item.textColor }}
              >
                {item.title} <span className="ml-1 opacity-70">{item.percentage}</span>
              </div>

              {/* Insight Text */}
              <p className="text-[14px] text-slate-600 font-inter font-normal leading-[20px] tracking-[0%] align-middle">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

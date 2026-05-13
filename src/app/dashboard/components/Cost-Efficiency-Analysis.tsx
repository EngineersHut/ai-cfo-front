"use client";

import React from 'react';
import { 
  Pin, 
  FileDown, 
  Info, 
  ShieldCheck, 
  Zap, 
  Plus,
  Play
} from 'lucide-react';
import { detailedCostData } from '@/data/dashboardData';

const IconMap: any = {
  ShieldCheck: ShieldCheck,
  Zap: Zap,
  Plus: Plus
};

export default function CostEfficiencyAnalysis() {
  const { summary, breakdown, unitEconomics, insights } = detailedCostData;

  return (
    <div className="w-full space-y-6">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Pin size={18} className="text-slate-300 -rotate-45" />
          <div className="flex items-baseline gap-3">
            <h2 className="text-[20px] font-semibold text-slate-800 font-inter">Cost & Efficiency Analysis</h2>
            <span className="text-[14px] text-slate-400 font-normal">Q2 2026 · Auto-refreshed every 15 min</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-[8px] border border-slate-200 bg-white text-slate-600 text-[14px] font-medium hover:bg-slate-50 transition-all shadow-sm">
          <FileDown size={16} />
          Export CSV
        </button>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {summary.map((card, i) => (
          <div key={i} className="p-5 bg-white rounded-[16px] border border-slate-100 shadow-sm flex flex-col gap-4">
            <span className="text-[12px] font-normal text-slate-400 uppercase tracking-wider">{card.label}</span>
            <div className="flex items-center justify-between">
              <span className="text-[28px] font-bold text-slate-900 leading-none">{card.value}</span>
              <div className={`px-2 py-1 rounded-[4px] text-[12px] font-medium flex items-center gap-1 ${
                card.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
              }`}>
                {card.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Detailed Metrics Table */}
        <div className="lg:col-span-7 bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 overflow-hidden">
          <div className="grid grid-cols-12 mb-6 border-b border-slate-50 pb-4">
            <div className="col-span-5 text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Metric</div>
            <div className="col-span-3 text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Value</div>
            <div className="col-span-2 text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Vs Prior</div>
            <div className="col-span-2 text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Distribution</div>
          </div>

          <div className="space-y-8">
            {/* COST BREAKDOWN SECTION */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4">Cost Breakdown</h3>
              {breakdown.map((item, i) => (
                <div key={i} className="grid grid-cols-12 items-center group cursor-pointer py-1">
                  <div className="col-span-5 flex items-center gap-2">
                    <span className="text-[14px] font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{item.metric}</span>
                    <Info size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="col-span-3 flex flex-col">
                    <span className="text-[14px] font-bold text-slate-800">{item.value}</span>
                    <span className="text-[12px] text-slate-400">{item.sub}</span>
                  </div>
                  <div className="col-span-2">
                    <div className={`px-2 py-1 rounded-[4px] text-[12px] font-medium w-fit ${
                      item.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 
                      item.trend === 'Stable' ? 'bg-slate-50 text-slate-500' : 'bg-red-50 text-red-500'
                    }`}>
                      {item.trend}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${item.distribution}%`, backgroundColor: item.color }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* UNIT ECONOMICS SECTION */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4">Unit Economics</h3>
              {unitEconomics.map((item, i) => (
                <div key={i} className="grid grid-cols-12 items-center group cursor-pointer py-1">
                  <div className="col-span-5 flex items-center gap-2">
                    <span className="text-[14px] font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{item.metric}</span>
                    <Info size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="col-span-3 flex flex-col">
                    <span className="text-[14px] font-bold text-slate-800">{item.value}</span>
                    <span className="text-[12px] text-slate-400">{item.sub}</span>
                  </div>
                  <div className="col-span-2">
                    <div className={`px-2 py-1 rounded-[4px] text-[12px] font-medium w-fit ${
                      item.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                    }`}>
                      {item.trend}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${item.distribution}%`, backgroundColor: item.color }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-10 flex items-center gap-6 border-t border-slate-50 pt-6">
            <span className="text-[12px] text-slate-400">Legend:</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-blue-600 rounded-full" />
                <span className="text-[12px] text-slate-500">Normal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-amber-500 rounded-full" />
                <span className="text-[12px] text-slate-500">Near limit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-red-500 rounded-full" />
                <span className="text-[12px] text-slate-500">Above target</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: CFO Insights */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Pin size={16} className="text-slate-300 -rotate-45" />
              <div>
                <h3 className="text-[16px] font-semibold text-slate-800">CFO Insights</h3>
                <p className="text-[12px] text-slate-400">Powered by AI analysis</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {insights.map((insight) => {
              const Icon = IconMap[insight.icon];
              const themeColor = insight.color === 'blue' ? 'blue' : insight.color === 'purple' ? 'purple' : 'emerald';
              
              return (
                <div key={insight.id} className={`p-5 rounded-[16px] border ${
                  themeColor === 'blue' ? 'bg-blue-50/50 border-blue-100' : 
                  themeColor === 'purple' ? 'bg-indigo-50/50 border-indigo-100' : 'bg-emerald-50/50 border-emerald-100'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-1.5 rounded-md ${
                      themeColor === 'blue' ? 'bg-blue-100 text-blue-600' : 
                      themeColor === 'purple' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <h4 className={`text-[14px] font-bold ${
                      themeColor === 'blue' ? 'text-blue-900' : 
                      themeColor === 'purple' ? 'text-indigo-900' : 'text-emerald-900'
                    }`}>{insight.title}</h4>
                  </div>
                  <ul className="space-y-3">
                    {insight.points.map((point: string, j: number) => {
                      const bulletColors = ['text-amber-500', 'text-amber-500', 'text-emerald-500'];
                      const isEfficiency = insight.id === 'eff';
                      const bulletColor = isEfficiency ? (j === 1 ? 'text-amber-500' : 'text-emerald-500') : bulletColors[j] || 'text-slate-400';
                      
                      return (
                        <li key={j} className="flex gap-3 text-[13px] leading-relaxed text-slate-600">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${bulletColor}`} />
                          {point}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Deep Analysis CTA */}
          <div className="p-4 bg-white rounded-[16px] border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all">
            <div>
              <h4 className="text-[14px] font-bold text-slate-800">Run Deep Analysis</h4>
              <p className="text-[12px] text-slate-400">Get AI-generated cost reduction plan</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 rounded-[10px] text-white text-[14px] font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95">
              <Plus size={18} />
              Analyse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

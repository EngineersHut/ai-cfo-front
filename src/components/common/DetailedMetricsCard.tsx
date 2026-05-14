"use client";

import React from 'react';
import { Truck, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricRow {
    metric: string;
    value: string;
    sub: string;
    trend: string;
    isUp: boolean;
    distribution: number;
    color: string;
}

interface DetailedMetricsCardProps {
    title: string;
    icon?: React.ReactNode;
    isLive?: string;
    data: MetricRow[];
    className?: string;
    height?: string;
}

export default function DetailedMetricsCard({
    title,
    icon = <Truck size={16} />,
    isLive = '',
    data,
    className = "",
    height = "374px"
}: DetailedMetricsCardProps) {
    return (
        <div className={`bg-white rounded-[16px] border border-slate-100 shadow-sm flex flex-col overflow-hidden ${className}`} style={{ height }}>
            <div className="p-[16px] h-[52px] flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        {icon}
                    </div>
                    <h3 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">{title}</h3>
                </div>
                {
                    isLive && <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md uppercase tracking-wider animate-pulse">{isLive}</div>
                }

            </div>

            <div className="px-[16px] py-[12px]">
                <div className=" rounded-[12px] border-1 border-[ rgba(226, 232, 240, 1)] px-[16px] py-[12px]">
                    <div className="grid grid-cols-12 mb-4 px-2">
                        <div className="col-span-4 text-[10px] font-semibold text-slate-300 uppercase tracking-wider">Metric</div>
                        <div className="col-span-3 text-[10px] font-semibold text-slate-300 uppercase tracking-wider">Value</div>
                        <div className="col-span-2 text-[10px] font-semibold text-slate-300 uppercase tracking-wider">Vs Prior</div>
                        <div className="col-span-3 text-[10px] font-semibold text-slate-300 uppercase tracking-wider text-right">Distribution</div>
                    </div>

                    <div className="space-y-6">
                        {data.map((item, i) => (
                            <div key={i} className="grid grid-cols-12 items-center px-2 group">
                                <div className="col-span-4 flex items-center gap-2">
                                    <span className="text-[13px] font-medium text-slate-700 font-inter line-clamp-1">{item.metric}</span>
                                    <Info size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-help shrink-0" />
                                </div>
                                <div className="col-span-3 flex flex-col">
                                    <span className="text-[14px] font-bold text-slate-900 font-inter leading-none mb-1">{item.value}</span>
                                    <span className="text-[10px] text-slate-400 font-inter">{item.sub}</span>
                                </div>
                                <div className="col-span-2">
                                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] border text-[11px] font-medium ${item.isUp ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'
                                        }`}>
                                        {item.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                        {item.trend}
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${item.distribution}%`, backgroundColor: item.color }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

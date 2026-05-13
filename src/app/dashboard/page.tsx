"use client";

import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Wallet,
  Briefcase,
  Activity,
  Truck,
  Users,
  Zap,
  Clock,
  BarChart3,
  Sparkles
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { useDashboardSettings } from '@/context/DashboardContext';

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];

export default function ReportPage() {
  const { visibility } = useDashboardSettings();
  const [timeframe, setTimeframe] = useState('Monthly');

  return (
    <div className="space-y-8">

      {/* Dashboard Header */}
      <div className="w-full h-auto sm:h-[64px] flex flex-col sm:flex-row sm:items-center justify-between gap-[10px] pt-[4px] pb-[4px]">
        <div className="space-y-1">
          <h1 className="text-[24px] font-medium text-slate-800 font-inter leading-[32px] tracking-[0%]">Operational Overview</h1>
          <p className="text-[14px] font-normal text-slate-400 font-inter leading-[20px] tracking-[0%]">Track fleet performance, cost efficiency, and drive actionable insights.</p>
        </div>

        <div className="w-[265px] h-[48px] flex items-center justify-between p-[5px] bg-white border border-slate-100 rounded-[8px] shadow-sm shrink-0">
          {['Monthly', 'Quarterly', 'Yearly'].map((option) => (
            <button
              key={option}
              onClick={() => setTimeframe(option)}
              className={`w-[86px] h-[36px] flex items-center justify-center py-[4px] px-[16px] text-[12px] font-semibold rounded-[8px] transition-all duration-200 ${timeframe === option
                ? 'bg-[#2563eb] text-white shadow-md border border-[#2563eb]'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid - Manually Rendered for Granular Control */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px] ">

        {/* ROW 1: Operational KPIs */}
        {visibility['total-trips'] && (
          <KPICard
            icon={<Truck size={14} />}
            label="Total Deliveries / Trips"
            value="70"
            trend="+12.5%"
            sub="Healthy Liquidity Profile"
          />
        )}

        {visibility['del-per-veh'] && (
          <KPICard
            icon={<Activity size={14} />}
            label="Deliveries Per Vehicle"
            value="200"
            unit="/ Day"
            trend="+1.5%"
            sub="Per vehicle daily average"
          />
        )}

        {visibility['fleet-util'] && (
          <KPICard
            icon={<Zap size={14} />}
            label="Fleet Utilization"
            value="95%"
            trend="-1.2%"
            isDown
            sub="Near-optimal fleet coverage"
          />
        )}

        {visibility['driver-eff'] && (
          <KPICard
            icon={<Users size={14} />}
            label="Driver Efficiency"
            value="80%"
            trend="Stable"
            noTrendIcon
            sub="Below 85% target review score..."
          />
        )}

        {/* ROW 2: Financial KPIs */}
        {visibility['runway'] && (
          <KPICard
            icon={<Clock size={14} />}
            label="Cash Runway"
            value="12 months"
            trend="+12.5%"
            sub="Projected survival time"
          />
        )}

        {visibility['growth'] && (
          <KPICard
            icon={<TrendingUp size={14} />}
            label="Growth %"
            value="18.2%"
            trend="+5.4%"
            sub="Month-over-month increase"
          />
        )}

        {visibility['ebitda'] && (
          <KPICard
            icon={<DollarSign size={14} />}
            label="EBITDA"
            value="$45,000"
            trend="-1.2%"
            isDown
            sub="Earnings before interest"
          />
        )}

        {visibility['cashflow'] && (
          <KPICard
            icon={<Wallet size={14} />}
            label="Operating Cash Flow"
            value="$22,000"
            unit="/ Month"
            trend="+3.2%"
            sub="Net cash from operations"
          />
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        {visibility['rev-time'] && (
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-[16px] flex items-center gap-2 text-slate-800">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <TrendingUp size={16} className="text-blue-600" />
                </div>
                Revenue Over Time
              </h3>
            </div>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable KPI Card based on Figma Actual CSS
function KPICard({ icon, label, value, unit, trend, sub, isDown = false, noTrendIcon = false }: any) {
  return (
    <div className=" rounded-[12px] border border-[#e2e8f0] bg-white flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Upper Section - 76px (Icon & Label) */}
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

      {/* Lower Section - 54px (Value, Trend & Subtext) */}
      <div className="h-[76px] p-[12px] bg-white border-t border-[#f1f5f9] flex flex-col justify-center gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-medium text-slate-900 font-inter leading-[32px] tracking-[0%]">
              {value}
            </span>
            {unit && <span className="text-[12px] text-slate-400 font-medium">{unit}</span>}
          </div>

          <div className={` flex items-center gap-[2px] pt-[2px] pr-[6px] pb-[2px] pl-[4px] rounded-[4px] border text-[12px] font-normal font-inter leading-[16px] tracking-[0%] shrink-0 ${noTrendIcon ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
            isDown ? 'bg-red-50 text-red-500 border-red-100' :
              'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
            {!noTrendIcon && (isDown ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />)}
            <span className="truncate">{noTrendIcon ? 'Stable' : trend}</span>
          </div>
        </div>
        <p className="text-[12px] font-normal text-slate-400 font-inter leading-[16px] tracking-[0%] line-clamp-1">
          {sub}
        </p>
      </div>
    </div>
  );
}

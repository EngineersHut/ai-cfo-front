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
  LineChart,
  Sparkles,
  PieChart,
  Target,
  ArrowRight,
  Pin
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
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';
import { useDashboardSettings } from '@/context/DashboardContext';
import { revenueData, healthData } from '@/data/dashboardData';
import { KPICardProps } from '@/types/dashboard';

// Custom Gauge Needle Component - Proportional to Compact Gauge
const RADIAN = Math.PI / 180;
const NeedleLayer = ({ value, cx, cy, iR, oR }: any) => {
  const ang = 180.0 * (1 - value / 100);
  const length = oR + 15;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 8; // Sleeker needle width
  const x0 = cx;
  const y0 = cy;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return (
    <svg className="absolute inset-0 pointer-events-none z-50 w-full h-full">
      <g>
        {/* Solid Navy Pivot - Proportional */}
        <circle cx={x0} cy={y0} r={r + 4} fill="#1a2153" stroke="none" />
        {/* Sleeker Needle */}
        <path d={`M${xba} ${yba}L${xbb} ${ybb}L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill="#1a2153" />
        {/* Center White Dot */}
        <circle cx={x0} cy={y0} r={3} fill="#fff" stroke="none" />
      </g>
    </svg>
  );
};

// Custom Label Component for Outer Gauge Arc
const renderOuterLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, name } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-RADIAN * midAngle);
  const y = cy + radius * Math.sin(-RADIAN * midAngle);

  return (
    <text
      x={x}
      y={y}
      fill="#1a2153"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[11px] font-bold tracking-tight font-inter"
      style={{ transform: `rotate(${90 - midAngle}deg)`, transformOrigin: `${x}px ${y}px` }}
    >
      {name}
    </text>
  );
};

export default function ReportPage() {
  const { visibility } = useDashboardSettings();
  const [timeframe, setTimeframe] = useState('Monthly');
  const [activeChart, setActiveChart] = useState('line');

  // Vibrant Gradient definitions
  const gaugeGradients = [
    {
      id: 'gradPoor',
      stops: [
        { offset: '32.29%', color: '#FF0508' },
        { offset: '33.05%', color: '#FF0C0B' },
        { offset: '37.63%', color: '#FF2F1A' },
        { offset: '41.92%', color: '#FF4924' },
        { offset: '45.79%', color: '#FF592B' },
        { offset: '48.86%', color: '#FF5E2D' }
      ]
    },
    { id: 'gradFair', stops: [{ offset: '0%', color: '#ffb74d' }, { offset: '100%', color: '#f57c00' }] },
    { id: 'gradGood', stops: [{ offset: '0%', color: '#fff176' }, { offset: '100%', color: '#fbc02d' }] },
    { id: 'gradExcellent', stops: [{ offset: '0%', color: '#69f0ae' }, { offset: '100%', color: '#2e7d32' }] },
  ];

  // Data for the outer arc (Soft tints)
  const outerHealthData = [
    { name: 'POOR', value: 25, color: '#ffebee' },
    { name: 'FAIR', value: 25, color: '#fff3e0' },
    { name: 'GOOD', value: 25, color: '#fffde7' },
    { name: 'EXCELLENT', value: 25, color: '#e8f5e9' },
  ];

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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {/* Row 1 Operational */}
        {visibility['total-trips'] && <KPICard icon={<Truck size={14} />} label="Total Deliveries / Trips" value="70" trend="+12.5%" sub="Healthy Liquidity Profile" />}
        {visibility['del-per-veh'] && <KPICard icon={<Activity size={14} />} label="Deliveries Per Vehicle" value="200" unit="/ Day" trend="+1.5%" sub="Per vehicle daily average" />}
        {visibility['fleet-util'] && <KPICard icon={<Zap size={14} />} label="Fleet Utilization" value="95%" trend="-1.2%" isDown sub="Near-optimal fleet coverage" />}
        {visibility['driver-eff'] && <KPICard icon={<Users size={14} />} label="Driver Efficiency" value="80%" trend="Stable" noTrendIcon sub="Below 85% target review score..." />}

        {/* Row 2 Financial */}
        {visibility['runway'] && <KPICard icon={<Clock size={14} />} label="Cash Runway" value="12 months" trend="+12.5%" sub="Projected survival time" />}
        {visibility['growth'] && <KPICard icon={<TrendingUp size={14} />} label="Growth %" value="18.2%" trend="+5.4%" sub="Month-over-month increase" />}
        {visibility['ebitda'] && <KPICard icon={<DollarSign size={14} />} label="EBITDA" value="$45,000" trend="-1.2%" isDown sub="Earnings before interest" />}
        {visibility['cashflow'] && <KPICard icon={<Wallet size={14} />} label="Operating Cash Flow" value="$22,000" unit="/ Month" trend="+3.2%" sub="Net cash from operations" />}
      </div>

      {/* Charts & Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">

        {/* Revenue Over Time Chart (Span 2) */}
        {visibility['rev-time'] && (
          <div className="lg:col-span-2 max-w-[726px] w-full h-[526.72px] bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col mx-auto lg:mx-0 overflow-hidden">
            {/* Chart Header - 68px */}
            <div className="h-[68px] flex items-center justify-between p-[12px] gap-[12px] border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Briefcase size={16} />
                </div>
                <h3 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">Revenue Over Time</h3>
              </div>
              <div className="flex items-center gap-[6px]">
                <button
                  onClick={() => setActiveChart('line')}
                  className={`w-[44px] h-[44px] flex items-center justify-center p-[4px_12px] rounded-[8px] border transition-all duration-200 ${activeChart === 'line' ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                    }`}
                >
                  <LineChart size={18} />
                </button>
                <button
                  onClick={() => setActiveChart('bar')}
                  className={`w-[44px] h-[44px] flex items-center justify-center p-[4px_12px] rounded-[8px] border transition-all duration-200 ${activeChart === 'bar' ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                    }`}
                >
                  <BarChart3 size={18} />
                </button>
                <button
                  onClick={() => setActiveChart('pie')}
                  className={`w-[44px] h-[44px] flex items-center justify-center p-[4px_12px] rounded-[8px] border transition-all duration-200 ${activeChart === 'pie' ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                    }`}
                >
                  <PieChart size={18} />
                </button>
              </div>
            </div>

            {/* Chart Body - 463px */}
            <div className="h-[463px] flex-1 w-full border border-[rgba(26,21,83,0.08)] relative py-[12px] px-[16px] flex flex-col gap-[16px]">
              <div className="flex-1 w-full relative rounded-[10px] border border-[rgba(26,21,83,0.08)] bg-slate-50/30 flex flex-col overflow-hidden">
                <div className="flex-1 w-full relative p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        tickFormatter={(value) => `${value / 100}k`}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        activeDot={{ r: 6, fill: "#fff", stroke: "#8b5cf6", strokeWidth: 3 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="#fbbf24"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorProfit)"
                        activeDot={{ r: 6, fill: "#fff", stroke: "#fbbf24", strokeWidth: 3 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Chart Legend - Styled inside the inner box */}
                <div className="flex items-center justify-center gap-8 py-3 bg-white border-t border-[rgba(26,21,83,0.08)]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
                    <span className="text-[14px] font-normal text-slate-500 font-inter leading-[132%] capitalize tracking-[0%]">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                    <span className="text-[14px] font-normal text-slate-500 font-inter leading-[132%] capitalize tracking-[0%]">Net Profit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Widgets Column */}
        <div className="space-y-4">
          {/* Company Health Meter */}
          {visibility['health'] && (
            <div className="h-[338.72px] bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
              {/* Header - 54px */}
              <div className="h-[54px] flex items-center p-[12px] gap-[12px] border-b border-slate-50">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Pin size={16} />
                </div>
                <h3 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">Company Health Meter</h3>
              </div>

              {/* Body */}
              <div className="flex-1  flex flex-col">
                <div className="relative h-[200px] w-full flex items-center justify-center">
                  <div className="w-[300px] h-[200px] relative mx-auto">
                    {/* Compact Gauge Chart with ZERO Gaps */}
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <defs>
                          {gaugeGradients.map((grad) => (
                            <linearGradient key={grad.id} id={grad.id} x1="0" y1="0" x2="0" y2="1">
                              {grad.stops.map((stop, i) => (
                                <stop key={i} offset={stop.offset} stopColor={stop.color} />
                              ))}
                            </linearGradient>
                          ))}
                        </defs>
                        {/* Outer Arc - Touching the inner arc (No Gap) */}
                        <Pie
                          data={outerHealthData}
                          cx={150}
                          cy={155}
                          startAngle={180}
                          endAngle={0}
                          innerRadius={100}
                          outerRadius={135}
                          paddingAngle={0}
                          dataKey="value"
                          stroke="none"
                          labelLine={false}
                          label={renderOuterLabel}
                        >
                          {outerHealthData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        {/* Compact Inner Arc - Still 60px Thick (40 to 100) */}
                        <Pie
                          data={healthData}
                          cx={150}
                          cy={155}
                          startAngle={180}
                          endAngle={0}
                          innerRadius={40}
                          outerRadius={100}
                          paddingAngle={0}
                          dataKey="value"
                          stroke="none"
                        >
                          {healthData.map((entry, index) => {
                            const gradientIds = ['gradPoor', 'gradFair', 'gradGood', 'gradExcellent'];
                            return <Cell key={`cell-${index}`} fill={`url(#${gradientIds[index]})`} />;
                          })}
                        </Pie>
                      </RePieChart>
                    </ResponsiveContainer>

                    {/* Independent Needle Layer */}
                    <NeedleLayer value={84} cx={150} cy={155} iR={40} oR={100} />
                  </div>
                </div>

                <div className="text-center mb-4">
                  <p className="text-[12px] font-normal text-slate-600 mb-1 font-inter leading-none tracking-[0%]">Today Health</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-[9.47px] font-normal text-slate-400 uppercase tracking-[0%] font-inter leading-[13.53px] text-center">EXCELLENT</span>
                    <span className="text-[16px] font-semibold text-slate-900 font-inter leading-none tracking-[0%]">84</span>
                  </div>
                </div>

                {/* Health Metrics Details */}
                <div className="px-6 pb-4 space-y-3 border-t border-slate-50 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-normal text-slate-700 font-inter leading-none">Audit Compliance (40%)</span>
                    <span className="text-[14px] font-semibold text-slate-900 font-inter leading-none">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-normal text-slate-700 font-inter leading-none">Equity Health</span>
                    <span className="text-[14px] font-semibold text-slate-900 font-inter leading-none">84%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Forecast vs Reality - Blue Card */}
          <div className="bg-[#1e40af] p-6 rounded-[24px] text-white shadow-lg flex flex-col gap-6 relative overflow-hidden group cursor-pointer hover:bg-[#1d4ed8] transition-all">
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-[16px] font-semibold">Forecast vs Reality</h3>
              <Target size={20} className="text-white/40" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between text-[11px] font-medium text-white/70">
                <span>Market Penetration Goal</span>
                <span>40% achieved</span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full w-[40%]" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 relative z-10">
              <div>
                <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">Current Progress</p>
                <h4 className="text-[18px] font-bold">Achieved 2% of 5% target</h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                <ArrowRight size={18} />
              </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable KPI Card based on Figma Actual CSS
function KPICard({ icon, label, value, unit, trend, sub, isDown = false, noTrendIcon = false }: KPICardProps) {
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

          <div className={`flex items-center gap-[2px] pt-[2px] pr-[6px] pb-[2px] pl-[4px] rounded-[4px] border text-[12px] font-normal font-inter leading-[16px] tracking-[0%] shrink-0 ${noTrendIcon ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
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

"use client";

import React from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Wallet,
  Briefcase,
  Activity,
  ChevronDown
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
  Bar
} from 'recharts';

const revenueData = [
  { name: 'Jan', value: 45000 },
  { name: 'Feb', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Apr', value: 61000 },
  { name: 'May', value: 55000 },
  { name: 'Jun', value: 67000 },
  { name: 'Jul', value: 72000 },
];

export default function ReportPage() {
  return (
    <div className="space-y-6">

      {/* Report Info Card */}
      <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex gap-12">
          <InfoItem label="PERIOD" value="March 2025" />
          <InfoItem label="TYPE" value="Monthly" />
          <InfoItem label="RANGE" value="Mar 1 – 31, 2025" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 text-[10px] font-black uppercase tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Processed
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKPICard
          title="Revenue"
          value="$128,400"
          trend="+12.5%"
          subtext="vs last mo."
          icon={<DollarSign size={16} />}
          color="blue"
        />
        <ReportKPICard
          title="Net Profit"
          value="$32,800"
          trend="+1.5%"
          subtext="vs last mo."
          icon={<Activity size={16} />}
          color="emerald"
        />
        <ReportKPICard
          title="Expense"
          value="$95,600"
          trend="1.2%"
          subtext="savings optimized"
          icon={<Wallet size={16} />}
          color="red"
          isDown
        />
        <ReportKPICard
          title="Cash Flow"
          value="$42,100"
          trend="Stable"
          subtext="Health index: 94"
          icon={<Briefcase size={16} />}
          color="emerald"
          noTrendIcon
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-[16px] flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp size={16} className="text-blue-600" />
              </div>
              Revenue Over Time
            </h3>
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button className="px-4 py-1 text-[11px] font-bold rounded-lg text-slate-400">Weekly</button>
              <button className="px-4 py-1 text-[11px] font-bold rounded-lg bg-blue-600 text-white shadow-md">Monthly</button>
            </div>
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

        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-[16px] flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <Wallet size={16} className="text-red-500" />
              </div>
              Expense Breakdown
            </h3>
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button className="px-4 py-1 text-[11px] font-bold rounded-lg text-slate-400">Weekly</button>
              <button className="px-4 py-1 text-[11px] font-bold rounded-lg bg-blue-600 text-white shadow-md">Monthly</button>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-[16px] font-bold text-slate-900">{value}</span>
    </div>
  );
}

function ReportKPICard({ title, value, trend, subtext, icon, color, isDown = false, noTrendIcon = false }: any) {
  const colorClasses: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-500',
  };

  const trendClasses: any = {
    blue: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    red: 'bg-red-50 text-red-500 border-red-100',
  };

  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-[14px] font-bold text-slate-500">{title}</span>
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-[26px] font-black text-slate-900 leading-none tracking-tight">{value}</h4>
        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border text-[10px] font-bold ${noTrendIcon ? 'bg-slate-50 text-slate-500 border-slate-100' : trendClasses[color]}`}>
          {!noTrendIcon && (isDown ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />)}
          {trend}
        </div>
      </div>
      <p className="text-[11px] text-slate-400 mt-2 font-medium">{subtext}</p>
    </div>
  );
}

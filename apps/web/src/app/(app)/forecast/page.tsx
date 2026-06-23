"use client";

import React, { useState, useEffect } from 'react';
import {
  Coins,
  Wallet,
  Clock,
  Landmark,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Target,
  Briefcase,
  LineChart,
  BarChart3,
  PieChart,
  Pin,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import KPICard from '@/components/common/KPICard';
import { useDispatch, useSelector } from '@/store';
import { fetchDashboardData } from '@/store/slices/dashboard';
import { usePersistentDate } from '@/hooks/usePersistentDate';
import {
  forecastChartData,
  scenarioData,
  ForecastChartItem
} from '@/data/forecastData';
import { revenueData as defaultRevenueData } from '@/data/reportsData';
import { healthData } from '@/data/dashboardData';
import {
  IndustryEnum,
  FORECAST_HEADER_CONFIGS,
  FORECAST_KPI_CONFIGS,
  FORECAST_EXPENSE_CONFIGS,
  FORECAST_COST_DETAILS_CONFIGS,
  FORECAST_AI_INSIGHTS_CONFIGS
} from '@/config/industryConfig';
import * as LucideIcons from 'lucide-react';

// Custom Gauge Components & Constants
const RADIAN = Math.PI / 180;
const NeedleLayer = ({ value, cx, cy, iR, oR }: any) => {
  const ang = 180.0 * (1 - value / 100);
  const length = oR + 15;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 8;
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
        <circle cx={x0} cy={y0} r={r + 4} fill="#1a2153" stroke="none" />
        <path d={`M${xba} ${yba}L${xbb} ${ybb}L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill="#1a2153" />
        <circle cx={x0} cy={y0} r={3} fill="#fff" stroke="none" />
      </g>
    </svg>
  );
};

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

const gaugeGradients = [
  { id: 'gradPoor', stops: [{ offset: '0%', color: '#ef4444' }, { offset: '100%', color: '#b91c1c' }] },
  { id: 'gradFair', stops: [{ offset: '0%', color: '#f59e0b' }, { offset: '100%', color: '#b45309' }] },
  { id: 'gradGood', stops: [{ offset: '0%', color: '#eab308' }, { offset: '100%', color: '#a16207' }] },
  { id: 'gradExcellent', stops: [{ offset: '0%', color: '#10b981' }, { offset: '100%', color: '#047857' }] },
];

const outerHealthData = [
  { name: 'POOR', value: 25, color: '#fee2e2' },
  { name: 'FAIR', value: 25, color: '#fef3c7' },
  { name: 'GOOD', value: 25, color: '#fef9c3' },
  { name: 'EXCELLENT', value: 25, color: '#dcfce7' },
];

export default function ForecastPage() {
  const dispatch = useDispatch();
  const { 
    rawSummary, 
    revenueData: reduxRevenueData, 
    healthScore, 
    auditCompliance, 
    equityHealth, 
    aiInsights: dashboardInsights, 
    forecastVsReality,
    costEfficiency
  } = useSelector((state: any) => state.dashboard);

  const { selectedMonth, selectedYear } = usePersistentDate();
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const savedCompanyId = localStorage.getItem('selectedCompany');
    if (savedCompanyId) {
      setCurrentCompanyId(savedCompanyId);
    }

    const interval = setInterval(() => {
      const saved = localStorage.getItem('selectedCompany');
      if (saved !== currentCompanyId) {
        setCurrentCompanyId(saved);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentCompanyId]);

  useEffect(() => {
    if (currentCompanyId) {
      dispatch(fetchDashboardData(currentCompanyId, selectedMonth, selectedYear));
    }
  }, [currentCompanyId, selectedMonth, selectedYear, dispatch]);

  const [timeframe, setTimeframe] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');

  // Interactive Simulator States
  const [growthRate, setGrowthRate] = useState<number>(15); // Baseline: 15%
  const [margin, setMargin] = useState<number>(28.4); // Baseline: 28.4%
  const [expenseBuffer, setExpenseBuffer] = useState<number>(0); // Baseline: 0%
  const [activeScenario, setActiveScenario] = useState<string>('Baseline');
  const [activeChart, setActiveChart] = useState('line');
  const [expenseTimeframe, setExpenseTimeframe] = React.useState<'Weekly' | 'Monthly'>('Monthly');

  // Simulated data state
  const [simulatedData, setSimulatedData] = useState<ForecastChartItem[]>([]);

  const [companyType, setCompanyType] = useState<string>(IndustryEnum.FLEET_MANAGEMENT);

  useEffect(() => {
    const savedType = localStorage.getItem('selectedCompanyType');
    if (savedType) {
      setCompanyType(savedType);
    }
    
    const interval = setInterval(() => {
      const saved = localStorage.getItem('selectedCompanyType');
      if (saved && saved !== companyType) {
        setCompanyType(saved);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [companyType]);

  useEffect(() => {
    if (rawSummary) {
      if (rawSummary.growthPercent !== undefined) {
        setGrowthRate(rawSummary.growthPercent);
      }
      if (rawSummary.revenue > 0) {
        setMargin((rawSummary.grossProfit / rawSummary.revenue) * 100);
      }
    }
  }, [rawSummary]);

  const activeHeader = FORECAST_HEADER_CONFIGS[companyType as IndustryEnum] || FORECAST_HEADER_CONFIGS[IndustryEnum.FLEET_MANAGEMENT];
  const currentKPIs = FORECAST_KPI_CONFIGS[companyType as IndustryEnum] || FORECAST_KPI_CONFIGS[IndustryEnum.FLEET_MANAGEMENT];

  const getIcon = (iconName: string) => {
    const IconComp = (LucideIcons as any)[iconName];
    if (IconComp) return <IconComp size={16} className="text-blue-500" />;
    return <LucideIcons.Activity size={16} className="text-blue-500" />;
  };

  useEffect(() => {
    const startingCash = rawSummary?.cashBalance || 0;
    const baseRevenue = rawSummary?.revenue || 0;
    const baseExpenses = rawSummary?.totalExpenses || 0;

    if (baseRevenue === 0 && baseExpenses === 0) {
      setSimulatedData([]);
      return;
    }

    let cashAccumulator = startingCash;

    // Generate 12 months projections dynamically
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const currentYear = new Date().getFullYear();
    const updated = months.map((monthName, index) => {
      const growthMultiplier = 1 + (growthRate - 15) / 100;
      const expenseMultiplier = 1 + (expenseBuffer) / 100;

      const monthlyFactor = 1 + (index * 0.05);
      const simRevenue = Math.round(baseRevenue * monthlyFactor * growthMultiplier);
      const simExpenses = Math.round(baseExpenses * (1 + index * 0.02) * expenseMultiplier);

      if (index === 0) {
        cashAccumulator = startingCash;
      } else {
        cashAccumulator = Math.max(0, cashAccumulator + (simRevenue - simExpenses));
      }

      return {
        month: `${monthName} ${currentYear + (index >= 3 ? 1 : 0)}`,
        revenue: simRevenue,
        expenses: simExpenses,
        cashReserve: cashAccumulator,
        optimisticRevenue: Math.round(simRevenue * 1.25),
        conservativeRevenue: Math.round(simRevenue * 0.85)
      };
    });

    setSimulatedData(updated);
  }, [growthRate, margin, expenseBuffer, rawSummary]);

  // Format financial currency label
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const dynamicExpenseData = React.useMemo(() => {
    const fixed = costEfficiency?.fixedCost?.value || 0;
    const variable = costEfficiency?.variableCost?.value || 0;
    const total = fixed + variable;
    if (total === 0) return [];
    
    return [
      { name: 'Fixed Costs', value: Math.round((fixed / total) * 100), color: '#6366f1' },
      { name: 'Variable Costs', value: Math.round((variable / total) * 100), color: '#f59e0b' }
    ];
  }, [costEfficiency]);

  const dynamicCostDetails = React.useMemo(() => {
    if (!costEfficiency || Object.keys(costEfficiency).length === 0) return [];
    
    return [
      {
        name: 'Fixed Costs',
        value: costEfficiency.fixedCost?.value ? formatCurrency(costEfficiency.fixedCost.value) : 'N/A',
        trend: costEfficiency.fixedCost?.trend || 'Stable',
        progress: 50,
        color: '#6366f1',
        dotColor: '#6366f1'
      },
      {
        name: 'Variable Costs',
        value: costEfficiency.variableCost?.value ? formatCurrency(costEfficiency.variableCost.value) : 'N/A',
        trend: costEfficiency.variableCost?.trend || 'Stable',
        progress: 70,
        color: '#f59e0b',
        dotColor: '#f59e0b'
      },
      {
        name: 'Total Expenses',
        value: costEfficiency.totalExpenses?.value ? formatCurrency(costEfficiency.totalExpenses.value) : 'N/A',
        trend: costEfficiency.totalExpenses?.trend || 'Stable',
        progress: 100,
        color: '#10b981',
        dotColor: '#10b981'
      }
    ];
  }, [costEfficiency]);

  const activeInsights = React.useMemo(() => {
    if (!dashboardInsights || dashboardInsights.length === 0) return [];
    
    const colors = [
      { color: '#2563eb', bgColor: '#dbeafe', textColor: '#2563eb' },
      { color: '#ef4444', bgColor: '#fee2e2', textColor: '#ef4444' },
      { color: '#10b981', bgColor: '#dcfce7', textColor: '#10b981' }
    ];
    
    return dashboardInsights.slice(0, 3).map((insight: any, idx: number) => {
      const colorStyle = colors[idx % colors.length];
      return {
        id: String(idx),
        title: insight.title || 'INSIGHT',
        percentage: insight.percentage || '',
        description: insight.description || '',
        ...colorStyle
      };
    });
  }, [dashboardInsights]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Premium Header Layout matching mockup */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] pt-[4px] pb-[4px]">
        <div className="space-y-1">
          <h1 className="text-[24px] font-semibold text-slate-800 font-inter leading-[32px] tracking-tight">{activeHeader.title}</h1>
          <p className="text-[14px] font-normal text-slate-400 font-inter leading-[20px]">
            {activeHeader.subtitle}
          </p>
        </div>

        {/* Timeframe pill selector as shown in the mockup design */}
        <div className="flex items-center p-[4px] bg-white border border-slate-200/80 rounded-[12px] shadow-sm shrink-0 gap-1">
          {(['Monthly', 'Quarterly', 'Yearly'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setTimeframe(option)}
              className={`py-[8px] px-[16px] text-[13px] font-medium rounded-[8px] transition-all duration-300 ${timeframe === option
                ? 'bg-[#2563eb] text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid exactly as shown in the mockup */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentKPIs.map((metric, i) => {
          let valueStr = '';
          if (metric.key === 'opMargin') {
            valueStr = rawSummary?.revenue > 0 ? `${margin.toFixed(1)}%` : 'N/A';
          } else if (metric.key === 'burnRate') {
            valueStr = rawSummary?.totalExpenses ? formatCurrency(rawSummary.totalExpenses) : 'N/A';
          } else if (metric.key === 'runway') {
            valueStr = rawSummary?.cashRunway ? `${rawSummary.cashRunway} months` : 'N/A';
          } else if (metric.key === 'cashInBank') {
            valueStr = rawSummary?.cashBalance ? formatCurrency(rawSummary.cashBalance) : 'N/A';
          }

          return (
            <KPICard
              key={i}
              icon={getIcon(metric.icon)}
              label={metric.label}
              value={valueStr}
              unit={metric.unit}
              trend={rawSummary ? metric.trend : ''}
              isDown={metric.isDown}
              progress={metric.key === 'opMargin' && rawSummary?.revenue > 0 ? margin : undefined}
              sub={rawSummary ? metric.sub : ''}
            />
          );
        })}
      </div>

      {/* Interactive Forecast Scenario Simulator & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">


        <div className="lg:col-span-2 w-full h-[490px] bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
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

          {/* Chart Body - 412px */}
          <div className="h-[412px] flex-1 w-full relative py-[12px] px-[16px] flex flex-col gap-[12px]">
            <div className="flex-1 w-full relative rounded-[10px] border border-[rgba(26,21,83,0.08)] bg-slate-50/30 flex flex-col overflow-hidden">
              <div className="flex-1 w-full relative p-2 flex items-center justify-center">
                {reduxRevenueData && reduxRevenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reduxRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
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
                ) : (
                  <div className="text-slate-400 text-[13px] font-inter">
                    No historical revenue data available
                  </div>
                )}
              </div>

              {/* Chart Legend - Styled inside the inner box */}
              {reduxRevenueData && reduxRevenueData.length > 0 && (
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
              )}
            </div>
          </div>
        </div>


        {/* Right Widgets Column */}
        <div className="space-y-4">
          {/* Company Health Meter */}

          <div className="h-[330px] bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
            {/* Header - 54px */}
            <div className="h-[54px] flex items-center p-[12px] gap-[12px] border-b border-slate-50">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Pin size={16} />
              </div>
              <h3 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">Company Health Meter</h3>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col">
              <div className="relative h-[180px] w-full flex items-center justify-center">
                <div className="w-[260px] h-[180px] relative mx-auto">
                  {/* Compact Gauge Chart with ZERO Gaps */}
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <defs>
                        {gaugeGradients.map((grad: any) => (
                          <linearGradient key={grad.id} id={grad.id} x1="0" y1="0" x2="0" y2="1">
                            {grad.stops.map((stop: any, i: number) => (
                              <stop key={i} offset={stop.offset} stopColor={stop.color} />
                            ))}
                          </linearGradient>
                        ))}
                      </defs>
                      {/* Outer Arc - Touching the inner arc (No Gap) */}
                      <Pie
                        data={outerHealthData}
                        cx={130}
                        cy={140}
                        startAngle={180}
                        endAngle={0}
                        innerRadius={85}
                        outerRadius={115}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                        labelLine={false}
                        label={renderOuterLabel}
                      >
                        {outerHealthData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      {/* Compact Inner Arc - Still 60px Thick (40 to 100) */}
                      <Pie
                        data={healthData}
                        cx={130}
                        cy={140}
                        startAngle={180}
                        endAngle={0}
                        innerRadius={30}
                        outerRadius={85}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                      >
                        {healthData.map((entry: any, index: number) => {
                          const gradientIds = ['gradPoor', 'gradFair', 'gradGood', 'gradExcellent'];
                          return <Cell key={`cell-${index}`} fill={`url(#${gradientIds[index]})`} />;
                        })}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>

                  {/* Independent Needle Layer */}
                  <NeedleLayer value={healthScore || 0} cx={130} cy={140} iR={30} oR={85} />
                </div>
              </div>

              <div className="text-center mt-[-10px] mb-2">
                <p className="text-[11px] font-normal text-slate-600 mb-0.5 font-inter leading-none tracking-[0%]">Today Health</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[9px] font-normal text-slate-400 uppercase tracking-[0%] font-inter leading-none text-center">
                    {healthScore >= 80 ? 'EXCELLENT' : healthScore >= 60 ? 'GOOD' : healthScore >= 40 ? 'FAIR' : 'POOR'}
                  </span>
                  <span className="text-[14px] font-semibold text-slate-900 font-inter leading-none tracking-[0%]">{healthScore || 0}</span>
                </div>
              </div>

              {/* Health Metrics Details */}
              <div className="px-5 space-y-3 border-t border-slate-50 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-normal text-slate-700 font-inter leading-none">Audit Compliance</span>
                  <span className="text-[12px] font-semibold text-slate-900 font-inter leading-none">{auditCompliance ? `${auditCompliance}%` : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-normal text-slate-700 font-inter leading-none">Equity Health</span>
                  <span className="text-[12px] font-semibold text-slate-900 font-inter leading-none">{equityHealth ? `${equityHealth}%` : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>


          {/* Forecast vs Reality - Blue Card */}
          <div className="  bg-[#1d4ed8]  p-[12px] rounded-[24px] text-white shadow-lg flex flex-col gap-3 relative overflow-hidden group cursor-pointer transition-all">
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-[16px] font-normal text-white font-inter leading-[24px] tracking-[0%]">Forecast vs Reality</h3>
              <Target size={20} className="text-white/40" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between text-[11px] font-medium text-white/70">
                <span>Market Penetration Goal</span>
                <span>{forecastVsReality?.percentageAchieved ?? 0}% achieved</span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${forecastVsReality?.percentageAchieved ?? 0}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-between  relative z-10">
              <div>
                <p className="text-[12px] text-white/60 font-normal font-inter uppercase leading-[16px] tracking-[0%] align-middle mb-1">Current Progress</p>
                <h4 className="text-[20px] font-medium text-white font-inter leading-[28px] tracking-[0%] align-middle">
                  Achieved {forecastVsReality?.currentValue ?? 0}% of {forecastVsReality?.targetValue ?? 0}% target
                </h4>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Expense Breakdown Chart */}
        <div className="lg:col-span-1 bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="h-[54px] flex items-center justify-between p-[12px] border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <PieChart size={16} />
              </div>
              <h3 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Expense Breakdown</h3>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setExpenseTimeframe('Weekly')}
                className={`w-[72px] h-[30px] px-[12px] py-[5px] flex items-center justify-center gap-[6px] rounded-[8px] text-[12px] font-medium transition-all duration-200 ${expenseTimeframe === 'Weekly'
                  ? 'bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)]'
                  : 'bg-white border border-[#e2e8f0] text-slate-500 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:text-slate-700'}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setExpenseTimeframe('Monthly')}
                className={`w-[72px] h-[30px] px-[12px] py-[5px] flex items-center justify-center gap-[6px] rounded-[8px] text-[12px] font-medium transition-all duration-200 ${expenseTimeframe === 'Monthly'
                  ? 'bg-[#2563eb] text-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)]'
                  : 'bg-white border border-[#e2e8f0] text-slate-500 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] hover:text-slate-700'}`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="p-6 flex flex-col items-center justify-center h-[340px]">
            {dynamicExpenseData.length > 0 ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height={240}>
                  <RePieChart>
                    <Pie
                      data={dynamicExpenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {dynamicExpenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-10px]">
                  <span className="text-[12px] text-slate-400 font-medium font-inter">Total</span>
                  <span className="text-[20px] font-bold text-slate-800 font-inter leading-none">
                    {formatCurrency(costEfficiency?.totalExpenses?.value || 0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center text-slate-400 text-[13px] font-inter h-[240px]">
                No expense breakdown data available
              </div>
            )}

            {/* Custom Legend */}
            {dynamicExpenseData.length > 0 && (
              <div className="grid grid-cols-2 gap-x-2 gap-y-3  w-full ">
                {dynamicExpenseData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[13px] font-medium text-[#0a092e] font-inter leading-[20px] tracking-[0%]">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cost Details Companion Card */}
        <div className="lg:col-span-1 bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="h-[54px] flex items-center p-[12px] border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Pin size={16} className="-rotate-45" />
              </div>
              <h3 className="text-[16px] font-normal text-[#0f172a] font-inter leading-[24px] tracking-[0%]">Cost Details</h3>
            </div>
          </div>

          <div className="p-6 flex flex-col justify-center flex-grow space-y-6">
            {dynamicCostDetails.length > 0 ? (
              dynamicCostDetails.map((item: any, idx: number) => (
                <div key={idx} className="space-y-2 pb-4 last:pb-0 border-b last:border-0 border-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.dotColor }} />
                      <span className="text-[14px] font-normal text-[#0a092e] font-inter">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] font-bold text-slate-800 font-inter">{item.value}</span>
                      {item.trend && item.trend !== 'Stable' && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[4px] bg-[#f0fdf4] border border-[#dcfce7] text-[#22c55e] text-[11px] font-semibold font-inter">
                          <ArrowUpRight size={10} className="stroke-[3px]" />
                          {item.trend}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-[10px] bg-[#eff6ff] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.progress}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center text-slate-400 text-[13px] font-inter h-[200px]">
                No cost details available
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-auto md:h-[174px] bg-white rounded-[12px] border border-slate-100 shadow-sm overflow-hidden pb-4 md:pb-0">
        {/* Header */}
        <div className="h-[54px] flex items-center p-[12px] gap-[12px] border-b border-slate-50">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
            <Pin size={16} />
          </div>
          <h3 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">AI Insights</h3>
        </div>

        {/* Insights Grid */}
        <div className="p-[16px] flex items-center justify-center min-h-[100px] w-full">
          {activeInsights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
              {activeInsights.map((item: any) => (
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
                      {item.title} {item.percentage && <span className="ml-1 opacity-70">{item.percentage}</span>}
                    </div>

                    {/* Insight Text */}
                    <p className="text-[14px] text-slate-600 font-inter font-normal leading-[20px] tracking-[0%] align-middle">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center text-slate-400 text-[13px] font-inter py-4">
              No AI Insights available yet. Upload documents to get started.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

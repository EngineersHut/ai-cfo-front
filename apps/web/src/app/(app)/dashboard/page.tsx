"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
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
  Pin,
  DollarSign,
  ChevronDown,
} from "lucide-react";
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
  Pie,
} from "recharts";
import { useDashboardSettings } from "@/context/DashboardContext";
import { healthData } from "@/data/dashboardData";
import AIInsights from "./components/AIInsights";
import CostEfficiencyAnalysis from "./components/Cost-Efficiency-Analysis";
import { KPICardProps } from "@/types/dashboard";
import KPICard from "@/components/common/KPICard";
import { useDispatch, useSelector } from "@/store";
import { fetchDashboardData } from "@/store/slices/dashboard";
import { useEffect } from "react";
import { usePersistentDate } from "@/hooks/usePersistentDate";
import {
  DASHBOARD_KPI_CONFIGS,
  DASHBOARD_HEADER_CONFIGS,
  IndustryEnum,
} from "@/config/industryConfig";
import * as LucideIcons from "lucide-react";

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
        <path
          d={`M${xba} ${yba}L${xbb} ${ybb}L${xp} ${yp} L${xba} ${yba}`}
          stroke="none"
          fill="#1a2153"
        />
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
      style={{
        transform: `rotate(${90 - midAngle}deg)`,
        transformOrigin: `${x}px ${y}px`,
      }}
    >
      {name}
    </text>
  );
};

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const YEARS = [2024, 2025, 2026];

export default function ReportPage() {
  const { visibility } = useDashboardSettings();
  const {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    selectedPeriod,
    setSelectedPeriod,
  } = usePersistentDate();
  const [activeChart, setActiveChart] = useState("line");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dispatch = useDispatch();
  const {
    kpiStats,
    rawSummary,
    revenueData: reduxRevenueData,
    healthScore,
    auditCompliance,
    equityHealth,
    cfoInsights,
    forecastVsReality,
  } = useSelector((state) => state.dashboard);

  const chartData = useMemo(() => {
    return (reduxRevenueData || []).map((item: any) => {
      let name = item.name;
      if (!name && item.date) {
        try {
          const d = new Date(item.date);
          name = d.toLocaleDateString("en-US", { month: "short" });
        } catch (e) {
          name = item.date;
        }
      }
      return {
        name: name || "Month",
        revenue: item.revenue || 0,
        profit: item.profit || item.netProfit || item.revenue * 0.4,
      };
    });
  }, [reduxRevenueData]);

  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
  const [companyType, setCompanyType] = useState<string>(
    IndustryEnum.TRANSPORTATION_AND_LOGISTICS,
  );

  const formatChartValue = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)}k`;
    return String(value);
  };

  useEffect(() => {
    const savedCompanyId = localStorage.getItem("selectedCompany");
    if (savedCompanyId) {
      setCurrentCompanyId(savedCompanyId);
    }

    const interval = setInterval(() => {
      const saved = localStorage.getItem("selectedCompany");
      if (saved !== currentCompanyId) {
        setCurrentCompanyId(saved);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentCompanyId]);

  useEffect(() => {
    const savedType = localStorage.getItem("selectedCompanyType");
    if (savedType) {
      setCompanyType(savedType);
    }

    const interval = setInterval(() => {
      const saved = localStorage.getItem("selectedCompanyType");
      if (saved && saved !== companyType) {
        setCompanyType(saved);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [companyType]);

  useEffect(() => {
    if (currentCompanyId) {
      dispatch(
        fetchDashboardData(
          currentCompanyId,
          selectedMonth,
          selectedYear,
          selectedPeriod,
        ),
      );
    }
  }, [currentCompanyId, selectedMonth, selectedYear, selectedPeriod, dispatch]);

  const currentKPIs =
    DASHBOARD_KPI_CONFIGS[companyType as IndustryEnum] ??
    DASHBOARD_KPI_CONFIGS[IndustryEnum.TRANSPORTATION_AND_LOGISTICS] ??
    [];
  const currentHeader = DASHBOARD_HEADER_CONFIGS[companyType as IndustryEnum] ??
    DASHBOARD_HEADER_CONFIGS[IndustryEnum.TRANSPORTATION_AND_LOGISTICS] ?? {
      title: "Dashboard",
      subtitle: "",
    };

  const getIcon = (iconName: string) => {
    const IconComp = (LucideIcons as any)[iconName];
    if (IconComp) return <IconComp size={14} />;
    return <LucideIcons.Activity size={14} />;
  };

  const formatValue = (val: any, format: string) => {
    if (val === undefined || val === null) return "N/A";
    if (typeof val === "object" && val.value !== undefined) {
      return val.value;
    }
    const num = Number(val);
    if (isNaN(num)) return String(val);

    if (format === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    }
    if (format === "percent") {
      return `${num.toFixed(1)}%`;
    }
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getKpiValue = (kpiKey: string, format: string) => {
    let rawVal = rawSummary?.[kpiKey];
    if (rawVal === undefined) {
      if (kpiKey === "totalTrips") rawVal = rawSummary?.totalDeliveries;
      else if (kpiKey === "delPerVeh")
        rawVal = rawSummary?.deliveriesPerVehicle;
      else if (kpiKey === "fleetUtil") rawVal = rawSummary?.fleetUtilization;
      else if (kpiKey === "driverEff") rawVal = rawSummary?.driverEfficiency;
      else if (kpiKey === "cashRunway") rawVal = rawSummary?.cashRunway;
      else if (kpiKey === "growth") rawVal = rawSummary?.growthPercent;
      else if (kpiKey === "ebitda") rawVal = rawSummary?.ebitda;
      else if (kpiKey === "cashflow") rawVal = rawSummary?.operatingCashFlow;
    }

    if (
      rawVal !== undefined &&
      typeof rawVal === "object" &&
      rawVal.value !== undefined
    ) {
      rawVal = rawVal.value;
    }

    if (rawVal !== undefined) {
      let formatted = formatValue(rawVal, format);
      if (kpiKey === "cashRunway" && !formatted.includes("month")) {
        formatted = `${formatted} months`;
      }
      if (kpiKey === "driverEff" && !formatted.includes("%")) {
        formatted = `${formatted}%`;
      }
      return formatted;
    }

    const legacyStats = (kpiStats as any)[kpiKey];
    if (legacyStats?.value !== undefined) {
      return legacyStats.value;
    }

    return "N/A";
  };

  const getTrendValue = (kpiKey: string) => {
    let rawVal = rawSummary?.[kpiKey];
    if (rawVal === undefined) {
      if (kpiKey === "totalTrips") rawVal = rawSummary?.totalDeliveries;
      else if (kpiKey === "delPerVeh")
        rawVal = rawSummary?.deliveriesPerVehicle;
      else if (kpiKey === "fleetUtil") rawVal = rawSummary?.fleetUtilization;
      else if (kpiKey === "driverEff") rawVal = rawSummary?.driverEfficiency;
      else if (kpiKey === "cashRunway") rawVal = rawSummary?.cashRunway;
      else if (kpiKey === "growth") rawVal = rawSummary?.growthPercent;
      else if (kpiKey === "ebitda") rawVal = rawSummary?.ebitda;
      else if (kpiKey === "cashflow") rawVal = rawSummary?.operatingCashFlow;
    }

    if (rawVal && typeof rawVal === "object" && rawVal.trend !== undefined) {
      return rawVal.trend;
    }

    if (
      (kpiKey === "totalTrips" || kpiKey === "growth") &&
      rawSummary?.growthPercent !== undefined
    ) {
      const growthVal = rawSummary.growthPercent;
      const val = typeof growthVal === "object" ? growthVal.value : growthVal;
      if (val !== undefined) {
        return `${Number(val) >= 0 ? "+" : ""}${val}%`;
      }
    }
    return undefined;
  };

  const getSubValue = (kpiKey: string, defaultSub: string) => {
    const summaryVal = rawSummary?.[kpiKey];
    if (
      summaryVal &&
      typeof summaryVal === "object" &&
      summaryVal.sub !== undefined
    ) {
      return summaryVal.sub;
    }
    const legacyStats = (kpiStats as any)[kpiKey];
    if (legacyStats?.sub !== undefined) {
      return legacyStats.sub;
    }
    return defaultSub;
  };

  const isDownTrend = (kpiKey: string, isDownPositive?: boolean) => {
    const trend = getTrendValue(kpiKey);
    if (!trend) return false;
    const hasMinus = trend.includes("-");
    if (isDownPositive) {
      return !hasMinus && trend !== "Stable" && trend !== "0%";
    }
    return hasMinus;
  };

  const getHealthClassification = (score: number) => {
    if (score <= 25) return "POOR";
    if (score <= 50) return "FAIR";
    if (score <= 75) return "GOOD";
    return "EXCELLENT";
  };

  // Vibrant Gradient definitions
  const gaugeGradients = [
    {
      id: "gradPoor",
      stops: [
        { offset: "32.29%", color: "#FF0508" },
        { offset: "33.05%", color: "#FF0C0B" },
        { offset: "37.63%", color: "#FF2F1A" },
        { offset: "41.92%", color: "#FF4924" },
        { offset: "45.79%", color: "#FF592B" },
        { offset: "48.86%", color: "#FF5E2D" },
      ],
    },
    {
      id: "gradFair",
      stops: [
        { offset: "0%", color: "#ffb74d" },
        { offset: "100%", color: "#f57c00" },
      ],
    },
    {
      id: "gradGood",
      stops: [
        { offset: "0%", color: "#fff176" },
        { offset: "100%", color: "#fbc02d" },
      ],
    },
    {
      id: "gradExcellent",
      stops: [
        { offset: "0%", color: "#69f0ae" },
        { offset: "100%", color: "#2e7d32" },
      ],
    },
  ];

  // Data for the outer arc (Soft tints)
  const outerHealthData = [
    { name: "POOR", value: 25, color: "#ffebee" },
    { name: "FAIR", value: 25, color: "#fff3e0" },
    { name: "GOOD", value: 25, color: "#fffde7" },
    { name: "EXCELLENT", value: 25, color: "#e8f5e9" },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="w-full h-auto flex flex-col sm:flex-row sm:items-center justify-between gap-[10px] pt-[4px] pb-[4px]">
        <div className="space-y-1">
          <h1 className="text-[24px] font-medium text-slate-800 dark:text-white font-inter leading-[32px] tracking-[0%]">
            {currentHeader.title}
          </h1>
          <p className="text-[14px] font-normal text-slate-400 font-inter leading-[20px] tracking-[0%]">
            {currentHeader.subtitle}
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
          {/* Period Selection Tabs Container */}
          <div className="flex bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 rounded-[10px] p-1 h-[45px] items-center gap-1 shadow-sm font-inter">
            <button
              onClick={() => setSelectedPeriod("monthly")}
              className={`h-full px-4 rounded-[8px] text-[13px] font-semibold transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center ${
                selectedPeriod === "monthly"
                  ? "bg-[#2563eb] text-[#f8fafc] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)]"
                  : "text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPeriod("quarterly")}
              className={`h-full px-4 rounded-[8px] text-[13px] font-semibold transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center ${
                selectedPeriod === "quarterly"
                  ? "bg-[#2563eb] text-[#f8fafc] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)]"
                  : "text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
              }`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setSelectedPeriod("yearly")}
              className={`h-full px-4 rounded-[8px] text-[13px] font-semibold transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center ${
                selectedPeriod === "yearly"
                  ? "bg-[#2563eb] text-[#f8fafc] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),inset_-2px_-2px_6px_0px_rgba(255,255,255,0.4)]"
                  : "text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
              }`}
            >
              Yearly
            </button>
          </div>

          {/* Month & Year Selectors (Only for Monthly, rendered below) */}
          {selectedPeriod === "monthly" && (
            <div className="flex items-center gap-2">
              {/* Month Dropdown */}
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="h-[38px] pl-[10px] pr-[36px] py-[8px] bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 rounded-[8px] text-[14px] font-normal text-[#0f172a] dark:text-slate-200 shadow-sm hover:border-[#cbd5e1] dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 cursor-pointer appearance-none transition-all duration-200 min-w-[130px] font-inter"
                >
                  {MONTHS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={14} className="stroke-[2.5]" />
                </div>
              </div>

              {/* Year Dropdown */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="h-[38px] pl-[10px] pr-[36px] py-[8px] bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 rounded-[8px] text-[14px] font-normal text-[#0f172a] dark:text-slate-200 shadow-sm hover:border-[#cbd5e1] dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 cursor-pointer appearance-none transition-all duration-200 min-w-[100px] font-inter"
                >
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={14} className="stroke-[2.5]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {currentKPIs.map((kpi) => {
          // Check visibility of the card
          const visibilityKey =
            kpi.key === "totalTrips"
              ? "total-trips"
              : kpi.key === "delPerVeh"
                ? "del-per-veh"
                : kpi.key === "fleetUtil"
                  ? "fleet-util"
                  : kpi.key === "driverEff"
                    ? "driver-eff"
                    : kpi.key === "cashRunway"
                      ? "runway"
                      : kpi.key === "growth"
                        ? "growth"
                        : kpi.key === "ebitda"
                          ? "ebitda"
                          : kpi.key === "cashflow"
                            ? "cashflow"
                            : kpi.key;

          const isVisible = visibility[visibilityKey] ?? true;
          if (!isVisible) return null;

          return (
            <KPICard
              key={kpi.key}
              icon={getIcon(kpi.icon)}
              label={kpi.label}
              value={getKpiValue(kpi.key, kpi.format)}
              trend={getTrendValue(kpi.key)}
              sub={getSubValue(kpi.key, kpi.sub)}
              isDown={isDownTrend(kpi.key, kpi.isDownPositive)}
              noTrendIcon={getTrendValue(kpi.key) === "Stable"}
              showTrend={!!getTrendValue(kpi.key)}
            />
          );
        })}
      </div>

      {/* Charts & Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Over Time Chart (Span 2) */}
        {visibility["rev-time"] && (
          <div className="lg:col-span-2 w-full h-[490px] bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
            {/* Chart Header - 68px */}
            <div className="h-[68px] flex items-center justify-between p-[12px] gap-[12px] border-b border-slate-50 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300">
                  <Briefcase size={16} />
                </div>
                <h3 className="text-[16px] font-normal text-slate-800 dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">
                  Revenue Over Time
                </h3>
              </div>
              <div className="flex items-center gap-[6px]">
                {/* <button
                  onClick={() => setActiveChart("line")}
                  className={`w-[44px] h-[44px] flex items-center justify-center p-[4px_12px] rounded-[8px] border transition-all duration-200 ${
                    activeChart === "line"
                      ? "bg-[#2563eb] text-white border-[#2563eb] shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <LineChart size={18} />
                </button>
                 <button
                  onClick={() => setActiveChart("bar")}
                  className={`w-[44px] h-[44px] flex items-center justify-center p-[4px_12px] rounded-[8px] border transition-all duration-200 ${
                    activeChart === "bar"
                      ? "bg-[#2563eb] text-white border-[#2563eb] shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <BarChart3 size={18} />
                </button>
                <button
                  onClick={() => setActiveChart("pie")}
                  className={`w-[44px] h-[44px] flex items-center justify-center p-[4px_12px] rounded-[8px] border transition-all duration-200 ${
                    activeChart === "pie"
                      ? "bg-[#2563eb] text-white border-[#2563eb] shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <PieChart size={18} />
                </button> */}
              </div>
            </div>

            {/* Chart Body - 412px */}
            <div className="h-[412px] flex-1 w-full relative py-[12px] px-[16px] flex flex-col gap-[12px]">
              <div className="flex-1 w-full relative rounded-[10px] border border-[rgba(26,21,83,0.08)] dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/50 flex flex-col overflow-hidden">
                <div className="flex-1 w-full relative min-h-0 min-w-0">
                  {isMounted && (
                    <div className="absolute inset-2 min-h-0 min-w-0">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                        minWidth={0}
                        minHeight={0}
                      >
                        <AreaChart
                          data={chartData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorRevenue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#8b5cf6"
                                stopOpacity={0.1}
                              />
                              <stop
                                offset="95%"
                                stopColor="#8b5cf6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorProfit"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#fbbf24"
                                stopOpacity={0.1}
                              />
                              <stop
                                offset="95%"
                                stopColor="#fbbf24"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                            tickFormatter={formatChartValue}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "12px",
                              border: "none",
                              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                            }}
                            itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                            formatter={(value: any) => [
                              new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(Number(value)),
                              undefined,
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            activeDot={{
                              r: 6,
                              fill: "#fff",
                              stroke: "#8b5cf6",
                              strokeWidth: 3,
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="profit"
                            stroke="#fbbf24"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorProfit)"
                            activeDot={{
                              r: 6,
                              fill: "#fff",
                              stroke: "#fbbf24",
                              strokeWidth: 3,
                            }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Chart Legend - Styled inside the inner box */}
                <div className="flex items-center justify-center gap-8 py-3 bg-white dark:bg-slate-800 border-t border-[rgba(26,21,83,0.08)] dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
                    <span className="text-[14px] font-normal text-slate-500 dark:text-slate-400 font-inter leading-[132%] capitalize tracking-[0%]">
                      Revenue
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                    <span className="text-[14px] font-normal text-slate-500 dark:text-slate-400 font-inter leading-[132%] capitalize tracking-[0%]">
                      Net Profit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Widgets Column */}
        <div className="space-y-4">
          {/* Company Health Meter */}
          {visibility["health"] && (
            <div className="h-[330px] bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
              {/* Header - 54px */}
              <div className="h-[54px] flex items-center p-[12px] gap-[12px] border-b border-slate-50 dark:border-slate-700">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300">
                  <Pin size={16} />
                </div>
                <h3 className="text-[16px] font-normal text-slate-800 dark:text-slate-100 font-inter leading-[24px] tracking-[0%]">
                  Company Health Meter
                </h3>
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col">
                <div className="relative h-[180px] w-full flex items-center justify-center min-h-0 min-w-0">
                  <div className="w-[260px] h-[180px] relative mx-auto min-h-0 min-w-0">
                    {/* Compact Gauge Chart with ZERO Gaps */}
                    {isMounted && (
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                        minWidth={0}
                        minHeight={0}
                      >
                        <RePieChart>
                          <defs>
                            {gaugeGradients.map((grad) => (
                              <linearGradient
                                key={grad.id}
                                id={grad.id}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                {grad.stops.map((stop, i) => (
                                  <stop
                                    key={i}
                                    offset={stop.offset}
                                    stopColor={stop.color}
                                  />
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
                            {outerHealthData.map((entry, index) => (
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
                            {healthData.map((entry, index) => {
                              const gradientIds = [
                                "gradPoor",
                                "gradFair",
                                "gradGood",
                                "gradExcellent",
                              ];
                              return (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={`url(#${gradientIds[index]})`}
                                />
                              );
                            })}
                          </Pie>
                        </RePieChart>
                      </ResponsiveContainer>
                    )}
                    {/* Independent Needle Layer */}
                    <NeedleLayer
                      value={healthScore}
                      cx={130}
                      cy={140}
                      iR={30}
                      oR={85}
                    />
                  </div>
                </div>

                <div className="text-center mt-[-10px] mb-2">
                  <p className="text-[11px] font-normal text-slate-600 dark:text-slate-400 mb-0.5 font-inter leading-none tracking-[0%]">
                    Today Health
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500 uppercase tracking-[0%] font-inter leading-none text-center">
                      {getHealthClassification(healthScore)}
                    </span>
                    <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 font-inter leading-none tracking-[0%]">
                      {healthScore}
                    </span>
                  </div>
                </div>

                {/* Health Metrics Details */}
                <div className="px-5 space-y-3 border-t border-slate-50 dark:border-slate-700 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-normal text-slate-700 dark:text-slate-300 font-inter leading-none">
                      Audit Compliance (40%)
                    </span>
                    <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-100 font-inter leading-none">
                      {auditCompliance}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-normal text-slate-700 dark:text-slate-300 font-inter leading-none">
                      Equity Health
                    </span>
                    <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-100 font-inter leading-none">
                      {equityHealth}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Forecast vs Reality - Blue Card */}
          <div className="  bg-[#1e40af] p-[12px] rounded-[24px] text-white shadow-lg flex flex-col gap-3 relative overflow-hidden group cursor-pointer hover:bg-[#1d4ed8] transition-all">
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-[16px] font-normal text-white font-inter leading-[24px] tracking-[0%]">
                Forecast vs Reality
              </h3>
              <Target size={20} className="text-white/40" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between text-[11px] font-medium text-white/70">
                <span>Market Penetration Goal</span>
                <span>
                  {forecastVsReality?.percentageAchieved ?? 0}% achieved
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{
                    width: `${forecastVsReality?.percentageAchieved ?? 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between  relative z-10">
              <div>
                <p className="text-[12px] text-white/60 font-normal font-inter uppercase leading-[16px] tracking-[0%] align-middle mb-1">
                  Current Progress
                </p>
                <h4 className="text-[20px] font-medium text-white font-inter leading-[28px] tracking-[0%] align-middle">
                  Achieved {forecastVsReality?.currentValue ?? 0}% of{" "}
                  {forecastVsReality?.targetValue ?? 0}% target
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

      {/* AI Insights Row */}
      {visibility["aiInsights"] !== false && (
        <div className="">
          <AIInsights />
        </div>
      )}

      {/* Cost & Efficiency Analysis Row */}

      <div className="pb-12">
        <CostEfficiencyAnalysis />
      </div>
    </div>
  );
}

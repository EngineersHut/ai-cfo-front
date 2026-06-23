"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '@/store';
import {
    PieChart as PieChartIcon,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    SquarePen,
    Plus,
    ChevronDown
} from 'lucide-react';

import KPICard from '@/components/common/KPICard';
import {
    budgetMetrics,
    budgetSummaryData as defaultBudgetSummaryData,
} from '@/data/budgetData';
import { IndustryEnum, BUDGET_KPI_CONFIGS, BUDGET_HEADER_CONFIGS, BUDGET_TABLE_CONFIGS } from '@/config/industryConfig';
import * as LucideIcons from 'lucide-react';
import { fetchBudgetData, setTimeframe } from '@/store/slices/budget';
import { usePersistentDate } from '@/hooks/usePersistentDate';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

const YEARS = [2024, 2025, 2026];

export default function BudgetVsActual() {
    const { selectedMonth, setSelectedMonth, selectedYear, setSelectedYear } = usePersistentDate();
    const dispatch = useDispatch();
    const { data } = useSelector((state: any) => state.budget);

    const [companyType, setCompanyType] = useState<string>(IndustryEnum.FLEET_MANAGEMENT);
    const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);

    useEffect(() => {
        const savedType = localStorage.getItem('selectedCompanyType');
        if (savedType) {
            setCompanyType(savedType);
        }
    }, []);

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
            dispatch(fetchBudgetData(selectedMonth, selectedYear));
        }
    }, [currentCompanyId, selectedMonth, selectedYear, dispatch]);

    const activeHeader = BUDGET_HEADER_CONFIGS[companyType as IndustryEnum] || BUDGET_HEADER_CONFIGS[IndustryEnum.FLEET_MANAGEMENT];
    const currentKPIs = BUDGET_KPI_CONFIGS[companyType as IndustryEnum] || BUDGET_KPI_CONFIGS[IndustryEnum.FLEET_MANAGEMENT];

    const getTableLabel = (label: string) => {
        const industryLabels = BUDGET_TABLE_CONFIGS[companyType as IndustryEnum] || BUDGET_TABLE_CONFIGS[IndustryEnum.FLEET_MANAGEMENT];
        return industryLabels?.[label] || label;
    };

    const getIcon = (iconName: string) => {
        const IconComp = (LucideIcons as any)[iconName];
        if (IconComp) return <IconComp size={18} />;
        return <LucideIcons.Activity size={18} />;
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    const getKpiValue = (key: string, format: string) => {
        const cards = data?.summaryCards;
        if (!cards) {
            return 'N/A';
        }

        if (key === 'budgetRevenue') {
            return formatCurrency(cards.budgetRevenue);
        }
        if (key === 'actualRevenue') {
            return formatCurrency(cards.actualRevenue);
        }
        if (key === 'revenueVariance') {
            const percent = cards.revenueVariance?.percent ?? 0;
            return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
        }
        if (key === 'overBudgetItems') {
            return formatCurrency(cards.overBudgetItems);
        }
        return '$0';
    };

    const getIsDown = (key: string) => {
        const cards = data?.summaryCards;
        if (!cards) {
            return false;
        }
        if (key === 'revenueVariance') {
            return !(cards.revenueVariance?.isFavorable);
        }
        return false;
    };

    const getKpiSub = (key: string, defaultSub: string) => {
        const cards = data?.summaryCards;
        if (!cards) return '';

        if (key === 'revenueVariance') {
            const absolute = cards.revenueVariance?.absolute ?? 0;
            return `${formatCurrency(absolute)} vs plan`;
        }
        if (key === 'overBudgetItems') {
            return cards.overBudgetItems === 0 ? 'All items within budget' : `${cards.overBudgetItems} items over budget`;
        }
        return defaultSub;
    };

    const getKpiTrend = (key: string, defaultTrend: string) => {
        const cards = data?.summaryCards;
        if (!cards) return '';

        if (key === 'revenueVariance') {
            return cards.revenueVariance?.isFavorable ? 'Favorable' : 'Unfavorable';
        }
        if (key === 'overBudgetItems') {
            return cards.overBudgetItems === 0 ? 'On Track' : 'Needs Review';
        }
        return defaultTrend;
    };

    const activeSummaryData = React.useMemo(() => {
        if (!data?.summaryTable) {
            return [
                { metric: 'Revenue', budget: 0, actual: 0, variance: 0, notes: 'No data' },
                { metric: 'Direct Costs', budget: 0, actual: 0, variance: 0, notes: 'No data' },
                { metric: 'Operating Expenses', budget: 0, actual: 0, variance: 0, notes: 'No data' },
                { metric: 'Gross Profit', budget: 0, actual: 0, variance: 0, notes: 'No data', isAutoComputed: true },
                { metric: 'Net Margin', budget: 0, actual: 0, variance: 0, notes: 'No data', isAutoComputed: true, isPercentage: true }
            ];
        }

        return [
            {
                metric: 'Revenue',
                budget: data.summaryTable.revenue.budget,
                actual: data.summaryTable.revenue.actual,
                variance: data.summaryTable.revenue.variancePercent,
                notes: data.summaryTable.revenue.notes || 'Total Revenue generated'
            },
            {
                metric: 'Direct Costs',
                budget: data.summaryTable.directCosts.budget,
                actual: data.summaryTable.directCosts.actual,
                variance: data.summaryTable.directCosts.variancePercent,
                notes: data.summaryTable.directCosts.notes || 'Revenue - Gross Profit'
            },
            {
                metric: 'Operating Expenses',
                budget: data.summaryTable.operatingExpenses.budget,
                actual: data.summaryTable.operatingExpenses.actual,
                variance: data.summaryTable.operatingExpenses.variancePercent,
                notes: data.summaryTable.operatingExpenses.notes || 'Total Operating Expenses'
            },
            {
                metric: 'Gross Profit',
                budget: data.summaryTable.grossProfit.budget,
                actual: data.summaryTable.grossProfit.actual,
                variance: data.summaryTable.grossProfit.variancePercent,
                notes: data.summaryTable.grossProfit.notes || 'Revenue - Direct Costs',
                isAutoComputed: true
            },
            {
                metric: 'Net Margin',
                budget: data.summaryTable.netMargin.budget,
                actual: data.summaryTable.netMargin.actual,
                variance: data.summaryTable.netMargin.variancePercent,
                notes: data.summaryTable.netMargin.notes || '(Net Profit ÷ Revenue) × 100',
                isAutoComputed: true,
                isPercentage: true
            }
        ];
    }, [data?.summaryTable]);

    const formatPlanningAmount = (val: number | null | string) => {
        if (val === null || val === undefined) return '—';
        const num = Number(val);
        if (isNaN(num)) return String(val);
        return `$ ${num.toLocaleString()}`;
    };

    const normalizedCategories = React.useMemo(() => {
        if (!data) return [];
        if (data.planningTable) {
            return data.planningTable;
        }
        if (data.planningData) {
            return data.planningData;
        }
        return [];
    }, [data]);

    const categoriesWithCalculatedPercentages = React.useMemo(() => {
        const categories = normalizedCategories;
        if (!categories || categories.length === 0) return [];

        let revenueAmount = 0;
        const revenueCategory = categories.find((c: any) => c.category?.toLowerCase() === 'revenue');
        if (revenueCategory && revenueCategory.items) {
            const forecastRevenueItem = revenueCategory.items.find((item: any) => {
                const name = (item.name || item.metric || '').toLowerCase().trim();
                return name === 'forecast revenue';
            });
            if (forecastRevenueItem) {
                revenueAmount = forecastRevenueItem.amount;
            } else if (revenueCategory.items[0]) {
                revenueAmount = revenueCategory.items[0].amount;
            }
        }
        if (revenueAmount === 0) {
            revenueAmount = 0; // fallback
        }

        let forecastProfitAmount = 0;
        let forecastProfitPercent = 0;
        if (data?.summaryTable) {
            const rev = data.summaryTable.revenue?.budget || revenueAmount;
            const direct = data.summaryTable.directCosts?.budget || 0;
            const opex = data.summaryTable.operatingExpenses?.budget || 0;
            forecastProfitAmount = rev - direct - opex;
            forecastProfitPercent = rev > 0 ? parseFloat(((forecastProfitAmount / rev) * 100).toFixed(1)) : 0;
        }

        const mapped = categories.map((c: any) => {
            return {
                category: c.category,
                isSummary: c.isSummary || false,
                items: (c.items || []).map((item: any) => {
                    const name = item.name || item.metric || '';
                    const amount = item.amount;
                    let percentage = item.percentage;
                    if (percentage === undefined) {
                        const lowerName = name.toLowerCase().trim();
                        if (lowerName === 'expected growth rate' || lowerName === 'forecast cash position') {
                            percentage = null;
                        } else {
                            percentage = revenueAmount > 0 ? parseFloat(((amount / revenueAmount) * 100).toFixed(1)) : 0;
                        }
                    }
                    return {
                        id: item.id,
                        name,
                        amount,
                        percentage,
                        isHighlight: item.isHighlight || false,
                        isPercentageValue: item.isPercentageValue || (name.toLowerCase().trim() === 'expected growth rate')
                    };
                })
            };
        });

        const hasSummary = mapped.some((c: any) => c.category?.toLowerCase() === 'financial summary');
        if (!hasSummary) {
            mapped.push({
                category: 'Financial Summary',
                isSummary: true,
                items: [
                    {
                        id: 'Σ',
                        name: 'Forecast Profit',
                        amount: forecastProfitAmount,
                        percentage: forecastProfitPercent,
                        isHighlight: true,
                        isPercentageValue: false
                    },
                    {
                        id: 14,
                        name: 'Forecast Cash Position',
                        amount: data?.summaryCards?.budgetRevenue ? Math.round(data.summaryCards.budgetRevenue * 0.15) : 0,
                        percentage: null,
                        isHighlight: false,
                        isPercentageValue: false
                    },
                    {
                        id: 15,
                        name: 'Expected Growth Rate',
                        amount: data?.summaryTable?.netMargin?.budget || 0,
                        percentage: null,
                        isHighlight: false,
                        isPercentageValue: true
                    }
                ]
            });
        }

        return mapped;
    }, [normalizedCategories, data]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="w-full h-auto sm:h-[64px] flex flex-col sm:flex-row sm:items-center justify-between gap-[10px] pt-[4px] pb-[4px]">
                <div className="space-y-1">
                    <h1 className="text-[24px] font-medium text-slate-800 font-inter leading-[32px] tracking-[0%]">{activeHeader.title}</h1>
                    <p className="text-[14px] font-normal text-slate-400 font-inter leading-[20px] tracking-[0%]">{activeHeader.subtitle}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {/* Month Dropdown */}
                    <div className="relative">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="h-[40px] pl-[16px] pr-[36px] bg-white border border-slate-200 rounded-[10px] text-[13px] font-semibold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] cursor-pointer appearance-none transition-all duration-200 min-w-[130px] font-inter"
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
                            className="h-[40px] pl-[16px] pr-[36px] bg-white border border-slate-200 rounded-[10px] text-[13px] font-semibold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] cursor-pointer appearance-none transition-all duration-200 min-w-[100px] font-inter"
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
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {currentKPIs.map((metric, i) => (
                    <KPICard
                        key={i}
                        label={metric.label}
                        value={getKpiValue(metric.key, metric.format)}
                        trend={getKpiTrend(metric.key, metric.trend)}
                        isDown={getIsDown(metric.key)}
                        icon={getIcon(metric.icon)}
                        sub={getKpiSub(metric.key, metric.sub)}
                        showTrend={true}
                    />
                ))}
            </div>

            {/* Budget vs Actual Summary Table */}
            <div className="w-full h-[410px] bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                <div className="min-h-[64px] py-3 sm:py-0 flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 border-b border-slate-50 bg-slate-50/20 gap-3 sm:gap-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <DollarSign size={16} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[13px] font-semibold text-slate-900 font-inter leading-[19.5px] tracking-[0%]">Budget vs Actual Summary</h3>
                            <span className="text-[10.5px] text-slate-400 font-normal font-inter leading-[15.75px] tracking-[0%]">Editable · variance auto-computed</span>
                        </div>
                    </div>
                    <button className="w-[140px] h-[23.75px] flex items-center justify-center gap-[5px] py-[3px] px-[9px] text-[10.5px] font-normal text-slate-400 border border-slate-200 rounded-[6px] hover:bg-slate-50 transition-colors font-inter leading-[15.75px]">
                        <SquarePen size={12} />
                        Click any cell to edit
                    </button>
                </div>

                <div className="flex-1 overflow-x-auto overflow-y-auto">
                    <table className="w-full min-w-[800px] lg:min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc] border-b border-[#e2e3f0] h-[36.75px]">
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Metric</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Budget</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Actual</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Variance %</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Formula / Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {activeSummaryData.map((row: any, index: number) => (
                                <tr key={index} className="hover:bg-slate-50/30 transition-colors h-[56px] border-b border-[#f1f5f9]">
                                    <td className="px-6 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-[12.5px] font-medium text-slate-900 font-inter leading-[18.75px]">{getTableLabel(row.metric)}</span>
                                            {row.isAutoComputed && <span className="text-[10px] text-slate-300 font-normal font-inter leading-[15px] tracking-[0%]">Auto-computed</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter leading-[18.75px]">
                                            {row.isPercentage ? `${row.budget}%` : `$ ${row.budget.toLocaleString()}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-[12.5px] font-medium text-slate-600 font-inter leading-[18.75px]">
                                            {row.isPercentage ? `${row.actual}%` : `$ ${row.actual.toLocaleString()}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className={`w-[62px] h-[20.5px] inline-flex items-center gap-[2px] pt-[2px] pr-[6px] pb-[2px] pl-[4px] rounded-[4px] border text-[11px] font-semibold font-inter leading-[16.5px] ${row.variance < 0
                                            ? 'bg-[#fbf1f2] text-[#dc2626] border-[#eab7bc]'
                                            : row.variance > 0
                                                ? 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
                                                : 'bg-slate-50 text-slate-500 border-slate-200'
                                            }`}>
                                            {row.variance > 0 && <ArrowUpRight size={10} />}
                                            {row.variance < 0 && <ArrowDownRight size={10} />}
                                            {Math.abs(row.variance).toFixed(1)}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="text-[12.5px] font-medium text-slate-400 font-inter leading-[18.75px]">{row.notes}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Budget Planning Table */}
            <div className="w-full bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden mb-6">
                <div className="min-h-[65.25px] flex flex-col sm:flex-row items-start sm:items-center justify-between pt-[14px] pr-[18px] pb-[14px] pl-[18px] border-b border-[#e2e8f0] bg-[#fafbfc] gap-4 sm:gap-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <DollarSign size={16} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[13px] font-semibold text-slate-900 font-inter leading-[19.5px] tracking-normal">Budget Planning Table</h3>
                            <span className="text-[10.5px] text-slate-400 font-normal font-inter leading-[15.75px] tracking-normal">Editable spreadsheet · changes reflect in forecast summary</span>
                        </div>
                    </div>
                    <button className="w-[121.8px] h-[32px] flex items-center justify-center gap-2 rounded-[7px] border border-[#2563eb] bg-[#eff6ff] text-[#2563eb] text-[12px] font-medium font-inter leading-[18px] transition-colors hover:bg-blue-100 shrink-0">
                        <Plus size={14} />
                        Add Line Item
                    </button>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[800px]">
                    <table className="w-full min-w-[1000px] lg:min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] h-[52.5px]">
                                <th className="px-6 py-0 text-[10.5px] font-bold text-[#64748b] uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[60%]">Metric / Category</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-[#64748b] uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Amount ($)</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-[#64748b] uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%] text-right">% of Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoriesWithCalculatedPercentages.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-[12.5px] text-slate-400 italic font-inter">
                                        No budget planning data available
                                    </td>
                                </tr>
                            ) : (() => {
                                let runningCounter = 0;
                                return categoriesWithCalculatedPercentages.map((cat: any, catIndex: number) => {
                                    return (
                                        <React.Fragment key={cat.category}>
                                            <tr className="bg-[#f8fafc] h-[30px] border-b border-[#e2e8f0]">
                                                <td colSpan={3} className="pt-[7px] pr-[18px] pb-[7px] pl-[18px] text-[10px] font-bold text-slate-400 uppercase tracking-[1px] font-inter">
                                                    {cat.category.toUpperCase()}
                                                </td>
                                            </tr>
                                            {cat.items.length === 0 ? (
                                                <tr className="h-[52px] border-b border-[#f8fafc] hover:bg-slate-50/30 transition-colors">
                                                    <td colSpan={3} className="px-6 py-3 text-[12.5px] text-slate-400 italic font-inter">
                                                        No items in this category
                                                    </td>
                                                </tr>
                                            ) : (
                                                cat.items.map((item: any, itemIndex: number) => {
                                                    const isSummaryRow = cat.isSummary;
                                                    const isHighlight = item.isHighlight;
                                                    let rowLabel = item.id;
                                                    if (rowLabel === undefined) {
                                                        if (isSummaryRow) {
                                                            rowLabel = item.name === 'Forecast Profit' ? 'Σ' : ++runningCounter;
                                                        } else {
                                                            rowLabel = ++runningCounter;
                                                        }
                                                    } else if (typeof rowLabel === 'number') {
                                                        runningCounter = Math.max(runningCounter, rowLabel);
                                                    }

                                                    return (
                                                        <tr 
                                                            key={item.name} 
                                                            className={`h-[52px] border-b border-[#f8fafc] transition-colors ${
                                                                isHighlight 
                                                                    ? 'bg-emerald-50/10 hover:bg-emerald-50/20' 
                                                                    : 'hover:bg-slate-50/30'
                                                            }`}
                                                        >
                                                            <td className="px-6 py-0">
                                                                <div className="flex items-center gap-6">
                                                                    <span className={`w-6 text-center font-inter ${
                                                                        isHighlight 
                                                                            ? 'text-[14px] font-bold text-emerald-600' 
                                                                            : 'text-[11px] font-medium text-slate-300'
                                                                    }`}>
                                                                        {rowLabel}
                                                                    </span>
                                                                    <div className="flex flex-col">
                                                                        <span className={`text-[12.5px] font-medium font-inter ${
                                                                            isHighlight ? 'text-slate-900' : 'text-slate-600'
                                                                        }`}>
                                                                            {getTableLabel(item.name)}
                                                                        </span>
                                                                        {item.name === 'Forecast Profit' && (
                                                                            <span className="text-[10px] text-slate-400 font-normal font-inter leading-[15px]">
                                                                                Revenue - All Expenses
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className={`px-6 py-0 text-[12.5px] font-medium font-inter ${
                                                                isHighlight ? 'text-emerald-600' : 'text-slate-600'
                                                            }`}>
                                                                {item.isPercentageValue ? (
                                                                    <>
                                                                        {item.amount} <span className="text-[10px] text-slate-300">%</span>
                                                                    </>
                                                                ) : (
                                                                    formatPlanningAmount(item.amount)
                                                                )}
                                                            </td>
                                                            <td className={`px-6 py-0 text-right pr-12 text-[12.5px] font-medium font-inter ${
                                                                isHighlight ? 'text-emerald-600' : 'text-slate-600'
                                                            }`}>
                                                                {item.percentage !== null ? (
                                                                    <>
                                                                        {item.percentage} <span className={`text-[10px] ${
                                                                            isHighlight ? 'text-emerald-300' : 'text-slate-300'
                                                                        }`}>%</span>
                                                                    </>
                                                                ) : '—'}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </React.Fragment>
                                    );
                                });
                            })()}
                        </tbody>
                    </table>
                </div>

                <div className="h-[55px] flex items-center pt-[11px] pr-[18px] pl-[50px] border-t border-[#f1f5f9] bg-white">
                    <button className="w-full max-w-[1089px] h-[34px] flex items-center justify-center gap-2 rounded-[7px] border border-dashed border-[#cbd5e1] text-[#64748b] text-[12px] font-medium font-inter leading-[18px] transition-all hover:bg-slate-50 hover:border-slate-400">
                        <Plus size={14} />
                        Add Line Item
                    </button>
                </div>
            </div>

        </div>
    );
}

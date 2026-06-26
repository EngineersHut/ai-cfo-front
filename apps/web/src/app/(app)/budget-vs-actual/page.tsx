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
    ChevronDown,
    Trash2,
    Check,
    X
} from 'lucide-react';

import KPICard from '@/components/common/KPICard';
import {
    budgetMetrics,
    budgetSummaryData as defaultBudgetSummaryData,
} from '@/data/budgetData';
import { IndustryEnum, BUDGET_KPI_CONFIGS, BUDGET_HEADER_CONFIGS, BUDGET_TABLE_CONFIGS } from '@/config/industryConfig';
import * as LucideIcons from 'lucide-react';
import { fetchBudgetData, setTimeframe, updateBudgetData } from '@/store/slices/budget';
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

    const [editingRowKey, setEditingRowKey] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<any>({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addModalTable, setAddModalTable] = useState<'summary' | 'planning'>('planning');
    const [newRowCategory, setNewRowCategory] = useState<string>('Operating Expenses');
    const [newRowName, setNewRowName] = useState<string>('');
    const [newRowAmount, setNewRowAmount] = useState<number>(0);
    const [newRowActual, setNewRowActual] = useState<number>(0);
    const [newRowNotes, setNewRowNotes] = useState<string>('');

    const [companyType, setCompanyType] = useState<string>(IndustryEnum.TRANSPORTATION_AND_LOGISTICS);
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

    const activeHeader = BUDGET_HEADER_CONFIGS[companyType as IndustryEnum] ?? BUDGET_HEADER_CONFIGS[IndustryEnum.TRANSPORTATION_AND_LOGISTICS] ?? { title: 'Budget vs Actual', subtitle: '' };
    const currentKPIs = BUDGET_KPI_CONFIGS[companyType as IndustryEnum] ?? BUDGET_KPI_CONFIGS[IndustryEnum.TRANSPORTATION_AND_LOGISTICS] ?? [];

    const getTableLabel = (label: string) => {
        const industryLabels = BUDGET_TABLE_CONFIGS[companyType as IndustryEnum] || BUDGET_TABLE_CONFIGS[IndustryEnum.TRANSPORTATION_AND_LOGISTICS];
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
                { key: 'revenue', metric: 'Revenue', budget: 0, actual: 0, variance: 0, notes: 'No data' },
                { key: 'directCosts', metric: 'Direct Costs', budget: 0, actual: 0, variance: 0, notes: 'No data' },
                { key: 'operatingExpenses', metric: 'Operating Expenses', budget: 0, actual: 0, variance: 0, notes: 'No data' },
                { key: 'grossProfit', metric: 'Gross Profit', budget: 0, actual: 0, variance: 0, notes: 'No data', isAutoComputed: true },
                { key: 'netMargin', metric: 'Net Margin', budget: 0, actual: 0, variance: 0, notes: 'No data', isAutoComputed: true, isPercentage: true }
            ];
        }

        const standardList = [
            {
                key: 'revenue',
                metric: 'Revenue',
                budget: data.summaryTable.revenue.budget,
                actual: data.summaryTable.revenue.actual,
                variance: data.summaryTable.revenue.variancePercent,
                notes: data.summaryTable.revenue.notes || 'Total Revenue generated'
            },
            {
                key: 'directCosts',
                metric: 'Direct Costs',
                budget: data.summaryTable.directCosts.budget,
                actual: data.summaryTable.directCosts.actual,
                variance: data.summaryTable.directCosts.variancePercent,
                notes: data.summaryTable.directCosts.notes || 'Revenue - Gross Profit'
            },
            {
                key: 'operatingExpenses',
                metric: 'Operating Expenses',
                budget: data.summaryTable.operatingExpenses.budget,
                actual: data.summaryTable.operatingExpenses.actual,
                variance: data.summaryTable.operatingExpenses.variancePercent,
                notes: data.summaryTable.operatingExpenses.notes || 'Total Operating Expenses'
            },
            {
                key: 'grossProfit',
                metric: 'Gross Profit',
                budget: data.summaryTable.grossProfit.budget,
                actual: data.summaryTable.grossProfit.actual,
                variance: data.summaryTable.grossProfit.variancePercent,
                notes: data.summaryTable.grossProfit.notes || 'Revenue - Direct Costs',
                isAutoComputed: true
            },
            {
                key: 'netMargin',
                metric: 'Net Margin',
                budget: data.summaryTable.netMargin.budget,
                actual: data.summaryTable.netMargin.actual,
                variance: data.summaryTable.netMargin.variancePercent,
                notes: data.summaryTable.netMargin.notes || '(Net Profit ÷ Revenue) × 100',
                isAutoComputed: true,
                isPercentage: true
            }
        ];

        const customList = (data.summaryTable.customItems || []).map((item: any, idx: number) => ({
            key: `custom_${idx}`,
            metric: item.name,
            budget: item.budget,
            actual: item.actual,
            variance: item.variancePercent,
            notes: item.notes || '',
            isCustom: true
        }));

        return [...standardList, ...customList];
    }, [data?.summaryTable]);

    const handleSaveSummaryEdit = async (rowKey: string) => {
        const payload: any = {};
        
        if (rowKey === 'revenue') {
            payload.totalRevenueBudget = Number(editValues.budget);
        } else if (rowKey === 'directCosts') {
            payload.totalDirectCostsBudget = Number(editValues.budget);
        } else if (rowKey === 'operatingExpenses') {
            payload.totalOperatingExpensesBudget = Number(editValues.budget);
        } else if (rowKey.startsWith('custom_')) {
            const idx = parseInt(rowKey.replace('custom_', ''));
            const customItems = [...(data?.summaryTable?.customItems || [])];
            customItems[idx] = {
                name: editValues.metric,
                budget: Number(editValues.budget),
                actual: Number(editValues.actual),
                notes: editValues.notes
            };
            payload.summaryItems = customItems;
        }

        dispatch(updateBudgetData(selectedMonth, selectedYear, payload));
        setEditingRowKey(null);
    };

    const handleDeleteSummaryRow = (rowKey: string) => {
        if (rowKey.startsWith('custom_')) {
            const idx = parseInt(rowKey.replace('custom_', ''));
            const customItems = [...(data?.summaryTable?.customItems || [])];
            customItems.splice(idx, 1);

            dispatch(updateBudgetData(selectedMonth, selectedYear, {
                summaryItems: customItems
            }));
            setEditingRowKey(null);
        }
    };

    const getUpdatedLineItems = (updatedItemKey: string, newVals: any, isDelete = false) => {
        const lineItems: any[] = [];
        categoriesWithCalculatedPercentages.forEach((cat: any) => {
            const catName = cat.category;
            if (cat.isSummary) return; // Skip Financial Summary
            
            cat.items.forEach((item: any, idx: number) => {
                const itemKey = `planning_${catName}_${idx}`;
                if (itemKey === updatedItemKey) {
                    if (isDelete) {
                        return; // Skip adding (delete)
                    }
                    lineItems.push({
                        category: catName,
                        name: newVals.name,
                        amount: Number(newVals.amount)
                    });
                } else {
                    lineItems.push({
                        category: catName,
                        name: item.name,
                        amount: item.amount
                    });
                }
            });
        });
        return lineItems;
    };

    const handleSavePlanningEdit = async (rowKey: string) => {
        const lineItems = getUpdatedLineItems(rowKey, {
            name: editValues.name,
            amount: editValues.amount
        }, false);
        
        dispatch(updateBudgetData(selectedMonth, selectedYear, { lineItems }));
        setEditingRowKey(null);
    };

    const handleDeletePlanningRow = async (rowKey: string) => {
        const lineItems = getUpdatedLineItems(rowKey, {}, true);
        
        dispatch(updateBudgetData(selectedMonth, selectedYear, { lineItems }));
        setEditingRowKey(null);
    };

    const handleAddNewItemSubmit = () => {
        if (!newRowName.trim()) {
            alert('Item name cannot be empty');
            return;
        }

        if (addModalTable === 'summary') {
            const customItems = [...(data?.summaryTable?.customItems || [])];
            customItems.push({
                name: newRowName.trim(),
                budget: newRowAmount,
                actual: newRowActual,
                notes: newRowNotes.trim()
            });
            dispatch(updateBudgetData(selectedMonth, selectedYear, {
                summaryItems: customItems
            }));
        } else {
            const lineItems: any[] = [];
            categoriesWithCalculatedPercentages.forEach((cat: any) => {
                if (cat.isSummary) return; // Skip Financial Summary
                cat.items.forEach((item: any) => {
                    lineItems.push({
                        category: cat.category,
                        name: item.name,
                        amount: item.amount
                    });
                });
            });
            
            lineItems.push({
                category: newRowCategory,
                name: newRowName.trim(),
                amount: newRowAmount
            });
            
            dispatch(updateBudgetData(selectedMonth, selectedYear, { lineItems }));
        }

        setIsAddModalOpen(false);
    };

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
                    <h1 className="text-[24px] font-medium text-slate-800 dark:text-slate-100 font-inter leading-[32px] tracking-[0%]">{activeHeader.title}</h1>
                    <p className="text-[14px] font-normal text-slate-400 dark:text-slate-500 font-inter leading-[20px] tracking-[0%]">{activeHeader.subtitle}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {/* Month Dropdown */}
                    <div className="relative">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="h-[40px] pl-[16px] pr-[36px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[10px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] cursor-pointer appearance-none transition-all duration-200 min-w-[130px] font-inter"
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
                            className="h-[40px] pl-[16px] pr-[36px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[10px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] cursor-pointer appearance-none transition-all duration-200 min-w-[100px] font-inter"
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
            <div className="w-full bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                <div className="min-h-[64px] py-3 sm:py-0 flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 border-b border-slate-50 dark:border-slate-700 bg-slate-50/20 dark:bg-slate-800/50 gap-3 sm:gap-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 shrink-0">
                            <DollarSign size={16} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-inter leading-[19.5px] tracking-[0%]">Budget vs Actual Summary</h3>
                            <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-normal font-inter leading-[15.75px] tracking-[0%]">Editable · variance auto-computed</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            setAddModalTable('summary');
                            setNewRowName('');
                            setNewRowAmount(0);
                            setNewRowActual(0);
                            setNewRowNotes('');
                            setIsAddModalOpen(true);
                        }}
                        className="w-[121.8px] h-[32px] flex items-center justify-center gap-2 rounded-[7px] border border-[#2563eb] dark:border-blue-800 bg-[#eff6ff] dark:bg-blue-900/30 text-[#2563eb] dark:text-blue-400 text-[12px] font-medium font-inter leading-[18px] transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/50 shrink-0 cursor-pointer"
                    >
                        <Plus size={14} />
                        Add Line Item
                    </button>
                </div>

                <div className="flex-1 overflow-x-auto overflow-y-auto">
                    <table className="w-full min-w-[800px] lg:min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc] dark:bg-slate-700/50 border-b border-[#e2e3f0] dark:border-slate-600 h-[36.75px]">
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Metric</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Budget</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Actual</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Variance %</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Formula / Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                            {activeSummaryData.map((row: any, index: number) => {
                                const isEditing = editingRowKey === `summary_${row.key}`;
                                return (
                                    <tr 
                                        key={index} 
                                        onClick={() => {
                                            if (!isEditing && !row.isAutoComputed) {
                                                setEditingRowKey(`summary_${row.key}`);
                                                setEditValues({
                                                    metric: row.metric,
                                                    budget: row.budget,
                                                    actual: row.actual,
                                                    notes: row.notes
                                                });
                                            }
                                        }}
                                        className={`group hover:bg-slate-50/30 dark:hover:bg-slate-700/30 transition-colors h-[56px] border-b border-[#f1f5f9] dark:border-slate-700 ${!row.isAutoComputed ? 'cursor-pointer' : ''}`}
                                    >
                                        <td className="px-6 py-3">
                                            {isEditing && row.isCustom ? (
                                                <input 
                                                    type="text" 
                                                    value={editValues.metric} 
                                                    onChange={(e) => setEditValues({ ...editValues, metric: e.target.value })}
                                                    className="w-full h-8 px-2 border rounded text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="text-[12.5px] font-medium text-slate-900 dark:text-slate-100 font-inter leading-[18.75px]">{getTableLabel(row.metric)}</span>
                                                    {row.isAutoComputed && <span className="text-[10px] text-slate-300 dark:text-slate-500 font-normal font-inter leading-[15px] tracking-[0%]">Auto-computed</span>}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-3">
                                            {isEditing ? (
                                                <input 
                                                    type="number" 
                                                    value={editValues.budget} 
                                                    onChange={(e) => setEditValues({ ...editValues, budget: parseFloat(e.target.value) || 0 })}
                                                    className="w-24 h-8 px-2 border rounded text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <span className="text-[12.5px] font-medium text-slate-600 dark:text-slate-300 font-inter leading-[18.75px]">
                                                    {row.isPercentage ? `${row.budget}%` : `$ ${row.budget.toLocaleString()}`}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3">
                                            {isEditing && row.isCustom ? (
                                                <input 
                                                    type="number" 
                                                    value={editValues.actual} 
                                                    onChange={(e) => setEditValues({ ...editValues, actual: parseFloat(e.target.value) || 0 })}
                                                    className="w-24 h-8 px-2 border rounded text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <span className="text-[12.5px] font-medium text-slate-600 dark:text-slate-300 font-inter leading-[18.75px]">
                                                    {row.isPercentage ? `${row.actual}%` : `$ ${row.actual.toLocaleString()}`}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className={`w-[62px] h-[20.5px] inline-flex items-center gap-[2px] pt-[2px] pr-[6px] pb-[2px] pl-[4px] rounded-[4px] border text-[11px] font-semibold font-inter leading-[16.5px] ${row.variance < 0
                                                ? 'bg-[#fbf1f2] dark:bg-red-900/30 text-[#dc2626] dark:text-red-400 border-[#eab7bc] dark:border-red-800'
                                                : row.variance > 0
                                                    ? 'bg-[#ecfdf5] dark:bg-emerald-900/30 text-[#059669] dark:text-emerald-400 border-[#a7f3d0] dark:border-emerald-800'
                                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                                }`}>
                                                {row.variance > 0 && <ArrowUpRight size={10} />}
                                                {row.variance < 0 && <ArrowDownRight size={10} />}
                                                {Math.abs(row.variance).toFixed(1)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            {isEditing ? (
                                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <input 
                                                        type="text" 
                                                        value={editValues.notes} 
                                                        onChange={(e) => setEditValues({ ...editValues, notes: e.target.value })}
                                                        className="flex-1 h-8 px-2 border rounded text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                                                    />
                                                    <button 
                                                        onClick={() => handleSaveSummaryEdit(row.key)}
                                                        className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded cursor-pointer animate-in fade-in"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setEditingRowKey(null)}
                                                        className="p-1 text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer animate-in fade-in"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    {row.isCustom && (
                                                        <button 
                                                            onClick={() => handleDeleteSummaryRow(row.key)}
                                                            className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer animate-in fade-in"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[12.5px] font-medium text-slate-400 font-inter leading-[18.75px]">{row.notes}</span>
                                                    {row.isCustom && (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteSummaryRow(row.key);
                                                            }}
                                                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Budget Planning Table */}
            <div className="w-full bg-white dark:bg-slate-800 rounded-[12px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden mb-6">
                <div className="min-h-[65.25px] flex flex-col sm:flex-row items-start sm:items-center justify-between pt-[14px] pr-[18px] pb-[14px] pl-[18px] border-b border-[#e2e8f0] dark:border-slate-700 bg-[#fafbfc] dark:bg-slate-800 gap-4 sm:gap-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 shrink-0">
                            <DollarSign size={16} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 font-inter leading-[19.5px] tracking-normal">Budget Planning Table</h3>
                            <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-normal font-inter leading-[15.75px] tracking-normal">Editable spreadsheet · changes reflect in forecast summary</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            setAddModalTable('planning');
                            setNewRowCategory('Operating Expenses');
                            setNewRowName('');
                            setNewRowAmount(0);
                            setIsAddModalOpen(true);
                        }}
                        className="w-[121.8px] h-[32px] flex items-center justify-center gap-2 rounded-[7px] border border-[#2563eb] dark:border-blue-800 bg-[#eff6ff] dark:bg-blue-900/30 text-[#2563eb] dark:text-blue-400 text-[12px] font-medium font-inter leading-[18px] transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/50 shrink-0 cursor-pointer"
                    >
                        <Plus size={14} />
                        Add Line Item
                    </button>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[800px]">
                    <table className="w-full min-w-[1000px] lg:min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc] dark:bg-slate-700/50 border-b border-[#e2e8f0] dark:border-slate-600 h-[52.5px]">
                                <th className="px-6 py-0 text-[10.5px] font-bold text-[#64748b] dark:text-slate-300 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[60%]">Metric / Category</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-[#64748b] dark:text-slate-300 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%]">Amount ($)</th>
                                <th className="px-6 py-0 text-[10.5px] font-bold text-[#64748b] dark:text-slate-300 uppercase tracking-[0.74px] font-inter leading-[15.75px] w-[20%] text-right">% of Revenue</th>
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
                                            <tr className="bg-[#f8fafc] dark:bg-slate-800/80 h-[30px] border-b border-[#e2e8f0] dark:border-slate-700">
                                                <td colSpan={3} className="pt-[7px] pr-[18px] pb-[7px] pl-[18px] text-[10px] font-bold text-slate-400 font-inter uppercase tracking-[1px]">
                                                    {cat.category.toUpperCase()}
                                                </td>
                                            </tr>
                                            {cat.items.length === 0 ? (
                                                <tr className="h-[52px] border-b border-[#f8fafc] dark:border-slate-700 hover:bg-slate-50/30 dark:hover:bg-slate-700/30 transition-colors">
                                                    <td colSpan={3} className="px-6 py-3 text-[12.5px] text-slate-400 dark:text-slate-500 italic font-inter">
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

                                                    const isEditing = editingRowKey === `planning_${cat.category}_${itemIndex}`;

                                                    return (
                                                        <tr 
                                                            key={item.name} 
                                                            onClick={() => {
                                                                if (!isEditing && !isSummaryRow) {
                                                                    setEditingRowKey(`planning_${cat.category}_${itemIndex}`);
                                                                    setEditValues({
                                                                        name: item.name,
                                                                        amount: item.amount
                                                                    });
                                                                }
                                                            }}
                                                            className={`group h-[52px] border-b border-[#f8fafc] dark:border-slate-700 transition-colors ${
                                                                isHighlight 
                                                                    ? 'bg-emerald-50/10 dark:bg-emerald-900/10 hover:bg-emerald-50/20 dark:hover:bg-emerald-900/20' 
                                                                    : 'hover:bg-slate-50/30 dark:hover:bg-slate-700/30'
                                                            } ${!isSummaryRow ? 'cursor-pointer' : ''}`}
                                                        >
                                                            <td className="px-6 py-0">
                                                                <div className="flex items-center gap-6">
                                                                    <span className={`w-6 text-center font-inter ${
                                                                        isHighlight 
                                                                            ? 'text-[14px] font-bold text-emerald-600 dark:text-emerald-400' 
                                                                            : 'text-[11px] font-medium text-slate-300 dark:text-slate-500'
                                                                    }`}>
                                                                        {rowLabel}
                                                                    </span>
                                                                    {isEditing ? (
                                                                        <input 
                                                                            type="text" 
                                                                            value={editValues.name} 
                                                                            onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                                                                            className="w-full h-8 px-2 border rounded text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        />
                                                                    ) : (
                                                                        <div className="flex flex-col">
                                                                            <span className={`text-[12.5px] font-medium font-inter ${
                                                                                isHighlight ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'
                                                                            }`}>
                                                                                {getTableLabel(item.name)}
                                                                            </span>
                                                                            {item.name === 'Forecast Profit' && (
                                                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal font-inter leading-[15px]">
                                                                                    Revenue - All Expenses
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className={`px-6 py-0 text-[12.5px] font-medium font-inter ${
                                                                isHighlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'
                                                            }`}>
                                                                {isEditing ? (
                                                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                                        <input 
                                                                            type="number" 
                                                                            value={editValues.amount} 
                                                                            onChange={(e) => setEditValues({ ...editValues, amount: parseFloat(e.target.value) || 0 })}
                                                                            className="w-32 h-8 px-2 border rounded text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                                                                        />
                                                                        <button 
                                                                            onClick={() => handleSavePlanningEdit(`planning_${cat.category}_${itemIndex}`)}
                                                                            className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded cursor-pointer animate-in fade-in"
                                                                        >
                                                                            <Check size={16} />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => setEditingRowKey(null)}
                                                                            className="p-1 text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer animate-in fade-in"
                                                                        >
                                                                            <X size={16} />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => handleDeletePlanningRow(`planning_${cat.category}_${itemIndex}`)}
                                                                            className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer animate-in fade-in"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                ) : item.isPercentageValue ? (
                                                                    <>
                                                                        {item.amount} <span className="text-[10px] text-slate-300 dark:text-slate-500">%</span>
                                                                    </>
                                                                ) : (
                                                                    formatPlanningAmount(item.amount)
                                                                )}
                                                            </td>
                                                            <td className={`px-6 py-0 text-right pr-12 text-[12.5px] font-medium font-inter ${
                                                                isHighlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'
                                                            }`}>
                                                                <div className="flex items-center justify-end gap-3">
                                                                    <span>
                                                                        {item.percentage !== null ? (
                                                                            <>
                                                                                {item.percentage} <span className={`text-[10px] ${
                                                                                    isHighlight ? 'text-emerald-300 dark:text-emerald-500' : 'text-slate-300 dark:text-slate-500'
                                                                                }`}>%</span>
                                                                            </>
                                                                        ) : '—'}
                                                                    </span>
                                                                    {!isSummaryRow && (
                                                                        <button 
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeletePlanningRow(`planning_${cat.category}_${itemIndex}`);
                                                                            }}
                                                                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    )}
                                                                </div>
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

                <div className="h-[55px] flex items-center pt-[11px] pr-[18px] pl-[50px] border-t border-[#f1f5f9] dark:border-slate-700 bg-white dark:bg-slate-800">
                    <button 
                        onClick={() => {
                            setAddModalTable('planning');
                            setNewRowCategory('Operating Expenses');
                            setNewRowName('');
                            setNewRowAmount(0);
                            setIsAddModalOpen(true);
                        }}
                        className="w-full max-w-[1089px] h-[34px] flex items-center justify-center gap-2 rounded-[7px] border border-dashed border-[#cbd5e1] dark:border-slate-600 text-[#64748b] dark:text-slate-400 text-[12px] font-medium font-inter leading-[18px] transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer"
                    >
                        <Plus size={14} />
                        Add Line Item
                    </button>
                </div>
            </div>

            {/* Add Line Item Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-inter">
                                Add Custom Line Item ({addModalTable === 'summary' ? 'Summary' : 'Planning'})
                            </h3>
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="space-y-3 font-inter">
                            {addModalTable === 'planning' && (
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Category</label>
                                    <select 
                                        value={newRowCategory}
                                        onChange={(e) => setNewRowCategory(e.target.value)}
                                        className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 focus:outline-none"
                                    >
                                        <option value="Revenue">Revenue</option>
                                        <option value="Direct Costs">Direct Costs</option>
                                        <option value="Operating Expenses">Operating Expenses</option>
                                        <option value="Growth & Expansion">Growth & Expansion</option>
                                        <option value="Leadership & Compliance">Leadership & Compliance</option>
                                    </select>
                                </div>
                            )}
                            
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Metric / Item Name</label>
                                <input 
                                    type="text"
                                    value={newRowName}
                                    onChange={(e) => setNewRowName(e.target.value)}
                                    placeholder="e.g. Software Subscriptions"
                                    className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 focus:outline-none"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">
                                        {addModalTable === 'summary' ? 'Budget ($)' : 'Amount ($)'}
                                    </label>
                                    <input 
                                        type="number"
                                        value={newRowAmount}
                                        onChange={(e) => setNewRowAmount(parseFloat(e.target.value) || 0)}
                                        className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 focus:outline-none"
                                    />
                                </div>
                                
                                {addModalTable === 'summary' && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-500">Actual ($)</label>
                                        <input 
                                            type="number"
                                            value={newRowActual}
                                            onChange={(e) => setNewRowActual(parseFloat(e.target.value) || 0)}
                                            className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 focus:outline-none"
                                        />
                                    </div>
                                )}
                            </div>

                            {addModalTable === 'summary' && (
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Notes</label>
                                    <input 
                                        type="text"
                                        value={newRowNotes}
                                        onChange={(e) => setNewRowNotes(e.target.value)}
                                        placeholder="Add notes..."
                                        className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddNewItemSubmit}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium cursor-pointer shadow"
                            >
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

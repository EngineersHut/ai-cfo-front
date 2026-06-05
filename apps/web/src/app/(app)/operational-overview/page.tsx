"use client";

import React, { useState } from 'react';
import { Activity, Truck, Pin, Zap, Users, Clock, BarChart3 } from 'lucide-react';
import {
    ResponsiveContainer,
    Cell,
    PieChart as RePieChart,
    Pie
} from 'recharts';
import KPICard from '@/components/common/KPICard';
import DetailedMetricsCard from '@/components/common/DetailedMetricsCard';
import { healthData } from '@/data/dashboardData';
import { useDispatch, useSelector } from '@/store';
import { fetchOperationalData } from '@/store/slices/operational';
import { useEffect } from 'react';
import { IndustryEnum, OPERATIONAL_KPI_CONFIGS, OPERATIONAL_HEADER_CONFIGS, OPERATIONAL_CORE_CONFIGS } from '@/config/industryConfig';
import * as LucideIcons from 'lucide-react';

const IconMap: any = {
    Zap: Zap,
    Users: Users,
    Clock: Clock,
    BarChart3: BarChart3,
    Activity: Activity
};

// Custom Gauge Components
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

export default function OperationalOverview() {
    const [timeframe, setTimeframeState] = useState('Monthly');

    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.operational);
    const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
    const [companyType, setCompanyType] = useState<string>(IndustryEnum.FLEET_MANAGEMENT);

    useEffect(() => {
        const savedCompanyId = localStorage.getItem('selectedCompany');
        if (savedCompanyId) {
            setCurrentCompanyId(savedCompanyId);
        }
        const savedType = localStorage.getItem('selectedCompanyType');
        if (savedType) {
            setCompanyType(savedType);
        }

        const interval = setInterval(() => {
            const savedId = localStorage.getItem('selectedCompany');
            if (savedId !== currentCompanyId) {
                setCurrentCompanyId(savedId);
            }
            const savedTypeVal = localStorage.getItem('selectedCompanyType');
            if (savedTypeVal && savedTypeVal !== companyType) {
                setCompanyType(savedTypeVal);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentCompanyId, companyType]);

    useEffect(() => {
        if (currentCompanyId) {
            dispatch(fetchOperationalData(currentCompanyId, timeframe));
        }
    }, [currentCompanyId, timeframe, dispatch]);

    const activeHeader = OPERATIONAL_HEADER_CONFIGS[companyType as IndustryEnum] || OPERATIONAL_HEADER_CONFIGS[IndustryEnum.FLEET_MANAGEMENT];
    const currentKPIs = OPERATIONAL_KPI_CONFIGS[companyType as IndustryEnum] || OPERATIONAL_KPI_CONFIGS[IndustryEnum.FLEET_MANAGEMENT];

    const getIcon = (iconName: string) => {
        const IconComp = (LucideIcons as any)[iconName];
        if (IconComp) return <IconComp size={18} />;
        return <LucideIcons.Activity size={18} />;
    };

    const getKpiValue = (key: string, format: string) => {
        let val = data?.summaryCards?.[key];

        if (val === undefined || val === null) {
            if (format === 'percent') return '0%';
            return '0';
        }

        const num = Number(val);
        if (isNaN(num)) return String(val);

        if (format === 'percent') {
            return `${num.toFixed(1)}%`;
        }
        return num.toLocaleString();
    };

    const getIsDown = (key: string) => {
        if (key === 'activeTickets' || key === 'resolutionTime' || key === 'reviewTurnaround' || key === 'settlementTime') return true;
        return false;
    };

    const currentCoreConfigs = OPERATIONAL_CORE_CONFIGS[companyType as IndustryEnum] || OPERATIONAL_CORE_CONFIGS[IndustryEnum.FLEET_MANAGEMENT];

    const coreOperations = currentCoreConfigs.map((cfg) => {
        const rawItem = data?.coreOperations?.[cfg.key];
        
        let valueStr = '0';
        if (rawItem?.value !== undefined && rawItem?.value !== null) {
            if (cfg.format === 'percent') {
                valueStr = `${rawItem.value}%`;
            } else {
                valueStr = String(rawItem.value);
            }
        } else {
            if (cfg.format === 'percent') {
                valueStr = '0%';
            }
        }

        let trendStr = '0%';
        let isUp = true;
        if (rawItem?.vsPrior !== undefined && rawItem?.vsPrior !== null) {
            const vsPrior = Number(rawItem.vsPrior);
            trendStr = `${vsPrior >= 0 ? '+' : ''}${vsPrior}%`;
            isUp = cfg.isDownPositive ? vsPrior < 0 : vsPrior >= 0;
        }

        const distributionVal = rawItem?.distribution ?? 0;

        return {
            metric: cfg.metric,
            value: valueStr,
            sub: cfg.sub,
            trend: trendStr,
            isUp,
            distribution: distributionVal,
            color: cfg.color
        };
    });

    const score = data?.operationalHealth?.healthScore ?? 0;
    const status = score >= 80 ? 'EXCELLENT' : score >= 60 ? 'GOOD' : score >= 40 ? 'FAIR' : 'POOR';
    const operationalHealth = {
        score,
        status,
        metrics: [
            { label: 'Fleet Efficiency', value: data?.operationalHealth?.fleetEfficiency !== undefined ? `${data.operationalHealth.fleetEfficiency}%` : '0%' },
            { label: 'Delivery Success Rate', value: data?.operationalHealth?.deliverySuccessRate !== undefined ? `${data.operationalHealth.deliverySuccessRate}%` : '0%' },
            { label: 'Cost Efficiency', value: data?.operationalHealth?.costEfficiency !== undefined ? `${data.operationalHealth.costEfficiency}%` : '0%' }
        ]
    };

    const costEfficiency = [
        {
            metric: 'Total Deliveries / Trips',
            value: data?.costEfficiency?.totalDeliveriesTrips?.value !== undefined ? `${data.costEfficiency.totalDeliveriesTrips.value}` : '0',
            sub: 'Completed today',
            trend: data?.costEfficiency?.totalDeliveriesTrips?.vsPrior !== undefined ? `${data.costEfficiency.totalDeliveriesTrips.vsPrior >= 0 ? '+' : ''}${data.costEfficiency.totalDeliveriesTrips.vsPrior}%` : '0%',
            isUp: (data?.costEfficiency?.totalDeliveriesTrips?.vsPrior ?? 0) >= 0,
            distribution: data?.costEfficiency?.totalDeliveriesTrips?.distribution ?? 100,
            color: '#6366f1'
        },
        {
            metric: 'Deliveries per Vehicle',
            value: data?.costEfficiency?.deliveriesPerVehicle?.value !== undefined ? `${data.costEfficiency.deliveriesPerVehicle.value}` : '0',
            sub: 'Daily average',
            trend: data?.costEfficiency?.deliveriesPerVehicle?.vsPrior !== undefined ? `${data.costEfficiency.deliveriesPerVehicle.vsPrior >= 0 ? '+' : ''}${data.costEfficiency.deliveriesPerVehicle.vsPrior}%` : '0%',
            isUp: (data?.costEfficiency?.deliveriesPerVehicle?.vsPrior ?? 0) >= 0,
            distribution: data?.costEfficiency?.deliveriesPerVehicle?.distribution ?? 65,
            color: '#f59e0b'
        },
        {
            metric: 'On-Time Delivery %',
            value: data?.costEfficiency?.onTimeDeliveryPercent?.value !== undefined ? `${data.costEfficiency.onTimeDeliveryPercent.value}%` : '0%',
            sub: 'Target: ≥ 90%',
            trend: data?.costEfficiency?.onTimeDeliveryPercent?.vsPrior !== undefined ? `${data.costEfficiency.onTimeDeliveryPercent.vsPrior >= 0 ? '+' : ''}${data.costEfficiency.onTimeDeliveryPercent.vsPrior}%` : '0%',
            isUp: (data?.costEfficiency?.onTimeDeliveryPercent?.vsPrior ?? 0) >= 0,
            distribution: data?.costEfficiency?.onTimeDeliveryPercent?.distribution ?? 100,
            color: '#6366f1'
        },
        {
            metric: 'Failed Delivery %',
            value: data?.costEfficiency?.failedDeliveryPercent?.value !== undefined ? `${data.costEfficiency.failedDeliveryPercent.value}%` : '0%',
            sub: 'Threshold: < 2%',
            trend: data?.costEfficiency?.failedDeliveryPercent?.vsPrior !== undefined ? `${data.costEfficiency.failedDeliveryPercent.vsPrior >= 0 ? '+' : ''}${data.costEfficiency.failedDeliveryPercent.vsPrior}%` : '0%',
            isUp: (data?.costEfficiency?.failedDeliveryPercent?.vsPrior ?? 0) < 0,
            distribution: data?.costEfficiency?.failedDeliveryPercent?.distribution ?? 80,
            color: '#ef4444'
        }
    ];

    const fleetDriverUtilization = [
        {
            metric: 'Total Deliveries / Trips',
            value: data?.fleetDriverUtilization?.totalDeliveriesTrips?.value !== undefined ? `${data.fleetDriverUtilization.totalDeliveriesTrips.value}` : '0',
            sub: 'Completed today',
            trend: data?.fleetDriverUtilization?.totalDeliveriesTrips?.vsPrior !== undefined ? `${data.fleetDriverUtilization.totalDeliveriesTrips.vsPrior >= 0 ? '+' : ''}${data.fleetDriverUtilization.totalDeliveriesTrips.vsPrior}%` : '0%',
            isUp: (data?.fleetDriverUtilization?.totalDeliveriesTrips?.vsPrior ?? 0) >= 0,
            distribution: data?.fleetDriverUtilization?.totalDeliveriesTrips?.distribution ?? 100,
            color: '#6366f1'
        },
        {
            metric: 'Deliveries per Vehicle',
            value: data?.fleetDriverUtilization?.deliveriesPerVehicle?.value !== undefined ? `${data.fleetDriverUtilization.deliveriesPerVehicle.value}` : '0',
            sub: 'Daily average',
            trend: data?.fleetDriverUtilization?.deliveriesPerVehicle?.vsPrior !== undefined ? `${data.fleetDriverUtilization.deliveriesPerVehicle.vsPrior >= 0 ? '+' : ''}${data.fleetDriverUtilization.deliveriesPerVehicle.vsPrior}%` : '0%',
            isUp: (data?.fleetDriverUtilization?.deliveriesPerVehicle?.vsPrior ?? 0) >= 0,
            distribution: data?.fleetDriverUtilization?.deliveriesPerVehicle?.distribution ?? 65,
            color: '#f59e0b'
        },
        {
            metric: 'On-Time Delivery %',
            value: data?.fleetDriverUtilization?.onTimeDeliveryPercent?.value !== undefined ? `${data.fleetDriverUtilization.onTimeDeliveryPercent.value}%` : '0%',
            sub: 'Target: ≥ 90%',
            trend: data?.fleetDriverUtilization?.onTimeDeliveryPercent?.vsPrior !== undefined ? `${data.fleetDriverUtilization.onTimeDeliveryPercent.vsPrior >= 0 ? '+' : ''}${data.fleetDriverUtilization.onTimeDeliveryPercent.vsPrior}%` : '0%',
            isUp: (data?.fleetDriverUtilization?.onTimeDeliveryPercent?.vsPrior ?? 0) >= 0,
            distribution: data?.fleetDriverUtilization?.onTimeDeliveryPercent?.distribution ?? 100,
            color: '#6366f1'
        },
        {
            metric: 'Failed Delivery %',
            value: data?.fleetDriverUtilization?.failedDeliveryPercent?.value !== undefined ? `${data.fleetDriverUtilization.failedDeliveryPercent.value}%` : '0%',
            sub: 'Threshold: < 2%',
            trend: data?.fleetDriverUtilization?.failedDeliveryPercent?.vsPrior !== undefined ? `${data.fleetDriverUtilization.failedDeliveryPercent.vsPrior >= 0 ? '+' : ''}${data.fleetDriverUtilization.failedDeliveryPercent.vsPrior}%` : '0%',
            isUp: (data?.fleetDriverUtilization?.failedDeliveryPercent?.vsPrior ?? 0) < 0,
            distribution: data?.fleetDriverUtilization?.failedDeliveryPercent?.distribution ?? 80,
            color: '#ef4444'
        }
    ];

    const driverPerformance = [
        {
            metric: 'Total Deliveries / Trips',
            value: data?.driverPerformance?.totalDeliveriesTrips?.value !== undefined ? `${data.driverPerformance.totalDeliveriesTrips.value}` : '0',
            sub: 'Completed today',
            trend: data?.driverPerformance?.totalDeliveriesTrips?.vsPrior !== undefined ? `${data.driverPerformance.totalDeliveriesTrips.vsPrior >= 0 ? '+' : ''}${data.driverPerformance.totalDeliveriesTrips.vsPrior}%` : '0%',
            isUp: (data?.driverPerformance?.totalDeliveriesTrips?.vsPrior ?? 0) >= 0,
            distribution: data?.driverPerformance?.totalDeliveriesTrips?.distribution ?? 100,
            color: '#6366f1'
        },
        {
            metric: 'Deliveries per Vehicle',
            value: data?.driverPerformance?.deliveriesPerVehicle?.value !== undefined ? `${data.driverPerformance.deliveriesPerVehicle.value}` : '0',
            sub: 'Daily average',
            trend: data?.driverPerformance?.deliveriesPerVehicle?.vsPrior !== undefined ? `${data.driverPerformance.deliveriesPerVehicle.vsPrior >= 0 ? '+' : ''}${data.driverPerformance.deliveriesPerVehicle.vsPrior}%` : '0%',
            isUp: (data?.driverPerformance?.deliveriesPerVehicle?.vsPrior ?? 0) >= 0,
            distribution: data?.driverPerformance?.deliveriesPerVehicle?.distribution ?? 65,
            color: '#f59e0b'
        },
        {
            metric: 'On-Time Delivery %',
            value: data?.driverPerformance?.onTimeDeliveryPercent?.value !== undefined ? `${data.driverPerformance.onTimeDeliveryPercent.value}%` : '0%',
            sub: 'Target: ≥ 90%',
            trend: data?.driverPerformance?.onTimeDeliveryPercent?.vsPrior !== undefined ? `${data.driverPerformance.onTimeDeliveryPercent.vsPrior >= 0 ? '+' : ''}${data.driverPerformance.onTimeDeliveryPercent.vsPrior}%` : '0%',
            isUp: (data?.driverPerformance?.onTimeDeliveryPercent?.vsPrior ?? 0) >= 0,
            distribution: data?.driverPerformance?.onTimeDeliveryPercent?.distribution ?? 100,
            color: '#6366f1'
        },
        {
            metric: 'Failed Delivery %',
            value: data?.driverPerformance?.failedDeliveryPercent?.value !== undefined ? `${data.driverPerformance.failedDeliveryPercent.value}%` : '0%',
            sub: 'Threshold: < 2%',
            trend: data?.driverPerformance?.failedDeliveryPercent?.vsPrior !== undefined ? `${data.driverPerformance.failedDeliveryPercent.vsPrior >= 0 ? '+' : ''}${data.driverPerformance.failedDeliveryPercent.vsPrior}%` : '0%',
            isUp: (data?.driverPerformance?.failedDeliveryPercent?.vsPrior ?? 0) < 0,
            distribution: data?.driverPerformance?.failedDeliveryPercent?.distribution ?? 80,
            color: '#ef4444'
        }
    ];

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
        <div className=" space-y-8 animate-in fade-in duration-500">
            <div className="w-full h-auto sm:h-[64px] flex flex-col sm:flex-row sm:items-center justify-between gap-[10px] pt-[4px] pb-[4px]">
                <div className="space-y-1">
                    <h1 className="text-[24px] font-medium text-slate-800 font-inter leading-[32px] tracking-[0%]">{activeHeader.title}</h1>
                    <p className="text-[14px] font-normal text-slate-400 font-inter leading-[20px] tracking-[0%]">{activeHeader.subtitle}</p>
                </div>

                <div className="w-[265px] h-[48px] flex items-center justify-between p-[5px] bg-white border border-slate-100 rounded-[8px] shadow-sm shrink-0">
                    {['Monthly', 'Quarterly', 'Yearly'].map((option) => (
                        <button
                            key={option}
                            onClick={() => setTimeframeState(option)}
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

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {currentKPIs.map((metric: any, i: number) => {
                    return (
                        <KPICard
                            key={i}
                            label={metric.label}
                            value={getKpiValue(metric.key, metric.format)}
                            trend={metric.trend}
                            isDown={getIsDown(metric.key)}
                            icon={getIcon(metric.icon)}
                            sub={metric.sub}
                            noTrendIcon={metric.noTrendIcon}
                        />
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Core Operations Card - Spans 2 columns */}
                <DetailedMetricsCard
                    title="Core Operations"
                    icon={<Truck size={16} />}
                    isLive="Live"
                    data={coreOperations}
                    className="lg:col-span-2"
                />

                {/* Operational Health Card */}


                <div className="h-[374px] bg-white rounded-[12px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    {/* Header - 54px */}
                    <div className="h-[54px] flex items-center p-[12px] gap-[12px] border-b border-slate-50">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <Pin size={16} />
                        </div>
                        <h3 className="text-[16px] font-normal text-slate-800 font-inter leading-[24px] tracking-[0%]">Operational Health</h3>
                    </div>

                    {/* Body */}
                    <div className="flex-1 flex flex-col">
                        <div className="relative h-[180px] w-full flex items-center justify-center">
                            <div className="w-[260px] h-[180px] relative mx-auto">
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
                                                const gradientIds = ['gradPoor', 'gradFair', 'gradGood', 'gradExcellent'];
                                                return <Cell key={`cell-${index}`} fill={`url(#${gradientIds[index]})`} />;
                                            })}
                                        </Pie>
                                    </RePieChart>
                                </ResponsiveContainer>

                                {/* Independent Needle Layer */}
                                <NeedleLayer value={operationalHealth.score} cx={130} cy={140} iR={30} oR={85} />
                            </div>
                        </div>

                        <div className="text-center mt-[-10px] mb-2">
                            <p className="text-[11px] font-normal text-slate-600 mb-0.5 font-inter leading-none tracking-[0%]">Today Health</p>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-[9px] font-normal text-slate-400 uppercase tracking-[0%] font-inter leading-none text-center">{operationalHealth.status}</span>
                                <span className="text-[14px] font-semibold text-slate-900 font-inter leading-none tracking-[0%]">{operationalHealth.score}</span>
                            </div>
                        </div>

                        {/* Health Metrics Details */}
                        <div className="px-5 space-y-6 border-t border-slate-50 pt-2">
                            {operationalHealth.metrics.map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-[12px] font-normal text-slate-700 font-inter leading-none">{item.label}</span>
                                    <span className="text-[12px] font-semibold text-slate-900 font-inter leading-none">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <DetailedMetricsCard
                title="Cost Efficiency"
                icon={<Truck size={16} />}
                isLive="2 above benchmark"
                data={costEfficiency}
                className="lg:col-span-2"
            />
            <DetailedMetricsCard
                title="Fleet & Driver Utilization"
                icon={<Truck size={16} />}
                isLive=""
                data={fleetDriverUtilization}
                className="lg:col-span-2"
            />
            <DetailedMetricsCard
                title="Driver Performance"
                icon={<Truck size={16} />}
                isLive="2 above benchmark"
                data={driverPerformance}
                className="lg:col-span-2"
            />
        </div>
    );
}

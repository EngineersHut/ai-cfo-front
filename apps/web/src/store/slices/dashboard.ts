import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../index';
import { AppDispatch } from '..';
import { getData, patchData } from '@/utils/apiHelper';
import { drawerGroups } from '@/data/drawerData';
import { revenueData, healthData, aiInsightsData, detailedCostData } from '@/data/dashboardData';

// Generate initial state from drawerData IDs
export const getInitialVisibility = () => {
  const initial: Record<string, boolean> = {};
  drawerGroups.forEach(group => {
    group.sections.forEach(section => {
      section.items.forEach(item => {
        initial[item.id] = true; // By default all are visible
      });
    });
  });
  return initial;
};

// Maps frontend kebab-case IDs to backend camelCase properties
export const mapToApiKeys = (visibility: Record<string, boolean>) => {
  return {
    totalTrips: !!visibility['total-trips'],
    delPerVeh: !!visibility['del-per-veh'],
    fleetUtil: !!visibility['fleet-util'],
    driverEff: !!visibility['driver-eff'],
    runway: !!visibility['runway'],
    growth: !!visibility['growth'],
    ebitda: !!visibility['ebitda'],
    cashflow: !!visibility['cashflow'],
    revTime: !!visibility['rev-time'],
    health: !!visibility['health'],
    expenseBreakdown: !!visibility['expenseBreakdown'],
    aiInsights: !!visibility['aiInsights'],
    costAnalysis: !!visibility['costAnalysis'],
  };
};

// Maps backend camelCase properties to frontend kebab-case IDs
export const mapFromApiKeys = (data: any) => {
  return {
    'total-trips': !!data.totalTrips,
    'del-per-veh': !!data.delPerVeh,
    'fleet-util': !!data.fleetUtil,
    'driver-eff': !!data.driverEff,
    'runway': !!data.runway,
    'growth': !!data.growth,
    'ebitda': !!data.ebitda,
    'cashflow': !!data.cashflow,
    'rev-time': !!data.revTime,
    'health': !!data.health,
    'expenseBreakdown': !!data.expenseBreakdown,
    'aiInsights': !!data.aiInsights,
    'costAnalysis': !!data.costAnalysis,
  };
};

interface DashboardState {
  timeframe: string;
  revenueData: typeof revenueData;
  healthData: typeof healthData;
  healthScore: number;
  auditCompliance: number;
  equityHealth: number;
  aiInsights: typeof aiInsightsData;
  costEfficiency: typeof detailedCostData;
  kpiStats: {
    totalTrips: { value: string; trend: string; sub: string };
    delPerVeh: { value: string; unit: string; trend: string; sub: string };
    fleetUtil: { value: string; trend: string; isDown: boolean; sub: string };
    driverEff: { value: string; trend: string; sub: string };
    cashRunway: { value: string; trend: string; sub: string };
    growth: { value: string; trend: string; sub: string };
    ebitda: { value: string; trend: string; isDown: boolean; sub: string };
    cashflow: { value: string; unit: string; trend: string; sub: string };
  };
  visibility: Record<string, boolean>;
}

const initialState: DashboardState = {
  timeframe: 'Monthly',
  revenueData: revenueData,
  healthData: healthData,
  healthScore: 84,
  auditCompliance: 98,
  equityHealth: 84,
  aiInsights: aiInsightsData,
  costEfficiency: detailedCostData,
  kpiStats: {
    totalTrips: { value: "70", trend: "+12.5%", sub: "Healthy Liquidity Profile" },
    delPerVeh: { value: "200", unit: "/ Day", trend: "+1.5%", sub: "Per vehicle daily average" },
    fleetUtil: { value: "95%", trend: "-1.2%", isDown: true, sub: "Near-optimal fleet coverage" },
    driverEff: { value: "80%", trend: "Stable", sub: "Below 85% target review score..." },
    cashRunway: { value: "12 months", trend: "+12.5%", sub: "Projected survival time" },
    growth: { value: "18.2%", trend: "+5.4%", sub: "Month-over-month increase" },
    ebitda: { value: "$45,000", trend: "-1.2%", isDown: true, sub: "Earnings before interest" },
    cashflow: { value: "$22,000", unit: "/ Month", trend: "+3.2%", sub: "Net cash from operations" }
  },
  visibility: getInitialVisibility()
};

const slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTimeframe(state, action) {
      state.timeframe = action.payload;
    },
    getDashboardConfigSuccess(state, action) {
      state.visibility = action.payload;
    },
    toggleDashboardVisibilityState(state, action) {
      const id = action.payload;
      state.visibility[id] = !state.visibility[id];
    },
    resetDashboardConfigState(state) {
      state.visibility = getInitialVisibility();
    },
    getDashboardDataSuccess(state, action) {
      const apiData = action.payload;
      if (!apiData) return;

      const summary = apiData.summaryCards || {};
      const health = apiData.healthMeter || {};
      const cost = apiData.costEfficiency || {};

      // 1. Update KPI stats
      state.kpiStats = {
        totalTrips: {
          value: summary.totalDeliveries !== undefined ? String(summary.totalDeliveries) : state.kpiStats.totalTrips.value,
          trend: summary.growthPercent !== undefined ? `${summary.growthPercent >= 0 ? '+' : ''}${summary.growthPercent}%` : state.kpiStats.totalTrips.trend,
          sub: state.kpiStats.totalTrips.sub
        },
        delPerVeh: {
          value: summary.deliveriesPerVehicle !== undefined ? String(summary.deliveriesPerVehicle) : state.kpiStats.delPerVeh.value,
          unit: state.kpiStats.delPerVeh.unit,
          trend: state.kpiStats.delPerVeh.trend,
          sub: state.kpiStats.delPerVeh.sub
        },
        fleetUtil: {
          value: summary.fleetUtilization !== undefined ? `${summary.fleetUtilization}%` : state.kpiStats.fleetUtil.value,
          trend: state.kpiStats.fleetUtil.trend,
          isDown: state.kpiStats.fleetUtil.isDown,
          sub: state.kpiStats.fleetUtil.sub
        },
        driverEff: {
          value: summary.driverEfficiency !== undefined ? `${summary.driverEfficiency}%` : state.kpiStats.driverEff.value,
          trend: state.kpiStats.driverEff.trend,
          sub: state.kpiStats.driverEff.sub
        },
        cashRunway: {
          value: summary.cashRunway !== undefined ? `${summary.cashRunway} months` : state.kpiStats.cashRunway.value,
          trend: state.kpiStats.cashRunway.trend,
          sub: state.kpiStats.cashRunway.sub
        },
        growth: {
          value: summary.growthPercent !== undefined ? `${summary.growthPercent}%` : state.kpiStats.growth.value,
          trend: state.kpiStats.growth.trend,
          sub: state.kpiStats.growth.sub
        },
        ebitda: {
          value: summary.ebitda !== undefined ? `$${summary.ebitda.toLocaleString()}` : state.kpiStats.ebitda.value,
          trend: state.kpiStats.ebitda.trend,
          isDown: state.kpiStats.ebitda.isDown,
          sub: state.kpiStats.ebitda.sub
        },
        cashflow: {
          value: summary.operatingCashFlow !== undefined ? `$${summary.operatingCashFlow.toLocaleString()}` : state.kpiStats.cashflow.value,
          unit: state.kpiStats.cashflow.unit,
          trend: state.kpiStats.cashflow.trend,
          sub: state.kpiStats.cashflow.sub
        }
      };

      // 2. Update Revenue Trend
      if (Array.isArray(apiData.revenueTrend) && apiData.revenueTrend.length > 0) {
        state.revenueData = apiData.revenueTrend;
      }

      // 3. Update Health Score
      if (health.score !== undefined) {
        state.healthScore = health.score;
      }
      if (health.auditCompliance !== undefined) {
        state.auditCompliance = health.auditCompliance;
      }
      if (health.equityHealth !== undefined) {
        state.equityHealth = health.equityHealth;
      }

      // 4. Update Cost & Efficiency summary cards
      state.costEfficiency = {
        ...state.costEfficiency,
        summary: [
          { id: 'totalExpenses', label: 'Total Expenses', value: cost.totalExpenses !== undefined ? `$${(cost.totalExpenses / 1000).toFixed(0)}K` : state.costEfficiency.summary[0].value, trend: state.costEfficiency.summary[0].trend, isUp: state.costEfficiency.summary[0].isUp },
          { id: 'costRevenue', label: 'Cost of Revenue', value: cost.costOfRevenue !== undefined ? `${cost.costOfRevenue}%` : state.costEfficiency.summary[1].value, trend: state.costEfficiency.summary[1].trend, isUp: state.costEfficiency.summary[1].isUp },
          { id: 'costClient', label: 'Cost per Client', value: cost.costPerClient !== undefined ? `$${cost.costPerClient}` : state.costEfficiency.summary[2].value, trend: state.costEfficiency.summary[2].trend, isUp: state.costEfficiency.summary[2].isUp },
          { id: 'opExpRatio', label: 'Operating Expense Ratio', value: cost.operatingExpenseRatio !== undefined ? `${cost.operatingExpenseRatio}%` : state.costEfficiency.summary[3].value, trend: state.costEfficiency.summary[3].trend, isUp: state.costEfficiency.summary[3].isUp }
        ],
        breakdown: state.costEfficiency.breakdown.map((item: any) => {
          if (item.metric === 'Total Expenses' && cost.totalExpenses !== undefined) {
            return { ...item, value: `$${cost.totalExpenses.toLocaleString()}` };
          }
          if (item.metric === 'Cost % of Revenue' && cost.costOfRevenue !== undefined) {
            return { ...item, value: `${cost.costOfRevenue}%` };
          }
          return item;
        }),
        unitEconomics: state.costEfficiency.unitEconomics.map((item: any) => {
          if (item.metric === 'Cost per Client' && cost.costPerClient !== undefined) {
            return { ...item, value: `$${cost.costPerClient}` };
          }
          if (item.metric === 'Operating Expense Ratio' && cost.operatingExpenseRatio !== undefined) {
            return { ...item, value: `${cost.operatingExpenseRatio}%` };
          }
          return item;
        })
      };
    }
  }
});

export const {
  setTimeframe,
  getDashboardConfigSuccess,
  toggleDashboardVisibilityState,
  resetDashboardConfigState,
  getDashboardDataSuccess
} = slice.actions;

export const fetchDashboardConfig = () => {
  return async () => {
    try {
      const response = await getData('/api/dashboard-config');
      const configData = response?.data || response;
      if (configData) {
        dispatch(getDashboardConfigSuccess(mapFromApiKeys(configData)));
      }
    } catch (error) {
      console.error("Failed to fetch dashboard config from API", error);
    }
  };
};

export const toggleDashboardVisibility = (id: string, currentVisibility: Record<string, boolean>) => {
  return async () => {
    // Optimistically update local Redux state
    dispatch(toggleDashboardVisibilityState(id));

    try {
      const updated = {
        ...currentVisibility,
        [id]: !currentVisibility[id]
      };
      const payload = mapToApiKeys(updated);
      await patchData('/api/dashboard-config', payload);
    } catch (error) {
      console.error("Failed to toggle dashboard config via API", error);
    }
  };
};

export const resetDashboardConfig = () => {
  return async () => {
    dispatch(resetDashboardConfigState());

    try {
      const defaults = getInitialVisibility();
      const payload = mapToApiKeys(defaults);
      await patchData('/api/dashboard-config', payload);
    } catch (error) {
      console.error("Failed to reset dashboard config via API", error);
    }
  };
};

export const fetchDashboardData = (companyId: string, period: string) => {
  return async () => {
    try {
      const response = await getData(`/api/dashboard?companyId=${companyId}&period=${period.toLowerCase()}`);
      const data = response?.data || response;
      if (data) {
        dispatch(getDashboardDataSuccess(data));
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data from API", error);
    }
  };
};

export default slice.reducer;

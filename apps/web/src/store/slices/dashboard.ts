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
  revenueData: any[];
  healthData: typeof healthData;
  healthScore: number;
  auditCompliance: number;
  equityHealth: number;
  aiInsights: any[];
  cfoInsights: { title: string; description: string }[];
  forecastVsReality: {
    percentageAchieved: number;
    currentValue: number;
    targetValue: number;
  };
  costEfficiency: any;
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
  rawSummary: any;
  visibility: Record<string, boolean>;
}

const initialState: DashboardState = {
  timeframe: 'Monthly',
  revenueData: [],
  healthData: healthData,
  healthScore: 0,
  auditCompliance: 0,
  equityHealth: 0,
  aiInsights: [],
  cfoInsights: [],
  forecastVsReality: {
    percentageAchieved: 0,
    currentValue: 0,
    targetValue: 0
  },
  costEfficiency: {},
  kpiStats: {
    totalTrips: { value: "N/A", trend: "", sub: "" },
    delPerVeh: { value: "N/A", unit: "", trend: "", sub: "" },
    fleetUtil: { value: "N/A", trend: "", isDown: false, sub: "" },
    driverEff: { value: "N/A", trend: "", sub: "" },
    cashRunway: { value: "N/A", trend: "", sub: "" },
    growth: { value: "N/A", trend: "", sub: "" },
    ebitda: { value: "N/A", trend: "", isDown: false, sub: "" },
    cashflow: { value: "N/A", unit: "", trend: "", sub: "" }
  },
  rawSummary: {},
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
    setDashboardVisibilityBulkState(state, action) {
      const { ids, visible } = action.payload;
      ids.forEach((id: string) => {
        state.visibility[id] = visible;
      });
    },
    resetDashboardConfigState(state) {
      state.visibility = getInitialVisibility();
    },
    getDashboardDataSuccess(state, action) {
      const apiData = action.payload;
      if (!apiData) return;

      state.rawSummary = apiData.summaryCards || {};
      state.revenueData = apiData.revenueTrend || [];
      state.healthScore = apiData.healthMeter?.score ?? 84;
      state.auditCompliance = apiData.healthMeter?.auditCompliance ?? 98;
      state.equityHealth = apiData.healthMeter?.equityHealth ?? 84;
      state.costEfficiency = apiData.costEfficiency || {};
      state.cfoInsights = apiData.cfoInsights || [];
      state.forecastVsReality = apiData.forecastVsReality || {};
      state.aiInsights = apiData.aiInsights || [];
    }
  }
});

export const {
  setTimeframe,
  getDashboardConfigSuccess,
  toggleDashboardVisibilityState,
  setDashboardVisibilityBulkState,
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

export const toggleDashboardVisibilityBulk = (ids: string[], visible: boolean, currentVisibility: Record<string, boolean>) => {
  return async () => {
    // Optimistically update local Redux state
    dispatch(setDashboardVisibilityBulkState({ ids, visible }));

    try {
      const updated = {
        ...currentVisibility
      };
      ids.forEach((id) => {
        updated[id] = visible;
      });
      const payload = mapToApiKeys(updated);
      await patchData('/api/dashboard-config', payload);
    } catch (error) {
      console.error("Failed to update bulk dashboard config via API", error);
    }
  };
};

export const fetchDashboardData = (companyId: string, month?: number, year?: number) => {
  return async () => {
    try {
      let url = '/api/dashboard';
      if (month !== undefined && year !== undefined) {
        url += `?month=${month}&year=${year}`;
      }
      const response = await getData(url);
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

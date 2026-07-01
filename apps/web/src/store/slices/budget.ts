import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps } from '@/types';
import { getData, postData } from '@/utils/apiHelper';
import { dispatch } from '../index';
import { budgetSummaryData, budgetPlanningData } from '@/data/budgetData';

const initialState: DefaultRootStateProps['budget'] = {
  timeframe: 'Quarterly',
  data: null,
  loading: false,
  actionLoading: false,
  error: null
};

const slice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    getBudgetLoading(state, action) {
      state.loading = action.payload;
    },
    setTimeframe(state, action) {
      state.timeframe = action.payload;
    },
    getBudgetDataSuccess(state, action) {
      state.data = action.payload;
    },
    updateSummaryItemSuccess(state, action) {
      if (state.data) {
        state.data.summaryData = action.payload;
      }
    },
    updatePlanningItemSuccess(state, action) {
      if (state.data) {
        state.data.planningData = action.payload;
      }
    }
  }
});

export const {
  hasError,
  getBudgetLoading,
  setTimeframe,
  getBudgetDataSuccess,
  updateSummaryItemSuccess,
  updatePlanningItemSuccess
} = slice.actions;

export const fetchBudgetData = (month?: number, year?: number, period?: string, quarter?: number) => {
  return async () => {
    dispatch(slice.actions.getBudgetLoading(true));
    try {
      let url = '/api/budget-planning';
      const params: string[] = [];
      
      if (period) {
        params.push(`period=${period.toLowerCase()}`);
      }
      if (year !== undefined) {
        params.push(`year=${year}`);
      }
      if (period === 'quarterly' && quarter !== undefined) {
        params.push(`quarter=${quarter}`);
      }
      if (period === 'monthly' && month !== undefined) {
        params.push(`month=${month}`);
      }
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await getData(url);
      const data = response?.data || response;
      if (data) {
        dispatch(slice.actions.getBudgetDataSuccess(data));
      }
    } catch (error) {
      console.error("Failed to fetch budget data from API", error);
      dispatch(slice.actions.hasError(error));
    } finally {
      dispatch(slice.actions.getBudgetLoading(false));
    }
  };
};

export const updateBudgetData = (
  month: number,
  year: number,
  updatePayload: {
    lineItems?: any[];
    summaryItems?: any[];
    totalRevenueBudget?: number;
    totalDirectCostsBudget?: number;
    totalOperatingExpensesBudget?: number;
  }
) => {
  return async () => {
    dispatch(slice.actions.getBudgetLoading(true));
    try {
      const companyId = localStorage.getItem('selectedCompany');
      const payload = {
        companyId,
        month,
        year,
        ...updatePayload
      };
      await postData('/api/budget-planning', payload);
      dispatch(fetchBudgetData(month, year));
    } catch (error) {
      console.error("Failed to update budget data from API", error);
      dispatch(slice.actions.hasError(error));
    } finally {
      dispatch(slice.actions.getBudgetLoading(false));
    }
  };
};

export default slice.reducer;

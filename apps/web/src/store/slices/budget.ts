import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps } from '@/types';
import { getData } from '@/utils/apiHelper';
import { dispatch } from '../index';
import { budgetSummaryData, budgetPlanningData } from '@/data/budgetData';

const initialState: DefaultRootStateProps['budget'] = {
  timeframe: 'Quarterly',
  data: {
    summaryData: budgetSummaryData,
    planningData: budgetPlanningData
  },
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

export const fetchBudgetData = ( period: any) => {
  return async () => {
    dispatch(slice.actions.getBudgetLoading(true));
    try {
      const response = await getData(`/api/budget-planning?period=${period.toLowerCase()}`);
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

export default slice.reducer;

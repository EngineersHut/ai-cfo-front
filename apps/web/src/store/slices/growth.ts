import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps } from '@/types';
import { getData } from '@/utils/apiHelper';
import { dispatch } from '../index';

const initialState: DefaultRootStateProps['growth'] = {
  timeframe: 'Quarterly',
  data: null,
  loading: false,
  actionLoading: false,
  error: null
};

const slice = createSlice({
  name: 'growth',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    getGrowthLoading(state, action) {
      state.loading = action.payload;
    },
    setTimeframe(state, action) {
      state.timeframe = action.payload;
    },
    getGrowthDataSuccess(state, action) {
      state.data = action.payload;
    }
  }
});

export const {
  hasError,
  getGrowthLoading,
  setTimeframe,
  getGrowthDataSuccess
} = slice.actions;

export const fetchGrowthData = (companyId: string, period: string) => {
  return async () => {
    dispatch(slice.actions.getGrowthLoading(true));
    try {
      const response = await getData(`/api/growth-overview?companyId=${companyId}&period=${period.toLowerCase()}`);
      const data = response?.data || response;
      if (data) {
        dispatch(slice.actions.getGrowthDataSuccess(data));
      }
    } catch (error) {
      console.error("Failed to fetch growth data from API", error);
      dispatch(slice.actions.hasError(error));
    } finally {
      dispatch(slice.actions.getGrowthLoading(false));
    }
  };
};

export default slice.reducer;

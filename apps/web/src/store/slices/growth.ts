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

export const fetchGrowthData = (companyId: string, period: string, month?: number, year?: number, quarter?: number) => {
  return async () => {
    dispatch(getGrowthLoading(true));
    try {
      const queryParts: string[] = [];
      if (period) queryParts.push(`period=${period}`);
      if (year !== undefined) queryParts.push(`year=${year}`);
      if (period === "quarterly" && quarter !== undefined) {
        queryParts.push(`quarter=${quarter}`);
      }
      if (period === "monthly" && month !== undefined) {
        queryParts.push(`month=${month}`);
      }

      const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
      const url = `/api/growth-overview${queryString}`;

      const response = await getData(url);
      const data = response?.data || response;
      if (data) {
        dispatch(getGrowthDataSuccess(data));
      }
    } catch (error) {
      console.error("Failed to fetch growth data from API", error);
      dispatch(hasError(error));
    } finally {
      dispatch(getGrowthLoading(false));
    }
  };
};

export default slice.reducer;

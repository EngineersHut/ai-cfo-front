import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps } from '@/types';
import { getData } from '@/utils/apiHelper';
import { dispatch } from '../index';

const initialState: DefaultRootStateProps['operational'] = {
  timeframe: 'Monthly',
  data: null,
  loading: false,
  actionLoading: false,
  error: null
};

const slice = createSlice({
  name: 'operational',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    getOperationalLoading(state, action) {
      state.loading = action.payload;
    },
    setTimeframe(state, action) {
      state.timeframe = action.payload;
    },
    getOperationalDataSuccess(state, action) {
      state.data = action.payload;
    }
  }
});

export const {
  hasError,
  getOperationalLoading,
  setTimeframe,
  getOperationalDataSuccess
} = slice.actions;

export const fetchOperationalData = (companyId: string, period: string, month?: number, year?: number, quarter?: number) => {
  return async () => {
    dispatch(slice.actions.getOperationalLoading(true));
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
      const url = `/api/operational-overview${queryString}`;

      const response = await getData(url);
      const data = response?.data || response;
      if (data) {
        dispatch(slice.actions.getOperationalDataSuccess(data));
      }
    } catch (error) {
      console.error("Failed to fetch operational data from API", error);
      dispatch(slice.actions.hasError(error));
    } finally {
      dispatch(slice.actions.getOperationalLoading(false));
    }
  };
};

export default slice.reducer;

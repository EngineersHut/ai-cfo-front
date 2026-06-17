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

export const fetchOperationalData = (companyId: string, period: string, month?: number, year?: number) => {
  return async () => {
    dispatch(slice.actions.getOperationalLoading(true));
    try {
      let url = `/api/operational-overview?period=${period.toLowerCase()}`;
      if (month !== undefined && year !== undefined) {
        url += `&month=${month}&year=${year}`;
      }
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

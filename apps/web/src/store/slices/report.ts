import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps } from '@/types';
import { deleteData, getData, postData } from '@/utils/apiHelper';
import { AppDispatch } from '../index';
import { getErrorMessage } from '@/utils/common';

const initialState: DefaultRootStateProps['report'] = {
  reports: [],
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null,
  reportDetail: null,
  revenueTrend: null,
  expenseBreakdown: null,
};

const slice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    hasActionError(state, action) {
      state.actionError = action.payload;
    },
    getReportsLoading(state, action) {
      state.loading = action.payload;
    },
    actionLoadingSuccess(state, action) {
      state.actionLoading = action.payload;
    },
    getReportsSuccess(state, action) {
      state.reports = action.payload;
    },
    getReportDetailSuccess(state, action) {
      state.reportDetail = action.payload;
    },
    getRevenueTrendSuccess(state, action) {
      state.revenueTrend = action.payload;
    },
    getExpenseBreakdownSuccess(state, action) {
      state.expenseBreakdown = action.payload;
    },
    clearReportDetail(state) {
      state.reportDetail = null;
      state.revenueTrend = null;
      state.expenseBreakdown = null;
    }
  }
});

export const {
  hasError,
  hasActionError,
  getReportsLoading,
  actionLoadingSuccess,
  getReportsSuccess,
  getReportDetailSuccess,
  getRevenueTrendSuccess,
  getExpenseBreakdownSuccess,
  clearReportDetail
} = slice.actions;

//----------------------------  Report Thunks ------------------------------//

export const getAllReports = (query = '') => {
  return async (dispatch: AppDispatch) => {
    dispatch(getReportsLoading(true));
    try {
      const response = await getData(`/api/reports${query}`);
      dispatch(getReportsSuccess(response));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasError(errorMessage));
    } finally {
      dispatch(getReportsLoading(false));
    }
  };
};

export const createReport = (data: any, callback?: () => void) => {
  return async (dispatch: AppDispatch) => {
    dispatch(actionLoadingSuccess(true));
    try {
      await postData('/api/reports', data);
      callback?.();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(actionLoadingSuccess(false));
    }
  };
};

export const deleteReport = (id: string | number, callback?: () => void) => {
  return async (dispatch: AppDispatch) => {
    dispatch(actionLoadingSuccess(true));
    try {
      const response = await deleteData(`/api/reports/${id}`);
      if (response && response.reanalyzing) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('report-deleted', { detail: { reanalyzing: true } }));
        }
      }
      callback?.();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(actionLoadingSuccess(false));
    }
  };
};

export const getReportDetail = (id: string | number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(getReportsLoading(true));
    try {
      const response = await getData(`/api/reports/${id}`);
      dispatch(getReportDetailSuccess(response));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasError(errorMessage));
    } finally {
      dispatch(getReportsLoading(false));
    }
  };
};

export const getReportRevenueTrend = (id: string | number, period: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await getData(`/api/reports/${id}/revenue-trend?period=${period.toLowerCase()}`);
      dispatch(getRevenueTrendSuccess(response));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasError(errorMessage));
    }
  };
};

export const getReportExpenseBreakdown = (id: string | number, period: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await getData(`/api/reports/${id}/expense-breakdown?period=${period.toLowerCase()}`);
      dispatch(getExpenseBreakdownSuccess(response));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasError(errorMessage));
    }
  };
};

export default slice.reducer;

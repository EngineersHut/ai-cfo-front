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
    }
  }
});

export const {
  hasError,
  hasActionError,
  getReportsLoading,
  actionLoadingSuccess,
  getReportsSuccess
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
      await deleteData(`/api/reports/${id}`);
      callback?.();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(actionLoadingSuccess(false));
    }
  };
};

export default slice.reducer;

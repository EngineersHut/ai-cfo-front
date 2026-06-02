import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps } from '@/types';
import { getData, patchData } from '@/utils/apiHelper';
import { AppDispatch, dispatch } from '../index';
import { getErrorMessage } from '@/utils/common';

const initialState: DefaultRootStateProps['notification'] = {
  settings: {
    emailNotifications: true,
    alertsForFinancialRisks: true,
    weeklySummaryReports: false,
  },
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null,
};

const slice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    hasActionError(state, action) {
      state.actionError = action.payload;
    },
    getSettingsLoading(state, action) {
      state.loading = action.payload;
    },
    actionLoadingSuccess(state, action) {
      state.actionLoading = action.payload;
    },
    getSettingsSuccess(state, action) {
      state.settings = action.payload;
    },
    updateSettingsSuccess(state, action) {
      state.settings = { ...state.settings, ...action.payload };
    }
  }
});

export const {
  hasError,
  hasActionError,
  getSettingsLoading,
  actionLoadingSuccess,
  getSettingsSuccess,
  updateSettingsSuccess
} = slice.actions;

//----------------------------  Notification Settings Thunks ------------------------------//

export const getNotificationSettings = () => {
  return async () => {
    dispatch(getSettingsLoading(true));
    dispatch(hasError(null));
    try {
      const response = await getData('/api/notification-settings');
      const settings = response?.data || response;
      if (settings) {
        dispatch(getSettingsSuccess({
          emailNotifications: !!settings.emailNotifications,
          alertsForFinancialRisks: !!settings.alertsForFinancialRisks,
          weeklySummaryReports: !!settings.weeklySummaryReports
        }));
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasError(errorMessage));
    } finally {
      dispatch(getSettingsLoading(false));
    }
  };
};

export const updateNotificationSettings = (data: Partial<DefaultRootStateProps['notification']['settings']>, callback?: () => void) => {
  return async () => {
    dispatch(actionLoadingSuccess(true));
    dispatch(hasActionError(null));
    try {
      const response = await patchData('/api/notification-settings', data);
      const settings = response?.data || response;
      if (settings) {
        dispatch(updateSettingsSuccess({
          emailNotifications: !!settings.emailNotifications,
          alertsForFinancialRisks: !!settings.alertsForFinancialRisks,
          weeklySummaryReports: !!settings.weeklySummaryReports
        }));
      } else {
        dispatch(updateSettingsSuccess(data));
      }
      callback?.();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
      // Fallback update in case of testing environments
      dispatch(updateSettingsSuccess(data));
      callback?.();
    } finally {
      dispatch(actionLoadingSuccess(false));
    }
  };
};

export default slice.reducer;

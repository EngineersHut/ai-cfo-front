import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps } from '@/types';
import { postData } from '@/utils/apiHelper';
import { dispatch } from '../index';
import { ResetPassword, VerifyEmail, VerifyOTP } from '@/types/auth';
import { getErrorMessage } from '@/utils/common';

const initialState: DefaultRootStateProps['auth'] = {
  error: null,
  loading: false,
  actionError: null,
  actionLoading: false,
  signInData: []
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    getAuthLoading(state, action) {
      state.loading = action.payload;
    },
    getSignInDataSucsess(state, action) {
      state.signInData = action.payload;
    },
    hasActionError(state, action) {
      state.actionError = action.payload;
    },
    getAuthActionLoading(state, action) {
      state.actionLoading = action.payload;
    }
  }
});

export const { hasError, getAuthLoading, hasActionError, getSignInDataSucsess, getAuthActionLoading } = slice.actions;

export function userSignUp(payload: any, handleClose?: any) {
  return async () => {
    dispatch(getAuthActionLoading(true));
    try {
      const response = await postData('/api/user/signup', payload);
      // if (response?.access_token) {
      //   localStorage.setItem('access_token', response.access_token);
      //   localStorage.setItem('authUser', JSON.stringify(response.user));
      //   window.location.href = '/';
      // }
      // toast.success(response?.message);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    }
    dispatch(getAuthActionLoading(false));
  };
}

export function createsignIn(payload: any, handleClose?: any) {
  return async () => {
    dispatch(getAuthActionLoading(true));
    try {
      const response = await postData('/api/user/signin', payload);
      console.log(response,"response");
      
      if (response?.data?.token) {
        localStorage.setItem('token',response?.data?.token);
        window.location.href = '/dashboard';
      } else {
        // If there is no token, it is a custom failure payload (e.g. success: false or custom message)
        const errorMsg = response?.message || 'Invalid credentials';
        dispatch(hasActionError(errorMsg));
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    }
    dispatch(getAuthActionLoading(false));
  };
}

export function verifyEmail(data: VerifyEmail, handleClose: () => void) {
  return async () => {
    dispatch(getAuthActionLoading(true));
    try {
      const response = await postData(`/users/verify-email`, data);
      handleClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(getAuthActionLoading(false));
    }
  };
}

export function verifyOTP(data: VerifyOTP, handleClose: () => void) {
  return async () => {
    dispatch(getAuthActionLoading(true));
    try {
      const response = await postData(`/users/verify-otp`, data);
      localStorage.setItem('resetPassToken', response.token);
      handleClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(getAuthActionLoading(false));
    }
  };
}

export function resetPassword(data: ResetPassword, handleClose: () => void) {
  return async () => {
    dispatch(getAuthActionLoading(true));
    try {
      const response = await postData(`/users/reset-password`, data);
      localStorage.removeItem('resetPassToken');
      handleClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(getAuthActionLoading(false));
    }
  };
}

export default slice.reducer;

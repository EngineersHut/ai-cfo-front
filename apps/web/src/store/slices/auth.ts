import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps } from '@/types';
import { postData } from '@/utils/apiHelper';
import { dispatch } from '../index';
import { ResetPassword, VerifyEmail, VerifyOTP, UpdatePassword } from '@/types/auth';
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

export function userSignUp(payload: any, onSuccess?: () => void) {
  return async () => {
    dispatch(getAuthActionLoading(true));
    try {
      const response = await postData('/api/user/signup', payload);
      if (response && response.success === false) {
        dispatch(hasActionError(response.message || 'Registration failed'));
      } else {
        if (onSuccess) {
          onSuccess();
        }
      }
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
      
      if (response?.data?.token) {
        localStorage.setItem('token',response?.data?.token);
        localStorage.setItem('user',JSON.stringify(response?.data?._id));
        localStorage.setItem('name',JSON.stringify(response?.data?.name));
        localStorage.setItem('email',JSON.stringify(response?.data?.email));
        localStorage.setItem('profilePic',JSON.stringify(response?.data?.profilePic));
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

export function verifyEmail(data: VerifyEmail, onSuccess?: () => void) {
  return async () => {
    dispatch(getAuthActionLoading(true));
    dispatch(hasActionError(null));
    try {
      const response = await postData(`/api/auth/forgot-password`, data);
      if (response && response.success === false) {
        const errorMsg = response.message || 'Email verification failed';
        dispatch(hasActionError(errorMsg));
      } else {
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(getAuthActionLoading(false));
    }
  };
}

export function verifyOTP(data: VerifyOTP, onSuccess?: (data: any) => void) {
  return async () => {
    dispatch(getAuthActionLoading(true));
    dispatch(hasActionError(null));
    try {
      const response = await postData(`/api/auth/check-otp`, data);
      if (response && response.success === false) {
        const errorMsg = response.message || 'OTP verification failed';
        dispatch(hasActionError(errorMsg));
      } else {
        const token = response?.resetToken || response?.token || response?.data?.resetToken || response?.data?.token;
        if (token) {
          localStorage.setItem('resetPassToken', token);
        }
        if (onSuccess) onSuccess(response);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(getAuthActionLoading(false));
    }
  };
}

export function resetPassword(data: ResetPassword, onSuccess?: () => void) {
  return async () => {
    dispatch(getAuthActionLoading(true));
    dispatch(hasActionError(null));
    try {
      const payload = {
        token: localStorage.getItem('resetPassToken') || '',
        password: data.password
      };
      const response = await postData(`/api/auth/reset-password`, payload);
      if (response && response.success === false) {
        const errorMsg = response.message || 'Password reset failed';
        dispatch(hasActionError(errorMsg));
      } else {
        localStorage.removeItem('resetPassToken');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(getAuthActionLoading(false));
    }
  };
}

export function updatePassword(data: UpdatePassword, onSuccess?: () => void) {
  return async () => {
    dispatch(getAuthActionLoading(true));
    dispatch(hasActionError(null));
    try {
      const response = await postData(`/api/user/update-password`, data);
      if (response && response.success === false) {
        const errorMsg = response.message || 'Failed to update password';
        dispatch(hasActionError(errorMsg));
      } else {
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(getAuthActionLoading(false));
    }
  };
}

export default slice.reducer;

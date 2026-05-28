import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps } from '@/types';
import { postData } from '@/utils/apiHelper';
import { toast } from 'react-toastify';
import { dispatch } from '../index';
import { getErrorMessage } from '@/utils/common';
import { ResetPassword, VerifyEmail, VerifyOTP } from '@/types/auth';

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

export function verifyToken(organization_id: string, access_token: string) {
  return async () => {
    dispatch(getAuthLoading(true));
    try {
      const response = await postData('/auth/verify-user', {}, {
        headers: {
          'x-tenant-id': organization_id,
          'Authorization': `Bearer ${access_token}`
        }
      });
      if (response?.access_token) {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('authUser', JSON.stringify(response.user));
        localStorage.setItem('x-tenant-id', organization_id);
        window.location.href = '/company/company-setting';
      }
      toast.success(response?.message);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
      dispatch(getAuthLoading(false));
    }
  };
}

export function checkTenant(tenantId: string) {
  return async () => {
    dispatch(getAuthActionLoading(true)); // Use action loading for the verify button
    dispatch(hasActionError(null)); // Clear previous errors
    try {
      // Specialized call to the gateway for tenant verification
      const response = await axios.get(`https://gateway.engineershut.com/v1/company/verify-tenant/${tenantId}`);
      
      // The API is expected to return the dynamic base URL
      if (response?.data?.endpoint) {
        let endpoint = response.data.endpoint;
        if (!endpoint.startsWith('http')) {
          endpoint = `https://${endpoint}`;
        }
        localStorage.setItem('x-tenant-id', tenantId);
        localStorage.setItem('NEXT_PUBLIC_API_BASE_URL', endpoint);
        localStorage.setItem('logo', response.data.logo);
        return { ...response.data, endpoint };
      }
    } catch (error) {
       const errorMessage = getErrorMessage(error);
       dispatch(hasActionError(errorMessage));
       throw error;
    } finally {
      dispatch(getAuthActionLoading(false));
    }
  };
}

export function createsignIn(payload: any, handleClose?: any) {
  return async () => {
    dispatch(getAuthActionLoading(true));
    try {
      const response = await postData('/auth/sign-in', payload);
      if (response?.access_token) {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('authUser', JSON.stringify(response.user));
        window.location.href = '/';
      }
      toast.success(response?.message);
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
      toast.success(response?.message);
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
      toast.success(response?.message);
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
      toast.success(response?.message);
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

import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps } from '@/types';
import { deleteData, getData, patchData, postData, putData } from '@/utils/apiHelper';
import { AppDispatch } from '..';
import { dispatch } from '../index';
import { getErrorMessage } from '@/utils/common';

const initialState: DefaultRootStateProps['user'] = {
  error: null,
  actionError: null,
  userData: null,
  loading: false,
  actionLoading: false,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    hasActionError(state, action) {
      state.actionError = action.payload;
    },
    getUserProfileSuccess(state, action) {
      state.userData = action.payload;
    },
    getUsersLoading(state, action) {
      state.loading = action.payload;
    },
    actionLoadingSuccess(state, action) {
      state.actionLoading = action.payload;
    },
  }
});

export const {
  hasError,
  actionLoadingSuccess,
  getUsersLoading,
  hasActionError,
  getUserProfileSuccess,
} = slice.actions;

//----------------------------  user profile thunks ------------------------------//

export const getUserProfile = () => {
  return async () => {
    dispatch(getUsersLoading(true));
    dispatch(hasError(null));
    try {
      const response = await getData(`/api/user/profile`);
      const user = response?.data || response;
      dispatch(getUserProfileSuccess(user));
      if (typeof window !== 'undefined' && user) {
        localStorage.setItem('name', JSON.stringify(user.name));
        localStorage.setItem('email', JSON.stringify(user.email));
        localStorage.setItem('profilePic', JSON.stringify(user.profilePic || ''));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasError(errorMessage));
    } finally {
      dispatch(getUsersLoading(false));
    }
  };
};

export function updateProfileUser(data: any, onSuccess?: () => void) {
  return async () => {
    dispatch(actionLoadingSuccess(true));
    dispatch(hasActionError(null));
    try {
      const response = await patchData(`/api/user/update-profile`, data);
      const user = response?.data || response;
      if (user) {
        dispatch(getUserProfileSuccess(user));
        if (typeof window !== 'undefined') {
          localStorage.setItem('name', JSON.stringify(user.name));
          localStorage.setItem('email', JSON.stringify(user.email));
          localStorage.setItem('profilePic', JSON.stringify(user.profilePic || ''));
          window.dispatchEvent(new Event('storage'));
        }
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(actionLoadingSuccess(false));
    }
  };
}

export default slice.reducer;


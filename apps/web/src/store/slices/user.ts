import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps } from '@/types';
import { deleteData, getData, patchData, postData, putData } from '@/utils/apiHelper';
import { AppDispatch } from '..';
import { toast } from 'react-toastify';
import { dispatch } from '../index';
import { getErrorMessage } from '@/utils/common';

const initialState: DefaultRootStateProps['users'] = {
  error: null,
  actionError: null,
  allUsers: [],
  authoritymanager: [],
  singleUser: null,
  loginUserData: null,
  loading: false,
  actionLoading: false,
  count: 0
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
    getAllUserSuccess(state, action) {
      state.allUsers = action.payload;
    },
    getAllUserTotalCount(state, action) {
      state.count = action.payload;
    },
    getSingleUserSuccess(state, action) {
      state.singleUser = action.payload;
    },
    getLoginUserDataSuccess(state, action) {
      state.loginUserData = action.payload;
    },
    getUsersLoading(state, action) {
      state.loading = action.payload;
    },
    actionLoadingSuccess(state, action) {
      state.actionLoading = action.payload;
    },
    getAuthorityDataSuccess(state, action) {
      state.authoritymanager = action.payload;
    }
  }
});

export const {
  hasError,
  getAllUserSuccess,
  getLoginUserDataSuccess,
  getSingleUserSuccess,
  actionLoadingSuccess,
  getUsersLoading,
  getAllUserTotalCount,
  hasActionError,
  getAuthorityDataSuccess
} = slice.actions;

//----------------------------  single user ------------------------------//

export const getSingleUser = (id?: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(getUsersLoading(true));
    try {
      const response = await getData(`/users/${id}`);
      dispatch(getSingleUserSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
    dispatch(getUsersLoading(false));
  };
};

export const getLoginUserData = (id: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(getUsersLoading(true));
    try {
      const response = await getData(`/users/${id}`);
      dispatch(getLoginUserDataSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
    dispatch(getUsersLoading(false));
  };
};

export function updateSingleUser(id: string, data: any, handleClear: () => void) {
  return async () => {
    dispatch(actionLoadingSuccess(true));
    try {
      const response = await patchData(`/users/${id}`, data);

      handleClear();
      toast.success(response?.message);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    }
    dispatch(actionLoadingSuccess(false));
  };
}

export function updateTourStatus() {
  return async () => {
    try {
      await putData(`/users/update-tour-status`, {});
      // We don't necessarily need to update the entire user state here
      // but we could refresh it if needed
      // dispatch(getLoginUserData(userRole._id));
    } catch (error) {
      console.error('Error updating tour status', error);
    }
  };
}
export const createUser = (data: any, handleClear: () => void) => {
  return async (dispatch: AppDispatch) => {
    dispatch(actionLoadingSuccess(true));
    try {
      const response = await postData('/users', data);
      dispatch(getAllUserSuccess(response.data.items));
      dispatch(getAllUserTotalCount(response.data.count));
      toast.success(response?.message);
      handleClear();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(actionLoadingSuccess(false));
    }
  };
};

export const getAllUsers = (filterQuery?: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(getUsersLoading(true));
    try {
      const response = await getData(`/users/get-all${filterQuery ?? ''}`);
      dispatch(getAllUserSuccess(response.data));
      dispatch(getAllUserTotalCount(response.total));
      // toast.success(response?.message);
    } catch (error) {
      dispatch(hasError(error));
    }
    dispatch(getUsersLoading(false));
  };
};

export function updateAllUser(id: string, data: any, handleClear: () => void) {
  return async () => {
    dispatch(actionLoadingSuccess(true));
    try {
      const response = await patchData(`/users/${id}`, data);
      handleClear();
      toast.success(response?.message);
      dispatch(hasError(''));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasError(errorMessage));
    }
    dispatch(actionLoadingSuccess(false));
  };
}

export function deleteUser(id: string, handleClose?: () => void) {
  return async (dispatch: AppDispatch) => {
    dispatch(actionLoadingSuccess(true));
    try {
      const response = await deleteData(`/users/${id}`);
      toast.success(response?.message);
      handleClose?.();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(actionLoadingSuccess(false));
    }
  };
}

export const getAuthorityManagerData = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(getUsersLoading(true));
    try {
      const response = await getData(`/users/org-chart`);
      dispatch(getAuthorityDataSuccess(response));
    } catch (error) {
      dispatch(hasError(error));
    }
    dispatch(getUsersLoading(false));
  };
};

export const importUsers = (payload: any, callback?: (res: any) => void) => {
  return async (dispatch: AppDispatch) => {
    dispatch(actionLoadingSuccess(true));
    try {
      const response = await postData('users/import', payload);
      toast.success(response?.message || 'Users imported successfully');
      callback?.(response);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
      toast.error(errorMessage);
    } finally {
      dispatch(actionLoadingSuccess(false));
    }
  };
};

export default slice.reducer;


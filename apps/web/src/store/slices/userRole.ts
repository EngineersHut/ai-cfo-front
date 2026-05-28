import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps } from '@/types';
import { deleteData, getData, patchData, postData, putData } from '@/utils/apiHelper';
import { AppDispatch } from '..';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { dispatch } from '../index';
import { getErrorMessage } from '@/utils/common';

const initialState: DefaultRootStateProps['userRole'] = {
  error: null,
  allUserRole: [],
  loading: false,
  deleteActionError: null,
  createError: null,
  count: 0,
  actionLoading: false
};

const slice = createSlice({
  name: 'userRole',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    hasDeleteActionError(state, action) {
      state.deleteActionError = action.payload;
    },
    hasCreateActionError(state, action) {
      state.createError = action.payload;
    },
    getAllUserRoleSuccess(state, action) {
      state.allUserRole = action.payload;
    },
    getAllUserRoleTotalCount(state, action) {
      state.count = action.payload;
    },
    getUserRoleLoading(state, action) {
      state.loading = action.payload;
    },
    actionLoadingSuccess(state, action) {
      state.actionLoading = action.payload;
    }
  }
});

export const {
  hasError,
  getAllUserRoleSuccess,
  actionLoadingSuccess,
  getUserRoleLoading,
  getAllUserRoleTotalCount,
  hasDeleteActionError,
  hasCreateActionError
} = slice.actions;

export const getAllUserRoles = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(getUserRoleLoading(true));
    try {
      const response = await getData(`/user-roles`);
      dispatch(getAllUserRoleSuccess(response.data.items));
      dispatch(getAllUserRoleTotalCount(response.data.count));
    } catch (error) {
      dispatch(hasError(error));
    }
    dispatch(getUserRoleLoading(false));
  };
};

// export const getSingleUserRole = (id?: string) => {
//   return async (dispatch: AppDispatch) => {
//     dispatch(getUserRoleLoading(true));
//     try {
//       const response = await getData(`/user-roles/${id}`);
//       dispatch(getSingleUserSuccess(response.data));
//     } catch (error) {
//       dispatch(hasError(error));
//     }
//     dispatch(getUserRoleLoading(false));
//   };
// };

export const createUserRole = (data: any, handleClear: () => void) => {
  return async (dispatch: AppDispatch) => {
    dispatch(actionLoadingSuccess(true));
    try {
      const response = await postData('/user-roles', data);
      dispatch(getAllUserRoles());
      toast.success(response?.message);
      handleClear();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasCreateActionError(errorMessage));
    }
    dispatch(actionLoadingSuccess(false));
  };
};

export function updateUserRole(id: string, data: any, handleClear: () => void) {
  return async () => {
    dispatch(actionLoadingSuccess(true));
    try {
      const response = await patchData(`/user-roles/${id}`, data);
      dispatch(getAllUserRoles());
      handleClear();
      toast.success(response?.message);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasCreateActionError(errorMessage));
    }
    dispatch(actionLoadingSuccess(false));
  };
}

export function updateAllUser(id: string, data: any, handleClear: () => void) {
  return async () => {
    dispatch(actionLoadingSuccess(true));
    try {
      const response = await patchData(`/user-roles/${id}`, data);
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

export function deleteUserRole(id: string, handleClear: () => void) {
  return async (dispatch: AppDispatch) => {
    dispatch(actionLoadingSuccess(true));
    try {
      const response = await deleteData(`/user-roles/${id}`);
      toast.success(response?.message);
      handleClear();
      dispatch(getAllUserRoles());
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasDeleteActionError(errorMessage));
    }
    dispatch(actionLoadingSuccess(false));
  };
}

export default slice.reducer;

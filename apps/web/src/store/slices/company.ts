import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps, } from '@/types';
import { deleteData, getData, patchData, postData } from '@/utils/apiHelper';
import { AppDispatch, dispatch } from '../index';
import { getErrorMessage } from '@/utils/common';

const initialState: DefaultRootStateProps['company'] = {
  companies: [],
  error: null,
  actionError: null,
  loading: false,
  actionLoading: false,
};

const slice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    hasActionError(state, action) {
      state.actionError = action.payload;
    },
    getCompaniesLoading(state, action) {
      state.loading = action.payload;
    },
    actionLoadingSuccess(state, action) {
      state.actionLoading = action.payload;
    },
    getCompaniesSuccess(state, action) {
      state.companies = action.payload;
      
    }
    
   
  }
});

export const {
  hasError,
  hasActionError,
  getCompaniesLoading,
  actionLoadingSuccess,
  getCompaniesSuccess,
 
} = slice.actions;

//----------------------------  Company Thunks ------------------------------//

export const getAllCompanies = (query = '') => {
  return async (dispatch: AppDispatch) => {
    dispatch(getCompaniesLoading(true));
    try {
      const response = await getData(`/api/company${query}`);
      dispatch(getCompaniesSuccess(response));
    } catch (error) {
      dispatch(hasError(error));
    }
    dispatch(getCompaniesLoading(false));
  };
};

export const createCompany = (data: any, handleClear: () => void) => {
  return async (dispatch: AppDispatch) => {
    dispatch(actionLoadingSuccess(true));
    try {
      const response = await postData('/api/company', data);
      handleClear?.();
      dispatch(getAllCompanies());
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(actionLoadingSuccess(false));
    }
  };
};

export const deleteCompany = (id: string, callback: () => void) => {
  return async (dispatch: AppDispatch) => {
    dispatch(actionLoadingSuccess(true));
    try {
      const response = await deleteData(`/api/company/${id}`);
      callback();
      dispatch(getAllCompanies());
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
    } finally {
      dispatch(actionLoadingSuccess(false));
    }
  };
};



export const updateCompany = (id: string, data: any, callback: () => void) => {
  return async (dispatch: AppDispatch) => {
    dispatch(actionLoadingSuccess(true));
    try {
      const response = await patchData(`/api/company/${id}`, data);
      callback();
      dispatch(getAllCompanies());
      return true;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(hasActionError(errorMessage));
      return false;
    } finally {
      dispatch(actionLoadingSuccess(false));
    }
  };
};

export default slice.reducer;

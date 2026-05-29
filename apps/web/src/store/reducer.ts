// third party
import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/auth';
import userReducer from './slices/user';
import dashboardReducer from './slices/dashboard';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  dashboard: dashboardReducer,
});

export default reducer;

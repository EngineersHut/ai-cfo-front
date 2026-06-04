// third party
import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/auth';
import userReducer from './slices/user';
import dashboardReducer from './slices/dashboard';
import companyReducer from './slices/company';
import notificationReducer from './slices/notification';
import reportReducer from './slices/report';
import operationalReducer from './slices/operational';
import growthReducer from './slices/growth';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  dashboard: dashboardReducer,
  company: companyReducer,
  notification: notificationReducer,
  report: reportReducer,
  operational: operationalReducer,
  growth: growthReducer,
});

export default reducer;

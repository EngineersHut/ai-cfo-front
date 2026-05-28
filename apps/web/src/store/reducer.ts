// third party
import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/auth';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  
  
  auth: authReducer,
 
});

export default reducer;

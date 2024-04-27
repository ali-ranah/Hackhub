// store.js
import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './Reducers/roleSlice';
import emailReducer from './Reducers/emailSlice';
import tokenReducer from './Reducers/tokenSlice';
const Store = configureStore({
  reducer: {
    role: roleReducer,
    email: emailReducer,
    token:tokenReducer
  },
});

export default Store;

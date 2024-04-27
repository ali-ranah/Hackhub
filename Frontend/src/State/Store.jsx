// store.js
import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './Reducers/roleSlice';
import emailReducer from './Reducers/emailSlice';
import lastUpdateReducers from './Reducers/lastUpdateReducers';
import tokenReducer from './Reducers/tokenSlice';
import nameReducer from './Reducers/nameSlice';
import eventIdReducer from './Reducers/eventIdSlice';
const Store = configureStore({
  reducer: {
    role: roleReducer,
    email: emailReducer,
    lastUpdate: lastUpdateReducers,
    token:tokenReducer,
    name:nameReducer,
    eventId:eventIdReducer
  },
});

export default Store;

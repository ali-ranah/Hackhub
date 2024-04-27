// tokenSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const { setToken } = tokenSlice.actions;

// Selector function to select the email from the state
export const selectToken = (state) => state.token.token;

export default tokenSlice.reducer;

export const setTokenAction = (token) => (dispatch) => {
  dispatch(setToken(token));
  localStorage.setItem('token', token);
};

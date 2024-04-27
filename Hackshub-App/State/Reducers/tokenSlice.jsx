// tokenSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const setTokenAction = (token) => async (dispatch) => {
  dispatch(setToken(token));
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.error('Error storing token in AsyncStorage:', error.message);
  }
};

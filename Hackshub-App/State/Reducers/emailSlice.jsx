// emailSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  email: null,
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
  },
});

export const { setEmail } = emailSlice.actions;

// Selector function to select the email from the state
export const selectEmail = (state) => state.email.email;

export default emailSlice.reducer;

export const setEmailAction = (email) => async (dispatch) => {
  dispatch(setEmail(email));
  try {
    await AsyncStorage.setItem('email', email);
  } catch (error) {
    console.error('Error storing email in AsyncStorage:', error.message);
  }
};

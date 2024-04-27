// RoleSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  selectedRole: null,
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole(state, action) {
      state.selectedRole = action.payload;
    },
  },
});

export const { setRole } = roleSlice.actions;

// Selector function to select the selectedRole from the state
export const selectSelectedRole = (state) => state.role.selectedRole;

export default roleSlice.reducer;

export const setSelectedRole = (role) => async (dispatch) => {
  if (role === null) {
    await AsyncStorage.removeItem('selectedRole');
  } else {
    await AsyncStorage.setItem('selectedRole', role);
  }
  dispatch(setRole(role));
};

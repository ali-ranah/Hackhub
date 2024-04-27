// RoleSlice.js
import { createSlice } from '@reduxjs/toolkit';

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


export const setSelectedRole = (role) => (dispatch) => {
  if (role === null) {
    localStorage.removeItem('selectedRole');
  } else {
    localStorage.setItem('selectedRole', role);
  }
  dispatch(setRole(role));
};

// eventIdSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  eventId: null,
};

const eventIdSlice = createSlice({
  name: 'eventId',
  initialState,
  reducers: {
    setEventId(state, action) {
      state.eventId = action.payload;
    },
  },
});

export const { setEventId } = eventIdSlice.actions;

// Selector function to select the eventId from the state
export const selectEventId = (state) => state.eventId.eventId;

export default eventIdSlice.reducer;

export const setEventIdAction = (eventId) => (dispatch) => {
  dispatch(setEventId(eventId));
  localStorage.setItem('eventId', eventId);
};

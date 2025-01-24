import { createSlice } from '@reduxjs/toolkit';

const diarySlice = createSlice({
  name: 'diary',
  initialState: {
    entries: [],
  },
  reducers: {
    saveEntry: (state, action) => {
      const index = state.entries.findIndex((entry) => entry._id === action.payload._id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      } else {
        state.entries.push(action.payload);
      }
    },
    deleteEntry: (state, action) => {
      state.entries = state.entries.filter((entry) => entry._id !== action.payload);
    },
  },
});

export const { saveEntry, deleteEntry } = diarySlice.actions;
export default diarySlice.reducer;

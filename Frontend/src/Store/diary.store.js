import { createSlice } from '@reduxjs/toolkit';

const diarySlice = createSlice({
  name: 'diary',
  initialState: {
    entries: [], // Array of diary entries
  },
  reducers: {
    addEntry: (state, action) => {
      const existingEntry = state.entries.find((entry) => entry.id === action.payload.id);
      if (!existingEntry) {
        state.entries.push(action.payload);
      }
    },
    deleteEntry: (state, action) => {
      state.entries = state.entries.filter((entry) => entry.id !== action.payload);
    },
    updateEntry: (state, action) => {
      const index = state.entries.findIndex((entry) => entry.id === action.payload.id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },
  },
});

export const { addEntry, deleteEntry, updateEntry } = diarySlice.actions;
export default diarySlice.reducer;

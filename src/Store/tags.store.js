import { createSlice } from '@reduxjs/toolkit';

const tagsSlice = createSlice({
  name: 'tags',
  initialState: {
    tags: [],
  },
  reducers: {
    setTags: (state, action) => {
      // Replace the existing tags array with the new one
      state.tags = action.payload;
    },
    addTag: (state, action) => {
      // Avoid adding duplicates
      const exists = state.tags.some((tag) => tag._id === action.payload._id);
      if (!exists) {
        state.tags.push(action.payload);
      }
    },
    removeTag: (state, action) => {
      // Remove tag by its ID
      state.tags = state.tags.filter((tag) => tag._id !== action.payload);
    },
    updateTag: (state, action) => {
      // Update tag if it exists
      const index = state.tags.findIndex((tag) => tag._id === action.payload._id);
      if (index !== -1) {
        state.tags[index] = action.payload;
      }
    },
  },
});

export const { setTags, addTag, removeTag, updateTag } = tagsSlice.actions;
export default tagsSlice.reducer;

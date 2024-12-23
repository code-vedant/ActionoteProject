import { createSlice } from '@reduxjs/toolkit';

const tagsSlice = createSlice({
  name: 'tags',
  initialState: {
    tags: [],
  },
  reducers: {
    addTag: (state, action) => {
      state.tags.push(action.payload);
    },
    removeTag: (state, action) => {
      state.tags = state.tags.filter((tag) => tag.id !== action.payload);
    },
    updateTag: (state, action) => {
      const index = state.tags.findIndex((tag) => tag.id === action.payload.id);
      if (index !== -1) {
        state.tags[index] = action.payload;
      }
    },
  },
});

export const { addTag, removeTag, updateTag } = tagsSlice.actions;
export default tagsSlice.reducer;
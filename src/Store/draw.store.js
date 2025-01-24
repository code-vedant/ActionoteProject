import { createSlice } from '@reduxjs/toolkit';

const drawSlice = createSlice({
  name: 'draw',
  initialState: {
    drawings: [], // Array of drawings
  },
  reducers: {
    addDrawing: (state, action) => {
      state.drawings.push(action.payload);
    },
    deleteDrawing: (state, action) => {
      state.drawings = state.drawings.filter((drawing) => drawing.id !== action.payload);
    },
    updateDrawing: (state, action) => {
      const index = state.drawings.findIndex((drawing) => drawing.id === action.payload.id);
      if (index !== -1) {
        state.drawings[index] = action.payload;
      }
    },
  },
});

export const { addDrawing, deleteDrawing, updateDrawing } = drawSlice.actions;
export default drawSlice.reducer;

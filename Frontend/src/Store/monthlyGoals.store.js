import { createSlice } from '@reduxjs/toolkit';

const monthlyGoalsSlice = createSlice({
  name: 'monthlyGoals',
  initialState: {
    goals: [],
  },
  reducers: {
    addGoal: (state, action) => {
      state.goals.push(action.payload);
    },
    removeGoal: (state, action) => {
      state.goals = state.goals.filter((goal) => goal.id !== action.payload);
    },
    updateGoal: (state, action) => {
      const index = state.goals.findIndex((goal) => goal.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },
  },
});

export const { addGoal, removeGoal, updateGoal } = monthlyGoalsSlice.actions;
export default monthlyGoalsSlice.reducer;

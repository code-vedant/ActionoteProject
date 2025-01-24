import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todos: [],
  },
  reducers: {
    saveTodo: (state, action) => {
      const index = state.todos.findIndex((todo) => todo._id === action.payload._id);
      if (index !== -1) {
        state.todos[index] = { ...state.todos[index], ...action.payload };
      } else {
        state.todos.push(action.payload);
      }
    },
    removeTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo._id !== action.payload);
    },
  },
});

export const { saveTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;

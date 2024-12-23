import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todos: [], // Array of todos
  },
  reducers: {
    addTodo: (state, action) => {
      // Avoid adding duplicate todos by checking IDs
      if (!state.todos.some((todo) => todo.id === action.payload.id)) {
        state.todos.push(action.payload);
      }
    },
    removeTodo: (state, action) => {
      // Filter out the todo by ID
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    updateTodo: (state, action) => {
      const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        // Merge updated data with existing todo
        state.todos[index] = { ...state.todos[index], ...action.payload };
      }
    },
  },
});

export const { addTodo, removeTodo, updateTodo } = todoSlice.actions;
export default todoSlice.reducer;

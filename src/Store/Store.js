import { configureStore } from "@reduxjs/toolkit";
import authSlice, { login as loginAction } from "./auth.store.js";
import todoSlice from "./todo.store.js";
import tagsSlice from "./tags.store.js";
import diarySlice from "./diary.store.js";
import notesSlice from "./notes.store.js";
import drawSlice from "./draw.store.js";
import monthlyGoalsSlice from "./monthlyGoals.store.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    todo: todoSlice,
    tags: tagsSlice,
    diary: diarySlice,
    notes: notesSlice,
    draw: drawSlice,
    monthlyGoals: monthlyGoalsSlice,
  },
});

// Load initial state from sessionStorage
const accessToken = sessionStorage.getItem("accessToken");
const refreshToken = sessionStorage.getItem("refreshToken");
const storedUser = sessionStorage.getItem("user");

if (accessToken && refreshToken && storedUser) {
  try {
    const user = JSON.parse(storedUser);
    store.dispatch(
      loginAction({
        user,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    console.error("Failed to parse stored user data:", error);
    sessionStorage.clear();
  }
}

export default store;
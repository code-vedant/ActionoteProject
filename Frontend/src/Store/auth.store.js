import { createSlice } from "@reduxjs/toolkit";

// Load initial state from sessionStorage
const accessToken = sessionStorage.getItem("accessToken");
const refreshToken = sessionStorage.getItem("refreshToken");
const storedUser = sessionStorage.getItem("user");

const initialState = {
  status: !!accessToken && !!refreshToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: accessToken || null,
  refreshToken: refreshToken || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.status = true;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);
    },
    logout: (state) => {
      state.status = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      sessionStorage.removeItem("user");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      sessionStorage.setItem("accessToken", action.payload);
    },
  },
});

export const { login, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;

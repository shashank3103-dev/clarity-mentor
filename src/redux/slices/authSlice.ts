import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    onboarded: false,
  },
  reducers: {
    completeOnboarding: (s) => {
      s.onboarded = true;
    },
    loginSuccess: (s, a) => {
      s.user = a.payload || {
        name: "Bhanu Pratap",
        role: "Software Developer",
      };
      s.token = "mock-token";
      s.isAuthenticated = true;
    },
    logout: (s) => {
      s.user = null;
      s.token = null;
      s.isAuthenticated = false;
    },
  },
});
export const { completeOnboarding, loginSuccess, logout } = slice.actions;
export default slice.reducer;

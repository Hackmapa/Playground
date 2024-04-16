import { createSlice } from "@reduxjs/toolkit";

const initialState: string = "";

export const tokenSlice = createSlice({
  name: "token",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state = action.payload;

      return state;
    },
    logout: (state) => {
      state = "";

      return state;
    },
  },
});

export const { login, logout } = tokenSlice.actions;

export default tokenSlice.reducer;

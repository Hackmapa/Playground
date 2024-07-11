import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../Interfaces/User";

const initialState: User = {
  id: 0,
  username: "",
  firstname: "",
  lastname: "",
  password: "",
  email: "",
  games: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    addUser: (state, action) => {
      state = action.payload;

      return state;
    },
    removeUser: (state) => {
      state = initialState;

      return state;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;

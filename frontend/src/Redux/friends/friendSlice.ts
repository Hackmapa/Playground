import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../Interfaces/User";

const initialState: User[] = [];

export const friendSlice = createSlice({
  name: "friends",
  initialState: initialState,
  reducers: {
    addFriends: (state, action) => {
      state = action.payload;

      return state;
    },
  },
});

export const { addFriends } = friendSlice.actions;

export default friendSlice.reducer;

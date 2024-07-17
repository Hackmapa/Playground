import { createSlice } from "@reduxjs/toolkit";
import { SocketUser } from "../../Interfaces/SocketUser";
import { removeUser } from "../user/userSlice";

const initialState: SocketUser[] = [];

export const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    setUsers: (state, action) => {
      state = action.payload;

      return state;
    },

    removeUsers: (state) => {
      state = initialState;

      return state;
    },
  },
});

export const { setUsers, removeUsers } = usersSlice.actions;

export default usersSlice.reducer;

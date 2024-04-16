import { createSlice } from "@reduxjs/toolkit";
import { SocketUser } from "../../Interfaces/SocketUser";

const initialState: SocketUser[] = [];

export const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    setUsers: (state, action) => {
      state = action.payload;

      return state;
    },
  },
});

export const { setUsers } = usersSlice.actions;

export default usersSlice.reducer;

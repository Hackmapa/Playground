import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../Interfaces/User";

const initialState: User = {
  id: 0,
  email: "",
  userIdentifier: "",
  roles: [],
  password: "",
  currency: 0,
  username: "",
  firstname: "",
  lastname: "",
  badges: [],
  profile_picture: "",
  notificationUsers: [],
  notificationFriends: [],
  winnedGames: [],
  games: [],
  ready: false, // Assuming default value
  owner: false, // Assuming default value
  createdAt: new Date(),
  updatedAt: new Date(),
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
    updateProfilePicture: (state, action) => {
      state.profile_picture = action.payload;

      return state;
    },
  },
});

export const { addUser, removeUser, updateProfilePicture } = userSlice.actions;

export default userSlice.reducer;

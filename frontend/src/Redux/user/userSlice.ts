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
  profilePicture: "",
  notificationUsers: [],
  notificationFriends: [],
  winnedGames: [],
  games: [],
  ready: false, // Assuming default value
  owner: false, // Assuming default value
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    addUser: (state, action) => {
      const {
        id,
        email,
        userIdentifier,
        roles,
        password,
        currency,
        username,
        firstname,
        lastname,
        badges,
        profilePicture,
        ready,
        owner,
      } = action.payload;

      return {
        ...state,
        id,
        email,
        userIdentifier,
        roles,
        password,
        currency,
        username,
        firstname,
        lastname,
        badges,
        profilePicture,
        ready,
        owner,
      };
    },
    removeUser: (state) => {
      state = initialState;

      return state;
    },
    updateProfilePicture: (state, action) => {
      state.profilePicture = action.payload;

      return state;
    },
  },
});

export const { addUser, removeUser, updateProfilePicture } = userSlice.actions;

export default userSlice.reducer;

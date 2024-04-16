import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import tokenSlice from "./token/tokenSlice";
import usersSlice from "./users/usersSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    token: tokenSlice,
    users: usersSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

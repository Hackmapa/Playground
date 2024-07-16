import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import tokenSlice from "./token/tokenSlice";
import usersSlice from "./users/usersSlice";
import tttRoomSlice from "./rooms/tttRoomSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import notificationSlice from "./notifications/notificationSlice";
import friendSlice from "./friends/friendSlice";
import rpsRoomSlice from "./rooms/rpsRoomSlice";
import connectFourRoomSlice from "./rooms/connectFourSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["token", "user"],
};

const reducers = combineReducers({
  user: userSlice,
  token: tokenSlice,
  users: usersSlice,
  tttRoom: tttRoomSlice,
  rpsRoom: rpsRoomSlice,
  connectFourRoom: connectFourRoomSlice,
  notifications: notificationSlice,
  friends: friendSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

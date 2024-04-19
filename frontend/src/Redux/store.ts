import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import tokenSlice from "./token/tokenSlice";
import usersSlice from "./users/usersSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["token"],
};

const reduceur = combineReducers({
  user: userSlice,
  token: tokenSlice,
  users: usersSlice,
});

const persistedReducer = persistReducer(persistConfig, reduceur);

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

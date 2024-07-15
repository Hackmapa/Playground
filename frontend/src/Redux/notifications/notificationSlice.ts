import { createSlice } from "@reduxjs/toolkit";
import { Notification } from "../../Interfaces/Notification";

const initialState: Notification[] = [];

export const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {
    addNotifications: (state, action) => {
      state = action.payload;

      return state;
    },

    addNotification: (state, action) => {
      state = [...state, action.payload];

      return state;
    },

    removeNotification: (state, action) => {
      state = state.filter(
        (notification) => notification.notification.id !== action.payload
      );

      return state;
    },
  },
});

export const { addNotifications, addNotification, removeNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;

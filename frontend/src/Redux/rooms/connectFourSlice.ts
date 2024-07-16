import { createSlice } from "@reduxjs/toolkit";
import { ConnectFourRoom } from "../../Interfaces/Rooms";

const initialState: ConnectFourRoom = {
  id: 0,
  name: "",
  players: [],
  maxPlayers: 0,
  messages: [],
  started: false,
  finished: false,
  turn: 0,
  moves: [],
  currentBoard: Array(6)
    .fill(null)
    .map(() => Array(7).fill(null)),
  currentPlayer: {
    symbol: "",
    user: null,
  },
  winner: {
    symbol: "",
    user: null,
  },
  draw: false,
  gameTag: "",
};

export const connectFourRoomSlice = createSlice({
  name: "connectFourRoom",
  initialState: initialState,
  reducers: {
    addConnectFourRoom: (state, action) => {
      state = action.payload;

      return state;
    },
    updateConnectFourRoom: (state, action) => {
      state = action.payload;

      return state;
    },
    removeConnectFourRoom: (state) => {
      state = initialState;

      return state;
    },
  },
});

export const {
  addConnectFourRoom,
  updateConnectFourRoom,
  removeConnectFourRoom,
} = connectFourRoomSlice.actions;

export default connectFourRoomSlice.reducer;

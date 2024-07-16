import { createSlice } from "@reduxjs/toolkit";
import { RpsRoom } from "../../Interfaces/Rooms";

const initialState: RpsRoom = {
  id: 0,
  name: "",
  players: [],
  maxPlayers: 0,
  messages: [],
  started: false,
  finished: false,
  turn: 0,
  moves: [],
  currentPlayer: {
    symbol: "",
    user: null,
  },
  winner: {
    symbol: "",
    user: null,
  },
  gameTag: "",
  draw: false,
  roundWinners: [],
};

export const rpsRoomSlice = createSlice({
  name: "rpsRoom",
  initialState: initialState,
  reducers: {
    addRpsRoom: (state, action) => {
      state = action.payload;

      return state;
    },
    updateRpsRoom: (state, action) => {
      state = action.payload;

      return state;
    },
    removeRpsRoom: (state) => {
      state = initialState;

      return state;
    },
  },
});

export const { addRpsRoom, updateRpsRoom, removeRpsRoom } =
  rpsRoomSlice.actions;

export default rpsRoomSlice.reducer;

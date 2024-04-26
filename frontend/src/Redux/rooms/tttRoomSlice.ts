import { createSlice } from "@reduxjs/toolkit";
import { TttRoom } from "../../Interfaces/Rooms";

const initialState: TttRoom = {
  id: 0,
  name: "",
  players: [],
  maxPlayers: 0,
  messages: [],
  started: false,
  finished: false,
  turn: 0,
  moves: [],
  currentBoard: Array(9).fill("null"),
  currentPlayer: {
    symbol: "",
    user: null,
  },
  winner: {
    symbol: "",
    user: null,
  },
  draw: false,
};

export const tttRoomSlice = createSlice({
  name: "tttRoom",
  initialState: initialState,
  reducers: {
    addTttRoom: (state, action) => {
      state = action.payload;

      return state;
    },
    updateTttRoom: (state, action) => {
      state = action.payload;

      return state;
    },
    removeTttRoom: (state) => {
      state = initialState;

      return state;
    },
  },
});

export const { addTttRoom, updateTttRoom, removeTttRoom } =
  tttRoomSlice.actions;

export default tttRoomSlice.reducer;

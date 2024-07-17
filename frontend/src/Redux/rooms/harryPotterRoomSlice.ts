import { createSlice } from "@reduxjs/toolkit";
import { HarryPotterRoom } from "../../Interfaces/Rooms";

const initialState: HarryPotterRoom = {
  characters: [],
  logs: [],
  results: {
    winner: null,
    loser: null,
  },
  currentTurn: 0,
  started: false,
  moves: [],
  turn: 0,
  currentPlayer: {
    user: null,
  },
  id: 0,
  name: "",
  players: [],
  maxPlayers: 0,
  messages: [],
  winner: {
    user: null,
  },
  finished: false,
  gameTag: "harry-potter",
  draw: false,
  game: {
    characters: [],
    currentTurn: 0,
    started: false,
    finished: false,
    logs: [],
  },
};

const harryPotterRoomSlice = createSlice({
  name: "harryPotterRoom",
  initialState: initialState,
  reducers: {
    setHarryPotterRoom: (state, action) => {
      state = action.payload;

      return state;
    },

    updateHarryPotterRoom: (state, action) => {
      return (state = action.payload);
    },

    removeHarryPotterRoom: (state) => {
      return (state = initialState);
    },
  },
});

export const {
  setHarryPotterRoom,
  updateHarryPotterRoom,
  removeHarryPotterRoom,
} = harryPotterRoomSlice.actions;

export default harryPotterRoomSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { ConnectFourRoom, HarryPotterRoom } from "../../Interfaces/Rooms";

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
  gameTag: "",
  draw: false,
};

const harryPotterRoomSlice = createSlice({
  name: "HarryPotterRoom",
  initialState,
  reducers: {
    setHarryPotterRoom: (state, action) => {
      return (state = action.payload);
    },

    updateHarryPotterRoom: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setHarryPotterRoom, updateHarryPotterRoom } =
  harryPotterRoomSlice.actions;

export default harryPotterRoomSlice.reducer;

import { User } from "./User";

export interface TttRoom {
  id: number;
  name: string;
  players: User[];
  maxPlayers: number;
  messages: [];
  started: boolean;
  finished: boolean;
  turn: number;
  moves: [];
  currentBoard: any[];
  currentPlayer: Player;
  winner: Player;
  draw: boolean;
  privateRoom?: boolean;
  password?: string;
}

interface Player {
  user: User | null;
  symbol: string;
}

import { User } from "./User";

export interface TttRoom extends DefaultRoom {
  turn: number;
  moves: [];
  currentBoard: any[];
  currentPlayer: Player;
  draw: boolean;
}

export interface RpsRoom extends DefaultRoom {
  turn: number;
  moves: any[];
  currentPlayer: Player;
  roundWinners: User[] | string[];
}

export interface DefaultRoom {
  id: number;
  name: string;
  players: User[];
  maxPlayers: number;
  messages: [];
  privateRoom?: boolean;
  password?: string;
  winner: Player;
  started: boolean;
  finished: boolean;
  gameTag: string;
  draw: boolean;
}

interface Player {
  user: User | null;
  symbol: string;
}

export type Room = TttRoom | RpsRoom;

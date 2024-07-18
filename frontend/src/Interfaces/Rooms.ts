import { Message } from "postcss";
import { Character } from "./HarryPotter/Character";
import { Log } from "./Log";
import { User } from "./User";
import { HarryPotterGame } from "./HarryPotter/HarryPotterGame";

export interface TttRoom extends DefaultRoom {
  turn: number;
  moves: any[];
  currentBoard: any[];
  currentPlayer: Player;
  draw: boolean;
}

export interface ConnectFourRoom extends DefaultRoom {
  turn: number;
  moves: any[];
  currentBoard: any[];
  currentPlayer: Player;
  draw: boolean;
}

export interface RpsRoom extends DefaultRoom {
  turn: number;
  currentPlayer: Player;
  roundWinners: User[] | string[];
  moves: any[];
}

export interface HarryPotterRoom extends DefaultRoom {
  characters: Character[];
  logs: Log[];
  results: {
    winner: Character | null;
    loser: Character | null;
  };
  currentTurn: number;
  started: boolean;
  moves: any[];
  turn: number;
  currentPlayer: Player;
  game: HarryPotterGame;
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
  moves: any[];
  turn: number;
  currentPlayer: Player;
  logs?: Log[];
}

interface Player {
  user: User | null;
  symbol?: string;
  color?: string;
}

export type Room =
  | TttRoom
  | RpsRoom
  | ConnectFourRoom
  | HarryPotterRoom
  | DefaultRoom;

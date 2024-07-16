import { Game } from "./Game";
import { RpsRoom, TttRoom } from "./Rooms";
import { User } from "./User";

export interface Turn {
  id: number;
  game: Game;
  timestamp: string;
  state: TttRoom | RpsRoom;
}

export interface Round {
  move: string;
  user: User;
  winner: User | string;
}

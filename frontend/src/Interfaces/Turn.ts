import { Game } from "./Game";
import { TttRoom } from "./Rooms";

export interface Turn {
  id: number;
  game: Game;
  timestamp: string;
  state: TttRoom;
}

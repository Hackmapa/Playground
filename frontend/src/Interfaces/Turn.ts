import { Game } from "./Game";

export interface Turn {
  id: number;
  game: Game;
  timestamp: string;
  state: string;
}

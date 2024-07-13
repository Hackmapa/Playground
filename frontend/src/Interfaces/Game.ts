import { Turn } from "./Turn";
import { User } from "./User";

export interface GameInfos {
  id: number;
  name: string;
  description: string;
  link: string;
  image: string;
}

export interface Game {
  id: number;
  winner: User;
  players: User[];
  game_id: number;
  finished: boolean;
  draw: boolean;
  turns: Turn[];
}

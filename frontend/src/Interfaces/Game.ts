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
  gameId: number;
  finished: boolean;
  draw: boolean;
}

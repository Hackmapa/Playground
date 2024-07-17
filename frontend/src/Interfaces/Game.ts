import { Character } from "./HarryPotter/Character";
import { Round, Turn } from "./Turn";
import { User } from "./User";

export interface GameInfos {
  id: number;
  name: string;
  description: string;
  link: string;
  video?: string;
  image: string;
  tag: string;
  difficulty: string;
  players: number;
  howToPlay: string;
}

export interface Game {
  id: number;
  winner: User;
  players: User[];
  game_id: number;
  finished: boolean;
  draw: boolean;
  turns: Turn[];
  rounds?: Round[];
  createdAt: Date;
  updatedAt: Date;
  characters?: Character[];
}

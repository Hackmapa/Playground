import { Game } from "./Game";

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  ready?: boolean;
  owner?: boolean;
  games: Game[];
}

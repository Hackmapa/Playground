import { Game } from "./Game";

export interface User {
  id: number;
  email: string;
  userIdentifier: string;
  roles: string[];
  password: string;
  currency: number;
  username: string;
  firstname: string;
  lastname: string;
  badges: string[];
  profilePicture: string;
  notificationUsers?: User[];
  notificationFriends?: User[];
  winnedGames?: Game[];
  games?: Game[];
  ready?: boolean;
  owner?: boolean;
}

import { Badge } from "./Badges";
import { Game } from "./Game";
import { Character } from "./HarryPotter/Character";

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
  badges: Badge[];
  profile_picture: string;
  notificationUsers?: User[];
  notificationFriends?: User[];
  friendships?: any;
  winnedGames?: Game[];
  games?: Game[];
  ready?: boolean;
  owner?: boolean;
  createdAt: Date;
  updatedAt: Date;
  symbol?: string;
  character?: Character;
}

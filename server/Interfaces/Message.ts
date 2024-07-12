import { User } from "./User.ts";

export interface Message {
  message: string;
  user: User;
  date: string;
  type?: string;
}

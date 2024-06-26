import { User } from "./User";

export interface Message {
  message: string;
  user: User;
  date: string;
  type?: string;
}

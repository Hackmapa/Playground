import { User } from "./User";

export interface Notification {
  id: string | number;
  notification: {
    id: string | number;
    type: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    isNew: boolean;
    isDismissed: boolean;
    notificationUsers: number[];
  };
  user: User;
  friend?: User;
}

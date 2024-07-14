import { toast } from "react-toastify";
import { post } from "./requests/post";
import { User } from "../Interfaces/User";

export const addBadge = async (
  badgeTag: string,
  userId: number,
  token: string
) => {
  const response = await post(`users/${userId}/badges/${badgeTag}`, {}, token);

  toast.success("Nouveau badge obtenu !");

  return response;
};

export const checkIfUserHasBadge = (user: User, tag: string) => {
  const badge = user.badges.find((badge) => badge.tag === tag);

  if (badge) {
    return true;
  }

  return false;
};

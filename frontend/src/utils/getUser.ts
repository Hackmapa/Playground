import { toast } from "react-toastify";
import { addUser } from "../Redux/user/userSlice";
import { get } from "./requests/get";

export const getUser = async (dispatch: any, token: string) => {
  try {
    const response = await get("users/me", token);
    const user = response;

    if (response.code === 401) {
      throw new Error("User Fetch Error");
    }

    dispatch(addUser(user));
  } catch (error) {
    toast.error(`${error}`);
    return;
  }
};

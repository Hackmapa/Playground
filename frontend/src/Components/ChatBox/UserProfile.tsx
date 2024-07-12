import React, { useState } from "react";
import { User } from "../../Interfaces/User";
import { Button } from "../Button/Button";
import { post } from "../../utils/requests/post";
import { useAppSelector } from "../../hooks/hooks";
import { toast } from "react-toastify";
import { socket } from "../../socket";

interface UserProfileProps {
  user: User;
}

export const UserProfile = (props: UserProfileProps) => {
  const { user } = props;

  const actualUser = useAppSelector((state) => state.user);
  const token = useAppSelector((state) => state.token);

  const [hasSentRequest, setHasSentRequest] = useState(false);

  const handleAddFriend = async () => {
    const response = await post(
      `friends/${actualUser.id}/add/${user.id}`,
      {},
      token
    );

    if (response.status === 404 || response.status === 409) {
      return toast.error(response.message);
    } else {
      toast.success(response.message);
      setHasSentRequest(true);
      socket.emit("friendShipAdded", {
        userId: response.userId,
        friendId: response.friendId,
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">User Profile</h2>
      <div className="flex justify-between">
        <div>
          <div className="flex gap-2">
            <p className="text-sm font-semibold">Username:</p>
            <p className="text-sm">{user.username}</p>
          </div>
          <div className="flex gap-2">
            <p className="text-sm font-semibold">Email:</p>
            <p className="text-sm">{user.email}</p>
          </div>
        </div>
        <div>
          <div className="flex gap-2">
            <p className="text-sm font-semibold">Firstname:</p>
            <p className="text-sm">{user.firstname}</p>
          </div>
          <div className="flex gap-2">
            <p className="text-sm font-semibold">Lastname:</p>
            <p className="text-sm">{user.lastname}</p>
          </div>
        </div>
      </div>

      <div className="w-1/4 mx-auto mt-4">
        <Button
          text={hasSentRequest ? "Request Sent" : "Add Friend"}
          onClick={handleAddFriend}
          className="bg-blue-500 text-white p-2 rounded-md w-1/5 hover:bg-blue-700 transition duration-200"
        />
      </div>
    </div>
  );
};

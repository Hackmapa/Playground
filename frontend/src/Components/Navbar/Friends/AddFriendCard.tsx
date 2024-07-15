import { useNavigate } from "react-router-dom";
import { User } from "../../../Interfaces/User";
import { IoClose, IoPersonAddOutline } from "react-icons/io5";
import { useAppSelector } from "../../../hooks/hooks";
import { useEffect } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { toast } from "react-toastify";
import { socket } from "../../../socket";
import { post } from "../../../utils/requests/post";
import { deleteMethod } from "../../../utils/requests/delete";

interface AddFriendCardProps {
  friend: User;
}

export const AddFriendCard = (props: AddFriendCardProps) => {
  const { friend } = props;

  const user = useAppSelector((state) => state.user);
  const users = useAppSelector((state) => state.users);
  const token = useAppSelector((state) => state.token);

  const isAlreadyFriend = () => {
    if (friend.friendships) {
      return friend.friendships.find(
        (friendship: any) => friendship.friend.id === friend.id
      );
    }
    return false;
  };

  const handleAddFriend = async () => {
    socket.emit("sendFriendRequest", user.id, friend.id, users, token);
  };

  const handleRemoveFriend = async () => {
    socket.emit("removeFriend", user.id, friend.id, users, token);
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col border-b px-2 py-2 ">
      <div className="text-xs flex">
        <div className="flex justify-center w-full">
          <div className="w-full flex items-center justify-between">
            <div
              className="flex gap-4 items-center hover:cursor-pointer"
              onClick={() => navigate(`/profile/${friend.id}`)}
            >
              <img
                src={friend.profile_picture}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <p>{friend?.username}</p>
            </div>
            <div>
              {isAlreadyFriend() ? (
                <IoClose
                  size={24}
                  color="red"
                  className="cursor-pointer transform hover:scale-110 transition duration-200"
                  onClick={handleRemoveFriend}
                />
              ) : (
                <IoPersonAddOutline
                  size={24}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={handleAddFriend}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

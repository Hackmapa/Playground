import { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks/hooks";
import { User } from "../../../Interfaces/User";
import { isUserOnline } from "../../../utils/online";

interface FriendCardProps {
  friend: User;
}

export const FriendCard = (props: FriendCardProps) => {
  const { friend } = props;

  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user);
  const users = useAppSelector((state) => state.users);

  const [actualFriend, setActualFriend] = useState<User | null>(null);

  const getFriend = (friendship: any) => {
    if (user.id === friendship.friend.id) {
      setActualFriend(friendship.user);
    } else {
      setActualFriend(friendship.friend);
    }
  };

  useEffect(() => {
    getFriend(friend);
  }, [friend]);

  return (
    <div className="flex flex-col border-b px-2 py-2 ">
      {actualFriend && (
        <div className="text-xs flex">
          <div className="flex justify-center w-full">
            <div className="w-full flex items-center justify-between">
              <div
                className="flex gap-4 items-center hover:cursor-pointer"
                onClick={() => navigate(`/profile/${actualFriend.id}`)}
              >
                <img
                  src={actualFriend.profile_picture}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
                <p>{actualFriend?.username}</p>
              </div>
              {isUserOnline(users, actualFriend.id) ? (
                <FaCircle color="green" size={15} />
              ) : (
                <FaCircle color="red" size={15} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../hooks/hooks";
import { post } from "../../../utils/requests/post";
import { Notification } from "../../../Interfaces/Notification";

interface NotificationCardProps {
  notif: Notification;
}

export const NotificationCard = (props: NotificationCardProps) => {
  const { notif } = props;

  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user);
  const token = useAppSelector((state) => state.token);

  const notification = notif.notification;
  const friend = notif.friend;

  const handleAcceptFriendRequest = async () => {
    const response = await post(
      `friends/${user.id}/accept/${friend?.id}`,
      {},
      token
    );

    if (response.status === 200) {
      toast.success("Friend request accepted");
    }
  };

  const handleDeclineFriendRequest = async () => {
    const response = await post(
      `friends/${user.id}/decline/${friend?.id}`,
      {},
      token
    );

    if (response.status === 200) {
      toast.success("Friend request declined");
    }
  };

  return (
    <div className="flex flex-col border-b px-2 py-2 ">
      <div className="text-xs flex">
        <div className="flex justify-center w-full">
          <div className="w-full flex items-center justify-center">
            {notification.type === "friend_request" ? (
              <p>
                {notification.description + " "}
                <span
                  className="font-bold hover:cursor-pointer"
                  onClick={() => navigate(`/profile/${friend?.id}`)}
                >
                  {friend?.username}
                </span>
              </p>
            ) : (
              <p>{notification.description}</p>
            )}
          </div>
        </div>
      </div>
      {notification.type === "friend_request" && (
        <div className="flex items-center justify-around w-full mt-2">
          <p
            className="text-green-500 rounded-lg hover:cursor-pointer text-xs p-2 hover:bg-green-500 hover:text-white"
            onClick={handleAcceptFriendRequest}
          >
            Accepter
          </p>
          <p
            className="text-red-500 rounded-lg hover:cursor-pointer text-xs p-2 hover:bg-red-500 hover:text-white"
            onClick={handleDeclineFriendRequest}
          >
            Refuser
          </p>
        </div>
      )}
    </div>
  );
};

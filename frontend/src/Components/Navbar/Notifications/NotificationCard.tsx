import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { post } from "../../../utils/requests/post";
import { Notification } from "../../../Interfaces/Notification";
import { socket } from "../../../socket";
import { IoMdClose } from "react-icons/io";
import { removeNotification } from "../../../Redux/notifications/notificationSlice";

interface NotificationCardProps {
  notif: Notification;
}

export const NotificationCard = (props: NotificationCardProps) => {
  const { notif } = props;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user);
  const users = useAppSelector((state) => state.users);
  const token = useAppSelector((state) => state.token);

  const notification = notif.notification;
  const friend = notif.friend;

  const handleAcceptFriendRequest = async () => {
    dispatch(removeNotification(notification.id));

    socket.emit("acceptFriendRequest", user.id, friend?.id, users, token);

    toast.success("Friend request accepted");
  };

  const handleDeclineFriendRequest = async () => {
    dispatch(removeNotification(notification.id));

    socket.emit("rejectFriendRequest", user.id, friend?.id, users, token);

    toast.success("Friend request declined");
  };

  const handleDismissNotification = async () => {
    dispatch(removeNotification(notification.id));

    await post(`notification/${notification.id}/dismiss`, {}, token);
  };

  return (
    <div className="relative flex flex-col border-b px-2 py-2 ">
      <div
        className="absolute top-1 right-1"
        onClick={handleDismissNotification}
      >
        <IoMdClose className="cursor-pointer" size={16} />
      </div>
      <div className="text-xs flex">
        <div className="flex justify-center w-full">
          <div className="w-full flex items-center justify-center">
            {notification.type === "friend_request" ||
            notification.type === "friend_request_accepted" ||
            notification.type === "friend_request_declined" ? (
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

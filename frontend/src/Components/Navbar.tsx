import { IoMdNotificationsOutline } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { socket } from "../socket";
import { useEffect, useState } from "react";
import { get } from "../utils/requests/get";
import { Notification } from "../Interfaces/Notification";
import { FaCheck } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { post } from "../utils/requests/post";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';


export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.users);
  const user = useAppSelector((state) => state.user);
  const token = useAppSelector((state) => state.token);

  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleLogout = () => {
    socket.disconnect();

    dispatch({ type: "token/logout" });
    navigate("/login");
  };

  useEffect(() => {
    const getAllNotifications = async () => {
      if (user.id === 0) return;

      try {
        const response = await get(`notification/${user.id}`, token);

        setNotifications(response);
      } catch (error) {
        console.error(error);
      }
    };

    getAllNotifications();
  }, [user, token]);

  return (
    <div className="sticky top-0 z-30 w-full px-4 py-2 bg-darkBlue text-white">
      <div className="flex items-center justify-between px-2 py-2">
        <img
          src="logo.svg"
          alt="logo"
          className="w-12 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <p>
          {users.length > 0
            ? `Users Online: ${users.length}`
            : "No users online"}
        </p>
        <div className="flex items-center gap-10">
          <div className="flex gap-4">
            <div className="relative">
              <IoMdNotificationsOutline
                size={28}
                className="cursor-pointer"
                color="white"
                onClick={() => setOpenNotifications(!openNotifications)}
              />
              {openNotifications && (
                <NotificationContainer notifications={notifications} />
              )}
            </div>
            <Link to="/profile">
            <FaRegUser size={24} className="cursor-pointer" color="white" />
            </Link>
            <IoLogOutOutline
              size={28}
              className="cursor-pointer"
              color="white"
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
}

const NotificationContainer = (props: NotificationContainerProps) => {
  const { notifications } = props;

  return (
    <div className="absolute mt-8 top-0 right-0 w-52 h-96 border-darkBlue bg-white text-darkBlue rounded-md shadow-lg overflow-auto trasnform translate-x-1/2 flex flex-col">
      <p className="border-b py-2 font-semibold">
        Notifications ({notifications.length})
      </p>

      {notifications.length === 0 && <p>No notifications</p>}

      {notifications.map((notification, index) => (
        <NotificationCard key={index} notif={notification} />
      ))}
    </div>
  );
};

interface NotificationCardProps {
  notif: Notification;
}

const NotificationCard = (props: NotificationCardProps) => {
  const { notif } = props;

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
            <p>{notification.description}</p>
          </div>
        </div>
      </div>
      {notification.type === "friend_request" && (
        <div className="flex items-center justify-around w-full mt-2">
          <FaCheck
            className="text-green-500 cursor-pointer"
            size={20}
            onClick={handleAcceptFriendRequest}
          />
          <RxCross1
            className="text-red-500 cursor-pointer"
            size={20}
            onClick={handleDeclineFriendRequest}
          />
        </div>
      )}
    </div>
  );
};

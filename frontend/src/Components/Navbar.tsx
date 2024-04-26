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

export const Navbar: React.FC<{
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}> = ({ searchTerm, setSearchTerm }) => {
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
          src="logo.png"
          alt="logo"
          className="cursor-pointer w-20"
          onClick={() => navigate("/")}
        />
        <div className="flex flex-col items-center">
          <div className="flex relative mx-5 my-0">
            <img
              src="searchIcon.png"
              className="absolute z-10 -translate-y-2/4 w-5 h-5 right-[5%] top-2/4"
              alt="Search"
            />
            <input
              type="text"
              className="w-[400px] bg-[#5a4377] opacity-50 text-white text-[15px] pl-[15px] pr-10 py-[15px] rounded-[50px] border-[none] focus:text-[white] focus:shadow-[0_0_10px_white] focus:border-2 focus:border-solid focus:border-[white] outline-none"
              placeholder="Search for a game"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
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
            <img
              src="logo.jpg"
              alt="logo profile"
              className="cursor-pointer w-10 h-10 rounded-full  object-cover"
              onClick={() => navigate("/profile")}
            />
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

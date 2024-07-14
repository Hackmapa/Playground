import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { socket } from "../../socket";
import { useEffect, useState } from "react";
import { get } from "../../utils/requests/get";
import { Notification } from "../../Interfaces/Notification";
import { FaSearch } from "react-icons/fa";
import { User } from "../../Interfaces/User";
import { FriendDropdown } from "./Friends/FriendDropdown";
import { NotificationDropdown } from "./Notifications/NotificationDropdown";

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user);
  const token = useAppSelector((state) => state.token);

  const [openNotifications, setOpenNotifications] = useState(false);
  const [openFriends, setOpenFriends] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [friends, setFriends] = useState<User[]>([]);

  const handleLogout = () => {
    socket.disconnect();

    dispatch({ type: "token/logout" });
    navigate("/login");
  };

  const fetchFriends = async () => {
    const response = await get(`friends/${user.id}`, token);

    setFriends(response);
  };

  useEffect(() => {
    fetchFriends();

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

    socket.on("friendShipAdded", (data: Notification) => {
      // setMessages((prevMessages) => [...prevMessages, data]);
      console.log(data);
    });
  }, [user, token]);

  useEffect(() => {
    if (openNotifications) {
      setOpenFriends(false);
    }
  }, [openNotifications]);

  useEffect(() => {
    if (openFriends) {
      setOpenNotifications(false);
    }
  }, [openFriends]);

  return (
    <div className="sticky top-0 z-30 w-full px-4 py-2 bg-darkBlue-gray text-white">
      <div className="flex items-center justify-between px-2">
        <img
          src="logo.svg"
          alt="logo"
          className="w-12 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div className="flex items-center w-1/4 bg-darkBlue rounded-3xl">
          <input
            type="text"
            placeholder="Recherchez un jeu ..."
            className="flex-grow bg-darkBlue font-bold px-5 py-2 text-gray-400 focus:outline-none focus:ring-0 rounded-3xl"
          />
          <FaSearch className="text-gray-400 mr-4" />
        </div>
        <div className="flex items-center gap-10">
          <div className="flex gap-2">
            <FriendDropdown friends={friends} />
            <NotificationDropdown notifications={notifications} />
            <img
              src={user?.profile_picture}
              alt="profile"
              className="w-10 h-10 rounded-full hover:cursor-pointer"
              onClick={() => navigate(`/profile/${user.id}`)}
            />
            <div className="w-10 h-10 bg-darkBlue flex items-center justify-center rounded-full p-2 hover:text-darkBlue hover:bg-white hover:border-white transition duration-200">
              <IoLogOutOutline
                size={28}
                className="cursor-pointer"
                onClick={handleLogout}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

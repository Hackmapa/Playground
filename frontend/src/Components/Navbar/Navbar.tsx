import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { socket } from "../../socket";
import { useEffect, useState } from "react";
import { get } from "../../utils/requests/get";
import { FriendDropdown } from "./Friends/FriendDropdown";
import { NotificationDropdown } from "./Notifications/NotificationDropdown";
import {
  addNotification,
  addNotifications,
} from "../../Redux/notifications/notificationSlice";
import { GameSearch } from "./GameSearch";
import { addFriends } from "../../Redux/friends/friendSlice";
import { removeRpsRoom } from "../../Redux/rooms/rpsRoomSlice";
import { removeConnectFourRoom } from "../../Redux/rooms/connectFourSlice";
import { removeHarryPotterRoom } from "../../Redux/rooms/harryPotterRoomSlice";
import { removeTttRoom } from "../../Redux/rooms/tttRoomSlice";
import { removeUser } from "../../Redux/user/userSlice";
import { removeUsers } from "../../Redux/users/usersSlice";

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user);
  const token = useAppSelector((state) => state.token);
  const notifications = useAppSelector((state) => state.notifications);
  const friends = useAppSelector((state) => state.friends);

  const [openNotifications, setOpenNotifications] = useState(false);
  const [openFriends, setOpenFriends] = useState(false);

  const handleLogout = () => {
    socket.disconnect();

    dispatch({ type: "token/logout" });
    dispatch(removeRpsRoom());
    dispatch(removeConnectFourRoom());
    dispatch(removeHarryPotterRoom());
    dispatch(removeTttRoom());
    dispatch(removeUser());
    dispatch(removeUsers());

    navigate("/login");
  };

  const fetchFriends = async () => {
    const response = await get(`friends/${user.id}`, token);

    dispatch(addFriends(response));
  };

  useEffect(() => {
    fetchFriends();

    const getAllNotifications = async () => {
      if (user.id === 0) return;

      try {
        const response = await get(`notification/${user.id}`, token);

        dispatch(addNotifications(response));
      } catch (error) {
        console.error(error);
      }
    };

    getAllNotifications();
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

  useEffect(() => {
    if (socket) {
      socket.on("friendRequest", (data: any) => {
        dispatch(addNotification(data));
        fetchFriends();
      });

      socket.on("friendRequestAccepted", (data: any) => {
        dispatch(addNotification(data));
        fetchFriends();
      });

      socket.on("friendRequestDeclined", (data: any) => {
        dispatch(addNotification(data));
        fetchFriends();
      });

      socket.on("friendShipRemoved", (data: any) => {
        fetchFriends();
      });
    }

    return () => {
      if (socket) {
        socket.off("friendRequest");
        socket.off("friendRequestAccepted");
        socket.off("friendRequestDeclined");
        socket.off("friendShipRemoved");
      }
    };
  }, [notifications]);

  return (
    <div className="sticky top-0 z-30 w-full px-4 py-2 bg-darkBlue-gray text-white">
      <div className="flex items-center justify-between px-2">
        <img
          src={`${process.env.REACT_APP_PUBLIC_URL}/logo.svg`}
          alt="logo"
          className="w-12 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <GameSearch />
        <div className="flex items-center gap-10">
          <div className="flex gap-2">
            <FriendDropdown friends={friends} />
            <NotificationDropdown notifications={notifications} />
            <img
              src={user.profile_picture}
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

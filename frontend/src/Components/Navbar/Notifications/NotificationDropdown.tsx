import { IoMdNotificationsOutline } from "react-icons/io";
import { NotificationContainer } from "./NotificationContainer";
import { Notification } from "../../../Interfaces/Notification";
import { useEffect, useRef, useState } from "react";

interface NotificationDropdownProps {
  notifications: Notification[];
}

export const NotificationDropdown = (props: NotificationDropdownProps) => {
  const { notifications } = props;

  const [openNotifications, setOpenNotifications] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setOpenNotifications(false);
    }
  };

  useEffect(() => {
    if (openNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openNotifications]);

  return (
    <div className="relative" ref={containerRef}>
      <div className="w-14 h-14 bg-darkBlue flex items-center justify-center rounded-full p-2 hover:text-darkBlue hover:bg-white hover:border-white transition duration-200">
        <IoMdNotificationsOutline
          size={28}
          className="cursor-pointer"
          onClick={() => setOpenNotifications(!openNotifications)}
        />
      </div>
      {notifications.length > 0 && (
        <div className="absolute h-5 w-5 bg-white rounded-full bottom-9 left-8">
          <p className="text-xs text-red-600 font-bold">
            {notifications.length}
          </p>
        </div>
      )}
      {openNotifications && (
        <NotificationContainer notifications={notifications} />
      )}
    </div>
  );
};

import { Notification } from "../../../Interfaces/Notification";
import { NotificationCard } from "./NotificationCard";

interface NotificationContainerProps {
  notifications: Notification[];
}

export const NotificationContainer = (props: NotificationContainerProps) => {
  const { notifications } = props;

  return (
    <div className="absolute mt-8 top-3 right-0 w-52 h-96 border-darkBlue-gray bg-darkBlue text-white rounded-md shadow-lg overflow-auto trasnform translate-x-1/2 flex flex-col">
      <p className="border-b py-2 font-semibold">
        Notifications ({notifications.length})
      </p>

      {notifications.length === 0 && (
        <p className="mt-3">Pas de notifications</p>
      )}

      {notifications.map((notification, index) => (
        <NotificationCard key={index} notif={notification} />
      ))}
    </div>
  );
};

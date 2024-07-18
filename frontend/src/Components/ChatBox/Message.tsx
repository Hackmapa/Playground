import { useState } from "react";
import { FaCircle } from "react-icons/fa";
import { useAppSelector } from "../../hooks/hooks";
import { ModalBox } from "../ModalBox/ModalBox";
import { Message } from "../../Interfaces/Message";
import { UserProfile } from "./UserProfile";
import { useNavigate } from "react-router-dom";
import { isUserOnline } from "../../utils/online";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = (props: ChatMessageProps) => {
  const { message } = props;

  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user);
  const users = useAppSelector((state) => state.users);

  const [open, setOpen] = useState(false);

  const getMessageDate = (datetime: string) => {
    const date = new Date(datetime);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    const stringHours = hours < 10 ? `0${hours}` : `${hours}`;
    const stringMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const stringSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${stringHours}:${stringMinutes}:${stringSeconds}`;
  };

  return (
    <div
      className={
        (message.user.id === user.id ? "self-end bg-blue-600" : "bg-gray-500") +
        " m-2 rounded-md w-2/5 text-white p-1 text-xs"
      }
    >
      <div className="flex justify-between gap-2 p-1">
        <div className="flex items-center gap-2 w-full">
          <img
            src={message.user.profile_picture}
            alt="profile"
            className="w-8 h-8 rounded-full cursor-pointer object-cover"
            onClick={() => navigate(`/profile/${message.user.id}`)}
          />
          <div className="flex justify-between w-full">
            <div className="flex flex-col justify-between text-left">
              <p>{message.user.username}</p>
              <p className="text-start">{getMessageDate(message.date)}</p>
            </div>

            {isUserOnline(users, message.user.id) ? (
              <FaCircle color="green" size={15} />
            ) : (
              <FaCircle color="red" size={15} />
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between overflow-x-auto">
        <p className="text-sm text-start px-1 p-2">{message.message}</p>
      </div>
      <ModalBox
        open={open}
        setOpen={(o) => {
          setOpen(o);
        }}
      >
        <UserProfile user={message.user} />
      </ModalBox>
    </div>
  );
};

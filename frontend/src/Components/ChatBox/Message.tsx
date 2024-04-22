import { useState } from "react";
import { FaCircle } from "react-icons/fa";
import { useAppSelector } from "../../hooks/hooks";
import { ModalBox } from "../ModalBox/ModalBox";
import { Message } from "../../Interfaces/Message";
import { UserProfile } from "./UserProfile";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = (props: ChatMessageProps) => {
  const { message } = props;

  const user = useAppSelector((state) => state.user);
  const users = useAppSelector((state) => state.users);

  const [open, setOpen] = useState(false);

  const isUserOnline = (id: number) => {
    return users.some((u) => u.user.id === id);
  };

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
        (message.user.id === user.id
          ? "self-end bg-green-400"
          : "bg-blue-400") + " m-2 rounded-md w-2/5"
      }
    >
      <div className="flex justify-between gap-2 border-b-[1px] p-1">
        <div className="flex items-center gap-1">
          <FaCircle
            className={
              isUserOnline(message.user.id) ? "text-green-800" : "text-red-700"
            }
            size={8}
          />
          <p
            className="text-sm font-semibold text-start cursor-pointer"
            onClick={() => setOpen(true)}
          >
            {message.user.username}
          </p>
        </div>

        <p className="text-sm text-start">{getMessageDate(message.date)}</p>
      </div>
      <div className="flex justify-between">
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

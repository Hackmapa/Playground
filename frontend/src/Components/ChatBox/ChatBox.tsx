import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { useAppSelector } from "../../hooks/hooks";
import { Message } from "../../Interfaces/Message";
import { Chat } from "./Chat";

export const ChatBox = () => {
  const user = useAppSelector((state) => state.user);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const users = useAppSelector((state) => state.users);

  const sendMessage = (message: string) => {
    socket.emit("sendMessage", {
      message,
      user: user,
    });

    setMessage("");
  };

  useEffect(() => {
    socket.on("updateMessages", (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="fixed flex flex-col bottom-0 right-0 w-1/5 bg-white h-96 justify-between z-50">
      <div className="absolute top-0 right-3 flex items-center space-x-1">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <p className="text-white">{users.length}</p>
      </div>
      <h2 className="text-center text-2xl font-semibold border-b border-gray-300 p-2 bg-darkBlue text-white">
        Chat
      </h2>

      <Chat messages={messages} />

      <div className="flex">
        <input
          type="text"
          placeholder="Type a message ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-4/5 border border-gray-300 p-2"
        />
        <button
          onClick={() => sendMessage(message)}
          className="w-1/5 bg-blue-500 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

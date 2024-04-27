import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { useAppSelector } from "../../hooks/hooks";
import { Message } from "../../Interfaces/Message";
import { Chat } from "./Chat";

export const ChatBox = () => {
  const user = useAppSelector((state) => state.user);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [className, setClassName] = useState(
    "fixed flex flex-col bottom-0 right-0 w-1/5 bg-white justify-between"
  );

  const sendMessage = (e: any, message: string) => {
    e.preventDefault();
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

  useEffect(() => {
    if (isChatOpen) {
      setClassName(
        "fixed flex flex-col bottom-0 right-0 w-1/5 bg-white justify-between h-96"
      );
    } else {
      setClassName(
        "fixed flex flex-col bottom-0 right-0 w-1/5 bg-white justify-between h-0"
      );
    }
  }, [isChatOpen]);

  return (
    <div className={className}>
      <h2 className="text-center text-2xl font-semibold border-b border-gray-300 p-2 bg-darkBlue text-white">
        Chat
      </h2>

      <Chat messages={messages} show={isChatOpen} setShow={setIsChatOpen} />

      <div className="flex">
        <form onSubmit={(e) => sendMessage(e, message)} className="flex w-full">
          <input
            type="text"
            placeholder="Type a message ..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-4/5 border border-gray-300 p-2"
          />
          <button type="submit" className="w-1/5 bg-blue-500 text-white">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

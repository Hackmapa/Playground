import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { useAppSelector } from "../../hooks/hooks";
import { Message } from "../../Interfaces/Message";
import { Chat } from "./Chat";
import { FaTimes, FaArrowUp } from "react-icons/fa";

export const ChatBox = () => {
  const user = useAppSelector((state) => state.user);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);

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

  return (
    <div
      className={`fixed flex flex-col bottom-0 right-0 w-1/5 bg-white justify-between transition-all duration-300 z-50 ${
        isChatOpen ? "h-96" : "h-12"
      }`}
    >
      <div className="flex items-center justify-between bg-darkBlue text-white p-2">
        <h2 className="text-2xl font-semibold">Chat</h2>
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="text-white"
        >
          {isChatOpen ? <FaTimes /> : <FaArrowUp />}
        </button>
      </div>

      {isChatOpen && (
        <>
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
        </>
      )}
    </div>
  );
};

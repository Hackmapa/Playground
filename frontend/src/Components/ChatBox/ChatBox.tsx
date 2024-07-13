import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { useAppSelector } from "../../hooks/hooks";
import { Message } from "../../Interfaces/Message";
import { IoChatbubbleEllipsesOutline, IoSend } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { ChatMessage } from "./Message";
import { FaCircle } from "react-icons/fa";

export const ChatBox = () => {
  const user = useAppSelector((state) => state.user);
  const users = useAppSelector((state) => state.users);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
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
      setClassName("h-[500px]");
    } else {
      setClassName("h-0 hidden");
    }
  }, [isChatOpen]);

  return (
    <div className="fixed flex flex-col bottom-28 right-12 justify-between w-1/5 z-20">
      <div className="relative w-full">
        <div className={"absolute bottom-4 right-0 w-full " + className}>
          <div className="h-full w-full bg-white rounded-3xl flex flex-col justify-between">
            <div className="flex flex-col h-full">
              <div className="relative bg-blue-600 rounded-t-xl py-4">
                <p className="text-white text-xl font-bold">Chat général</p>
                <div className="absolute flex right-2 top-1 z-10 rounded-full text-center items-center text-white gap-1 font-bold">
                  {users.length}
                  <FaCircle color="#2d9b0c" size={15} />
                </div>
              </div>
              <div className="w-full h-full max-h-[400px] flex flex-col overflow-y-auto">
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
              </div>
            </div>

            <div className="flex flex-col place-self-end w-full">
              <form
                onSubmit={(e) => sendMessage(e, message)}
                className="flex w-full"
              >
                <input
                  type="text"
                  placeholder="Ecrivez un message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-4/5 border border-gray-300 p-2 rounded-bl-xl"
                />
                <button
                  type="submit"
                  className="w-1/5 bg-blue-600 text-white flex justify-center items-center rounded-br-xl"
                >
                  <IoSend size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="absolute right-0 top-0 bg-white text-darkBlue-dark p-4 rounded-full border-2 border-white hover:bg-darkBlue-dark hover:text-white transition duration-200 hover:shadow-lg"
        >
          {isChatOpen ? (
            <IoMdClose size={40} />
          ) : (
            <IoChatbubbleEllipsesOutline size={40} />
          )}
        </button>
      </div>
    </div>
  );
};

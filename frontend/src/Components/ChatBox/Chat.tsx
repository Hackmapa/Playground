import { Message } from "../../Interfaces/Message";
import { ChatMessage } from "./Message";

interface ChatProps {
  messages: Message[];
  show: boolean;
  setShow: (show: boolean) => void;
}

export const Chat = (props: ChatProps) => {
  const { messages, show, setShow } = props;

  return (
    <>
      {show && (
        <div className="flex flex-col overflow-y-auto bg-gray-700 h-full">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
      )}
    </>
  );
};

import { Message } from "../../Interfaces/Message";
import { ChatMessage } from "./Message";

interface ChatProps {
  messages: Message[];
}

export const Chat = (props: ChatProps) => {
  const { messages } = props;

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-700 h-full">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </div>
  );
};

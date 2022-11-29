import MessagePreview from "containers/MessagePreview";
import { useEffect, useState } from "react";
import { ChatPreview } from "schemas/chatPreview.schema";
import { UserPreview } from "schemas/userPreview.schema";
import { Socket } from "socket.io-client";

interface MenuProps {
  show: boolean;
  chats: ChatPreview[];
  username: string;
  setReceiver: (receiver: UserPreview) => void;
  socket: Socket;
}

type UpdateAllChatsResponse = {
  messages: ChatPreview[];
};

type NewLastMessageResponse = ChatPreview;

const Menu: React.FC<MenuProps> = ({
  show,
  chats,
  username,
  setReceiver,
  socket,
}) => {
  const [messages, setMessages] = useState(chats);

  useEffect(() => {
    const updateAllChats = ({ messages }: UpdateAllChatsResponse) => {
      setMessages(messages);
    };

    socket.on("updateAllChats", updateAllChats);

    return () => {
      socket.off("updateAllChats", updateAllChats);
    };
  }, [messages, socket]);

  useEffect(() => {
    const newLastMessage = (message: NewLastMessageResponse) => {
      setMessages([message, ...messages]);
    };

    socket.on("newLastMessage", newLastMessage);

    return () => {
      socket.off("newLastMessage", newLastMessage);
    };
  }, [messages, socket]);

  return (
    <>
      <section
        className={`fixed lg:static lg:col-span-1 bg-[#26262c] p-5 z-50 h-full w-[80%] lg:w-full ease-in-out duration-300
        ${show ? "left-0" : "-left-full"}`}
      >
        <h1 className="text-white text-3xl mb-4 truncate">{username}</h1>

        <div className="p-2 overflow-y-scroll max-h-[calc(100%-165px)] scrollbar">
          {messages?.map((message, idx) => (
            <div key={idx} onClick={() => setReceiver(message.receiver)}>
              <MessagePreview
                receiver={message.receiver}
                message={message.message}
                date={message.date}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Menu;

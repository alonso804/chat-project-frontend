import MessagePreview from "containers/MessagePreview";
import { useState } from "react";
import { ChatPreview } from "schemas/chatPreview.schema";

interface MenuProps {
  show: boolean;
  chats?: ChatPreview[];
  username: string;
}

const Menu: React.FC<MenuProps> = ({ show, chats, username }) => {
  const [messages, setMessages] = useState(chats);

  return (
    <>
      <section
        className={`fixed lg:static lg:col-span-1 bg-[#26262c] p-5 z-50 h-full w-[80%] lg:w-full ease-in-out duration-300
        ${show ? "left-0" : "-left-full"}`}
      >
        <h1 className="text-white text-3xl mb-4 truncate">{username}</h1>

        <div className="p-2 overflow-y-scroll max-h-[calc(100%-165px)] scrollbar">
          {/* {messages?.map((message, idx) => (
            <MessagePreview
              key={idx}
              username={message.username}
              message={message.message}
              date={message.date}
            />
          ))} */}
        </div>
      </section>
    </>
  );
};

export default Menu;

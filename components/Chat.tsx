import Message from "containers/Message";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import { UserPreview } from "schemas/userPreview.schema";
import { ChatServices } from "services/ChatServices";
import { Socket } from "socket.io-client";

interface ChatProps {
  receiver: UserPreview;
  socket: Socket;
}

type CreateChatSocketResponse = {
  chatId: string;
  message: {
    createdAt: string;
    content: string;
    isSender: boolean;
  };
};

const Chat: React.FC<ChatProps> = ({ receiver, socket }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<
    CreateChatSocketResponse["message"][]
  >([]);
  const [chatId, setChatId] = useState<string | undefined>();
  const router = useRouter();

  const getChat = async () => {
    const token = getCookie("token") as string;

    try {
      const response = await ChatServices.getChat(token, receiver.username);

      if (response.status !== 200) {
        setChatId(undefined);
        setMessages([]);

        return;
      }

      const data = await response.json();

      setChatId(data.id);
      setMessages(data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const createChat = ({ chatId, message }: CreateChatSocketResponse) => {
      setChatId(chatId);
      setMessages([message, ...messages]);
    };

    socket.on("newChat", createChat);

    return () => {
      socket.off("newChat", createChat);
    };
  }, [messages, chatId, socket]);

  useEffect(() => {
    const sendMessage = ({ chatId, message }: CreateChatSocketResponse) => {
      setChatId(chatId);
      setMessages([message, ...messages]);
    };

    socket.on("sendMessage", sendMessage);

    return () => {
      socket.off("sendMessage", sendMessage);
    };
  }, [messages, chatId, socket]);

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (chatId) {
        socket.emit("sendMessage", {
          chatId,
          message: newMessage,
          receiver,
        });
        // await ChatServices.sendMessage(token as string, chatId, newMessage);
      } else {
        socket.emit("createChat", {
          receiver,
          message: newMessage,
        });
        // await ChatServices.createChat(token as string, receiver, newMessage);
      }
      setNewMessage("");
      // await getChat();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      getChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.username, receiver]);

  return (
    <>
      <section className="lg:col-span-3 bg-[#1E1F24] flex flex-col relative">
        <div className="flex flex-row p-2 pl-5 gap-4 items-center bg-[#141517] border-b border-gray-700">
          <Image
            loader={({ src }) => src}
            src="https://cdn.pixabay.com/photo/2021/02/12/13/43/among-us-6008615__340.png"
            alt="Profile Picture"
            width={50}
            height={50}
            unoptimized
            className="rounded-full"
          />
          <h2 className="text-white text-2xl">{receiver.username}</h2>
        </div>

        <div className="p-4 overflow-y-scroll max-h-[calc(100%-165px)] scrollbar flex flex-col-reverse">
          {messages.map((message: any, idx) => (
            <Message
              key={idx}
              message={message.content}
              date={message.createdAt}
              isSender={message.isSender}
            />
          ))}
        </div>

        <div className="absolute bg-[#22222A] left-0 bottom-0 w-full p-7 border-t border-gray-700">
          <form
            className="flex flex-row content-center items-center gap-3"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              name="message"
              autoComplete="off"
              className="px-4 py-2 outline-none w-full rounded-full text-white"
              placeholder="Type a message"
              onChange={(event) => setNewMessage(event.target.value)}
              value={newMessage}
              autoFocus
            />

            <button type="submit">
              <MdSend className="hover:cursor-pointer w-auto h-8 text-white" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Chat;

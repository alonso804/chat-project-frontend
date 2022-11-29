import Message from "containers/Message";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import { UserPreview } from "schemas/userPreview.schema";
import { ChatServices } from "services/ChatServices";
import { Socket } from "socket.io-client";
import { userTable } from "utils/indexedDb";
import {
  decryptAesCbc,
  decryptAesGcm,
  encryptAesGcm,
  getDeriveKey,
} from "utils/crypto";

interface ChatProps {
  receiver: UserPreview;
  socket: Socket;
  privateKey: string;
}

type CreateChatSocketResponse = {
  chatId: string;
  message: {
    createdAt: string;
    content: string;
    isSender: boolean;
  };
};

const Chat: React.FC<ChatProps> = ({ receiver, socket, privateKey }) => {
  const [deriveKey, setDeriveKey] = useState<CryptoKey>();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<
    CreateChatSocketResponse["message"][]
  >([]);
  const [chatId, setChatId] = useState<string | undefined>();

  useEffect(() => {
    const createChat = async ({
      chatId: serverChatId,
      message,
    }: CreateChatSocketResponse) => {
      try {
        console.group("createChat");
        console.log(`chatId: ${chatId}`);
        console.log(`serverChatId: ${serverChatId}`);
        console.log(`message: ${message}`);
        console.groupEnd();

        if (!chatId || chatId === serverChatId) {
          const decriptedMessage = {
            ...message,
            content: await decryptAesGcm(message.content, deriveKey!),
          };

          setChatId(serverChatId);
          setMessages([decriptedMessage, ...messages]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    socket.on("newChat", createChat);

    return () => {
      socket.off("newChat", createChat);
    };
  }, [messages, chatId, socket, deriveKey]);

  useEffect(() => {
    const sendMessage = async ({
      chatId: serverChatId,
      message,
    }: CreateChatSocketResponse) => {
      try {
        console.group("sendMessage");
        console.log(`chatId: ${chatId}`);
        console.log(`serverChatId: ${serverChatId}`);
        console.log(`message: ${message}`);
        console.groupEnd();

        if (chatId === serverChatId) {
          const decriptedMessage = {
            ...message,
            content: await decryptAesGcm(message.content, deriveKey!),
          };

          setChatId(serverChatId);
          setMessages([decriptedMessage, ...messages]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    socket.on("sendMessage", sendMessage);

    return () => {
      socket.off("sendMessage", sendMessage);
    };
  }, [messages, chatId, socket, deriveKey]);

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const encryptedMessage = await encryptAesGcm(newMessage, deriveKey!);

      console.log(`Sending message: ${encryptedMessage}`);

      if (chatId) {
        socket.emit("sendMessage", {
          chatId,
          message: encryptedMessage,
          receiver,
        });
      } else {
        socket.emit("createChat", {
          receiver,
          message: encryptedMessage,
        });
      }
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getChatDeriveKey = async () => {
      try {
        const deriveKeyCrypto = await getDeriveKey(
          JSON.parse(receiver.publicKey),
          JSON.parse(privateKey)
        );

        setDeriveKey(deriveKeyCrypto);
      } catch (error) {
        console.error(error);
      }
    };

    getChatDeriveKey();
  }, [receiver, privateKey]);

  useEffect(() => {
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

        const decriptedMessages = await Promise.all(
          data.messages.map(
            async (message: CreateChatSocketResponse["message"]) => {
              const decriptedMessage = await decryptAesGcm(
                message.content,
                deriveKey!
              );

              return {
                ...message,
                content: decriptedMessage,
              };
            }
          )
        );
        setMessages(decriptedMessages);
      } catch (error) {
        console.log(error);
      }
    };

    getChat();
  }, [deriveKey, receiver]);

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

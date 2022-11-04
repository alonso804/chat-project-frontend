import Message from "containers/Message";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import { ChatServices } from "services/ChatServices";

const Chat: React.FC = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [chatId, setChatId] = useState();
  const router = useRouter();

  const getChat = async (token: string) => {
    try {
      const response = await ChatServices.getChat(
        token,
        router.query.username as string
      );

      if (response.status !== 200) {
        return;
      }

      const data = await response.json();

      setChatId(data.id);
      setMessages(data.messages);
      setReceiver(data.receiver);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getCookie("token");

    try {
      if (chatId) {
        await ChatServices.sendMessage(token as string, chatId, newMessage);
      } else {
        await ChatServices.createChat(token as string, receiver, newMessage);
      }
      await getChat(token as string);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const token = getCookie("token");
      getChat(token as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.username]);

  return (
    <>
      <section className="lg:col-span-3 bg-[#1E1F24] flex flex-col relative">
        <div className="flex flex-row p-2 pl-5 gap-4 items-center bg-[#141517] border-b border-gray-700">
          <Image
            loader={({ src }) => src}
            src="https://pps.whatsapp.net/v/t61.24694-24/294877915_115185511154245_8899329756680350085_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AdTt2uUw2vRwyn3ycSs26ZfeqLWDrd59BDt8lOkJ4-ODlQ&oe=636E59EB"
            alt="Profile Picture"
            width={50}
            height={50}
            unoptimized
            className="rounded-full"
          />
          <h2 className="text-white text-2xl">{receiver}</h2>
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

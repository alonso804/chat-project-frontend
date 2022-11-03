import Message from "containers/Message";
import Image from "next/image";
import { useState } from "react";
import { MdSend } from "react-icons/md";

interface ChatProps {
  id: string;
  receiver: string;
  messages: {
    content: string;
    isSender: boolean;
    createdAt: Date;
  }[];
}

const Chat: React.FC<ChatProps> = ({ id, receiver, messages }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(message);
  };

  return (
    <>
      <section className="lg:col-span-3 bg-[#1E1F24] flex flex-col h-full relative">
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

        <div className="p-4 overflow-y-scroll max-h-[calc(100%-165px)] scrollbar">
          <Message isSender={true} message={"Hola"} date={new Date()} />

          <Message
            isSender={false}
            message={
              "Lorem ipsum corporis nesciunt asperiores ducimus, sunt architecto, hic eveniet officia autem debitis deleniti, dicta nisi maxime est dolorum voluptatum! Sint reiciendis molestiae magni quidem non hic nihil qui corporis, nobis debitis fugit laboriosam dicta veniam, eveniet libero."
            }
            date={new Date()}
          />
          <Message isSender={true} message={"Hola"} date={new Date()} />
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
              onChange={(event) => setMessage(event.target.value)}
              value={message}
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

import MessagePreview from "containers/MessagePreview";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { UserServices } from "services/UserServices";

interface MenuProps {
  show: boolean;
}

const Menu: React.FC<MenuProps> = ({ show }) => {
  const [searchUser, setSearchUser] = useState("");
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([
    {
      username: "chanito",
      message: "Hola",
      date: new Date(),
    },
    {
      username: "luis",
      message: "Como estas",
      date: new Date(),
    },
    {
      username: "fabiola",
      message: "Hi",
      date: new Date(),
    },
  ]);

  const getUSerInfo = async (token: string) => {
    try {
      const response = await UserServices.getUserInfo(token);
      const data = await response.json();

      setUsername(data.username);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = getCookie("token");

    getUSerInfo(token as string);
  }, []);

  return (
    <>
      <section
        className={`fixed lg:static lg:col-span-1 bg-[#22222A] p-5 z-50 h-full w-[80%] lg:w-full ease-in-out duration-300
        ${show ? "left-0" : "-left-full"}`}
      >
        <h1 className="text-white text-3xl mb-4 truncate">{username}</h1>
        <form>
          <div className="relative">
            <RiSearchLine className="absolute left-2 top-3 text-gray-300" />
            <input
              type="text"
              name="message"
              autoComplete="off"
              className="pl-8 pr-3 py-2 outline-none rounded text-white w-full"
              placeholder="Search user"
              onChange={(event) => setSearchUser(event.target.value)}
              value={searchUser}
            />
          </div>
        </form>

        <div className="p-2 overflow-y-scroll max-h-[calc(100%-165px)] scrollbar">
          {messages.map((message, idx) => (
            <MessagePreview
              key={idx}
              username={message.username}
              message={message.message}
              date={message.date}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Menu;

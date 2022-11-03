import MessagePreview from "containers/MessagePreview";
import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";

interface MenuProps {
  show: boolean;
}

const Messages: React.FC<MenuProps> = ({ show }) => {
  const [searchUser, setSearchUser] = useState("");

  return (
    <>
      <section
        className={`fixed lg:static lg:col-span-1 bg-[#22222A] p-5 z-50 h-full w-[80%] lg:w-full ease-in-out duration-300
        ${show ? "left-0" : "-left-full"}`}
      >
        <h1 className="text-white text-3xl mb-4 truncate">Alonso</h1>
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
          <MessagePreview
            username="alonso"
            message="Hola"
            date={new Date()}
            selected={true}
          />
          <MessagePreview username="alonso" message="Hola" date={new Date()} />
        </div>
      </section>
    </>
  );
};

export default Messages;

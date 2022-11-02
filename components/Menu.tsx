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
        className={`fixed lg:static lg:col-span-1 bg-[#22222A] p-4 z-50 h-screen
        ${show && "-left-full"}`}
      >
        <h1 className="text-white text-3xl mb-4">Juan</h1>
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
        <div className="mt-4">
          {/* <a href="#" className="flex justify-items-center w-full gap-2 mb-4">
            <div className="w-[15%] relative flex items-center justify-center">
              <div className="w-10 h-10 m-auto flex justify-center items-center bg-red-500 rounded-full relative">
                U
              </div>
            </div>
            <div className="w-[85%] flex justify-between">
              <div>
                <h3 className="text-gray-300 font-semibold">Alon</h3>
                <p className="text-red-400 bg-yellow-500">Hola</p>
              </div>
              <div>
                <h3 className="text-gray-500">10:30 pm</h3>
              </div>
            </div>
          </a> */}
          <MessagePreview
            username={"asdlkasdjlak"}
            message={"Hola!!!holaholaholaholaHolaaaaaaaaaaa"}
            date={new Date()}
          />
        </div>
      </section>
    </>
  );
};

export default Messages;

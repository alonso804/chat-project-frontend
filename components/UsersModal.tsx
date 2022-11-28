import { ChangeEvent, useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { getCookie } from "cookies-next";
import { UserServices } from "services/UserServices";
import { UserPreview } from "schemas/userPreview.schema";

interface DashboardProps {
  show: boolean;
  setShow: () => void;
  setReceiver: (receiver: UserPreview) => void;
}

const UsersModal: React.FC<DashboardProps> = ({
  show,
  setShow,
  setReceiver,
}) => {
  const [term, setTerm] = useState("");
  const [users, setUsers] = useState<UserPreview[]>([]);

  const searchUsers = async (input: string) => {
    const token = getCookie("token") as string;
    const filteredUsers = await UserServices.getAllUsers(token, input);
    setUsers(filteredUsers);
  };

  useEffect(() => {
    searchUsers(term);
  }, [term]);

  const searchUsersByInput = async (event: ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value);
    await searchUsers(event.target.value);
  };

  const changeChat = (receiver: UserPreview) => {
    setReceiver(receiver);
    setShow();
  };

  return (
    <>
      <div
        className={`${
          show ? "" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-[50%] right-0 left-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full flex justify-center items-center backdrop-blur-md`}
      >
        <div className="relative w-full max-w-2xl h-full md:h-auto">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Search users
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal"
                onClick={() => setShow()}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form>
              <div className="relative">
                <RiSearchLine className="absolute left-2 top-3 text-gray-300" />
                <input
                  type="text"
                  name="message"
                  autoComplete="off"
                  className="pl-8 pr-3 py-2 outline-none rounded text-white w-full"
                  placeholder="username"
                  onChange={searchUsersByInput}
                  value={term}
                  autoFocus
                />
              </div>
            </form>

            <ul className="p-2 overflow-y-scroll max-h-[calc(100%-165px)] scrollbar">
              {users.map((user: UserPreview, idx) => (
                <li
                  key={idx}
                  className="truncate p-2 hover:hover:bg-gray-600"
                  onClick={changeChat.bind(null, user)}
                >
                  {user.username}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersModal;

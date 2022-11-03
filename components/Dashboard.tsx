import type { NextPage } from "next";
import Head from "next/head";
import Menu from "components/Menu";
import Chat from "components/Chat";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { getCookie } from "cookies-next";
import { UserServices } from "services/UserServices";

const { API_URI } = process.env;

interface DashboardProps {
  username: string;
  chat?: any;
}

const Dashboard: React.FC<DashboardProps> = ({ username, chat }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <main className="h-screen 2xl:h-[95vh] 2xl:max-w-[70%] outline outline-gray-800 mx-auto 2xl:my-12 grid grid-cols-1 lg:grid-cols-4">
        <Menu show={showMenu} username={username} />
        {chat && (
          <Chat
            id={chat._id}
            messages={chat.messages}
            receiver={chat.receiver}
          />
        )}

        <button
          onClick={toggleMenu}
          className="lg:hidden fixed top-5 right-4 z-50  border-blue-700"
        >
          <AiOutlineMenu className="w-auto h-6 text-white" />
        </button>
      </main>
    </>
  );
};

export default Dashboard;

import type { NextPage } from "next";
import Head from "next/head";
import Menu from "components/Menu";
import Chat from "components/Chat";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useRouter } from "next/router";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <main className="h-screen 2xl:h-[95vh] 2xl:my-6 outline outline-gray-800 mx-auto grid grid-cols-1 lg:grid-cols-4">
        <Menu show={showMenu} />
        {router.query.username && <Chat />}

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

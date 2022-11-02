import type { NextPage } from "next";
import Head from "next/head";
import Messages from "components/Menu";
import Chat from "components/Chat";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";

const Home: NextPage = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    console.log(showMenu);
    setShowMenu(!showMenu);
  };

  return (
    <>
      <main className="h-screen w-screen grid grid-cols-1 lg:grid-cols-4">
        <Messages show={showMenu} />
        <Chat />

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

export default Home;

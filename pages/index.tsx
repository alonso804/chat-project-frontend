import type { NextPage } from "next";
import Head from "next/head";
import io, { Socket } from "socket.io-client";
import { UserServices } from "services/UserServices";
import { ChatPreview } from "schemas/chatPreview.schema";
import { useEffect, useState } from "react";
import Chat from "components/Chat";
import Menu from "components/Menu";
import UsersModal from "components/UsersModal";
import { AiOutlineMenu } from "react-icons/ai";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";
import { UserPreview } from "schemas/userPreview.schema";
import { userTable } from "utils/indexedDb";
import { decryptAesCbc } from "utils/crypto";
import { useSocket } from "hooks/useSocket";

interface HomeProps {
  token: string;
  chats: ChatPreview[];
  userInfo: {
    id: string;
    username: string;
    publicKey: string;
    privateKey: string;
  };
  socket: Socket;
}

export async function getServerSideProps(context: any) {
  const token = context.req.cookies.token as string;

  const chats = await UserServices.getUserChats(token);
  const userInfo = await UserServices.getUserInfo(token);

  return {
    props: {
      token,
      chats,
      userInfo,
    },
  };
}

const Home: NextPage<HomeProps> = ({ token, chats, userInfo }) => {
  const router = useRouter();
  const socket = useSocket("http://localhost:8080", token, userInfo);

  const [receiver, setReceiver] = useState<UserPreview>();
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [privateKey, setPrivateKey] = useState<string>("");

  if (socket) {
    socket.on("connect_error", (error) => {
      console.error(error);
      if (error.message.toLowerCase() === "invalid token") {
        deleteCookie("token");
        userTable.clear();
        router.push("/login");
      }
    });
  }

  useEffect(() => {
    const decryptPrivateKey = async () => {
      try {
        const decriptedPrivateKey = await decryptAesCbc(userInfo.privateKey);
        setPrivateKey(decriptedPrivateKey);
      } catch (error) {
        console.error(error);
      }
    };

    userTable.put(userInfo);
    decryptPrivateKey();
  }, [userInfo]);

  const onKeyDownLogout = (event: any) => {
    if (event.ctrlKey && event.key === "q") {
      socket.disconnect();
      deleteCookie("token");
      userTable.clear();
      router.push("/login");
    }
  };

  const onKeyDownSearchUsers = (event: any) => {
    if (event.ctrlKey && event.key === "i") {
      setShowModal(!showModal);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownSearchUsers);

    return () => {
      document.removeEventListener("keydown", onKeyDownSearchUsers);
    };
  });

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownLogout);

    return () => {
      document.removeEventListener("keydown", onKeyDownLogout);
    };
  });

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <Head>
        <title>Chat</title>
        <meta name="Chat" content="Chat" />
      </Head>
      <main className="h-screen 2xl:h-[95vh] 2xl:my-6 outline outline-gray-800 mx-auto grid grid-cols-1 lg:grid-cols-4">
        <Menu
          show={showMenu}
          chats={chats}
          username={userInfo.username}
          setReceiver={(receiver: UserPreview) => setReceiver(receiver)}
          socket={socket}
          privateKey={privateKey}
        />
        {receiver && (
          <Chat receiver={receiver} socket={socket} privateKey={privateKey} />
        )}

        <button
          onClick={toggleMenu}
          className="lg:hidden fixed top-5 right-4 z-50"
        >
          <AiOutlineMenu className="w-auto h-6 text-white" />
        </button>
      </main>
      <UsersModal
        show={showModal}
        setShow={() => setShowModal(!showModal)}
        setReceiver={(receiver: UserPreview) => setReceiver(receiver)}
      />
    </>
  );
};

export default Home;

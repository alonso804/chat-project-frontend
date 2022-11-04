import type { NextPage } from "next";
import Dashboard from "components/Dashboard";
import { useRouter } from "next/router";
import Head from "next/head";

interface MainPage {}

const ChatUser: NextPage<MainPage> = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{router.query.username} | Chat</title>
        <meta name="Chat" content="Chat" />
      </Head>
      <Dashboard />
    </>
  );
};

export default ChatUser;

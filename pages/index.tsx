import type { NextPage } from "next";
import Dashboard from "components/Dashboard";
import Head from "next/head";

interface HomeProps {}

const Home: NextPage<HomeProps> = () => {
  return (
    <>
      <Head>
        <title>Chat</title>
        <meta name="Chat" content="Chat" />
      </Head>
      <Dashboard />
    </>
  );
};

export default Home;

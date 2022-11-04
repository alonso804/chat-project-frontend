import type { NextPage } from "next";
import { useState } from "react";
import { getCookie } from "cookies-next";
import { UserServices } from "services/UserServices";
import Dashboard from "components/Dashboard";
import { ChatServices } from "services/ChatServices";
import { MdQueryBuilder } from "react-icons/md";

interface MainPage {
  username: string;
  chat: any;
}

// const getUsername = async (token: string) => {
//   const response = await UserServices.getUserInfo(token);
//   const data = await response.json();

//   return data.username;
// };

// const getChat = async (token: string, username: string) => {
//   const response = await ChatServices.getChat(token, username);
//   const data = await response.json();

//   return data.chat;
// };

// export async function getServerSideProps({ req, query }: any) {
//   const token = getCookie("token", { req });

//   const username = await getUsername(token as string);

//   const receiverUsername = query.username as string;
//   const chat = await getChat(token as string, receiverUsername);

//   return {
//     props: {
//       username,
//       chat,
//     },
//   };
// }

const MainPage: NextPage<MainPage> = ({ username }) => {
  return (
    <>
      <Dashboard username={username} />
    </>
  );
};

export default MainPage;

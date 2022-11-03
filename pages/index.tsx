import type { NextPage } from "next";
import { getCookie } from "cookies-next";
import { UserServices } from "services/UserServices";
import Dashboard from "components/Dashboard";

interface HomeProps {
  username: string;
}

export async function getServerSideProps({ req }: any) {
  const token = getCookie("token", { req });

  const response = await UserServices.getUserInfo(token as string);
  const data = await response.json();

  return {
    props: {
      username: data.username,
    },
  };
}

const Home: NextPage<HomeProps> = ({ username }) => {
  return (
    <>
      <Dashboard username={username} />
    </>
  );
};

export default Home;

import { setCookie } from "cookies-next";
import { Formik } from "formik";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AuthServices } from "services/AuthServices";
import { userTable } from "utils/indexedDb";
import { deleteCookie } from "cookies-next";

const Login: NextPage = () => {
  const [failMessage, setFailMessage] = useState("");
  const router = useRouter();

  userTable.clear();
  deleteCookie("token");

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="Login" content="Login" />
      </Head>
      <main className="bg-[#1E1F24] h-screen 2xl:h-[50vh] 2xl:max-w-[50%] outline outline-gray-800 mx-auto 2xl:my-56 flex flex-col gap-14 justify-center">
        <h1 className="text-white text-5xl text-center">Chat UI</h1>
        <Formik
          initialValues={{
            username: "",
            password: "Aa1#234567",
          }}
          validate={(values) => {
            const errors = {
              username: "",
              password: "",
            };

            if (!values.username) {
              errors.username = "Username is required";
            }

            if (!values.password) {
              errors.password = "Password is required";
            }

            return errors.password || errors.username ? errors : {};
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await AuthServices.login(
                values.username,
                values.password
              );

              const data = await response.json();

              setSubmitting(false);

              if (response.status === 200) {
                setCookie("token", data.token);
                router.push("/");
              } else {
                setFailMessage(data.message);
              }
            } catch (error) {
              console.log(error);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 justify-center justify-items-center"
            >
              <div className="m-auto">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  autoComplete="off"
                  value={values.username}
                  autoFocus
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-transparent m-auto text-white p-2 rounded-full text-center border border-white focus:border-purple-400 outline-none placeholder-gray-400"
                />
                {errors.username && touched.username && (
                  <p className="text-red-500 text-center pt-3">
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="m-auto">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="bg-transparent m-auto text-white p-2 rounded-full text-center border border-white focus:border-purple-400 outline-none placeholder-gray-400 "
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-center pt-3">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="border border-purple-500 m-auto px-8 hover:px-12 hover:bg-purple-500 hover:text-[#1E1F24] transition-all text-white p-2 rounded text-center"
              >
                Login
              </button>
              {failMessage && (
                <p className="text-red-500 text-center">{failMessage}</p>
              )}

              <Link href="/signup">
                <p className="m-auto text-gray-400 cursor-pointer hover:text-purple-500">
                  Don&apos;t have an account? Sign up
                </p>
              </Link>
            </form>
          )}
        </Formik>
      </main>
    </>
  );
};

export default Login;

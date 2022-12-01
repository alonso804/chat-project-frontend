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
import { verifyToken } from "utils/googleAuthenticator";
import { decryptAesCbc } from "utils/crypto";

const Login: NextPage = () => {
  const [failMessage, setFailMessage] = useState("");
  const [googleAuth, setGoogleAuth] = useState(false);
  const [googleAuthSecret, setGoogleAuthSecret] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const router = useRouter();

  userTable.clear();
  deleteCookie("token");

  const resetStates = () => {
    setGoogleAuth(false);
    setGoogleAuthSecret("");
    setJwtToken("");
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="Login" content="Login" />
      </Head>
      <main className="bg-[#1E1F24] h-screen 2xl:h-[50vh] 2xl:max-w-[50%] outline outline-gray-800 mx-auto 2xl:my-56 flex flex-col gap-14 justify-center">
        <h1 className="text-white text-5xl text-center">Chat UI - Login</h1>
        <Formik
          initialValues={{
            username: "",
            password: "Aa1#234567",
            googleAuthCode: "",
          }}
          validate={(values) => {
            const errors = {
              username: "",
              password: "",
              googleAuthCode: "",
            };

            if (!values.username) {
              errors.username = "Username is required";
            }

            if (!values.password) {
              errors.password = "Password is required";
            }

            if (googleAuth && !values.googleAuthCode) {
              errors.googleAuthCode = "Google Authenticator code is required";
            }

            return errors.password || errors.username || errors.googleAuthCode
              ? errors
              : {};
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              if (googleAuth) {
                const isValidToken = verifyToken(
                  values.googleAuthCode,
                  await decryptAesCbc(
                    googleAuthSecret,
                    process.env.GOOGLE_AUTH_SECRET as string
                  )
                );

                setSubmitting(false);

                if (!isValidToken) {
                  resetStates();
                  setFailMessage(
                    "Invalid username, password or Google Authenticator code"
                  );
                  return;
                }

                setCookie("token", jwtToken);
                router.push("/");
                return;
              }

              const response = await AuthServices.login(
                values.username,
                values.password
              );

              const data = await response.json();

              setSubmitting(false);
              setGoogleAuth(true);

              if (response.status === 200 && !data.message) {
                setJwtToken(data.token);
                setGoogleAuthSecret(data.googleAuthSecret);
                return;
              }
            } catch (error) {
              console.error(error);
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
              {!googleAuth && (
                <>
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
                </>
              )}

              {googleAuth && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-center font-semibold text-2xl">{`chat-ui-${values.username}`}</h2>
                  <div className="m-auto">
                    <input
                      type="password"
                      name="googleAuthCode"
                      placeholder="Code"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                      value={values.googleAuthCode}
                      className="bg-transparent m-auto text-white p-2 text-center border border-white focus:border-purple-400 outline-none placeholder-gray-400 "
                      autoFocus
                    />

                    {errors.googleAuthCode && touched.googleAuthCode && (
                      <p className="text-red-500 text-center pt-3">
                        {errors.googleAuthCode}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="border border-purple-500 m-auto px-8 hover:px-12 hover:bg-purple-500 hover:text-[#1E1F24] transition-all text-white p-2 rounded text-center"
                  >
                    Verify
                  </button>
                  <p
                    className="m-auto text-gray-400 cursor-pointer hover:text-purple-500"
                    onClick={() => resetStates()}
                  >
                    Return to login
                  </p>
                </div>
              )}
            </form>
          )}
        </Formik>
      </main>
    </>
  );
};

export default Login;

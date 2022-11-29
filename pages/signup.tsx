import { deleteCookie, setCookie } from "cookies-next";
import { Formik } from "formik";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AuthServices } from "services/AuthServices";
import { MIN_USERNAME_LENGTH, PASSWORD_REGEX } from "utils/constants";
import { encryptAesCbc, generateKeys } from "utils/crypto";
import { createSecret, verifyToken } from "utils/googleAuthenticator";
import { userTable } from "utils/indexedDb";

const Signup: NextPage = () => {
  const [failMessage, setFailMessage] = useState("");
  const [googleAuth, setGoogleAuth] = useState(false);
  const [googleAuthQR, setGoogleAuthQR] = useState("");
  const [googleAuthSecret, setGoogleAuthSecret] = useState("");
  const router = useRouter();

  userTable.clear();
  deleteCookie("token");

  const resetStates = () => {
    setGoogleAuth(false);
    setGoogleAuthQR("");
    setGoogleAuthSecret("");
  };

  return (
    <>
      <Head>
        <title>Signup</title>
        <meta name="Signup" content="Signup" />
      </Head>
      <main className="bg-[#1E1F24] h-screen 2xl:h-[50vh] 2xl:max-w-[50%] outline outline-gray-800 mx-auto 2xl:my-56 flex flex-col gap-14 justify-center">
        <h1 className="text-white text-5xl text-center">Chat UI - Signup</h1>
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

            if (values.username.length < MIN_USERNAME_LENGTH) {
              errors.username = "Username must be at least 3 characters";
            }

            if (!values.password) {
              errors.password = "Password is required";
            }

            if (!PASSWORD_REGEX.test(values.password)) {
              errors.password =
                "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character";
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
              if (!googleAuth) {
                const googleAuthenticatorSecret = await createSecret(
                  values.username
                );
                setGoogleAuthQR(googleAuthenticatorSecret.uri);
                setGoogleAuthSecret(googleAuthenticatorSecret.secret);
                setGoogleAuth(true);

                return;
              }

              const isTokenValid = verifyToken(
                values.googleAuthCode,
                googleAuthSecret
              );

              if (!isTokenValid) {
                setSubmitting(false);
                values.googleAuthCode = "";
                resetStates();
                setFailMessage("Google auth code is invalid");
                return;
              }

              const { publicKeyJwk, encryptedPrivateKey } =
                await generateKeys();

              const response = await AuthServices.signup(
                values.username,
                values.password,
                JSON.stringify(publicKeyJwk),
                encryptedPrivateKey,
                await encryptAesCbc(
                  googleAuthSecret,
                  process.env.GOOGLE_AUTH_SECRET as string
                )
              );

              const data = await response.json();

              setSubmitting(false);

              if (response.status === 200) {
                setCookie("token", data.token);
                router.push("/");
              } else {
                values.googleAuthCode = "";
                resetStates();
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {!googleAuth && (
                <>
                  <div className="m-auto">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      autoComplete="off"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      autoFocus
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
                    Sign up
                  </button>
                  {failMessage && (
                    <p className="text-red-500 text-center">{failMessage}</p>
                  )}

                  <Link href="/login">
                    <p className="m-auto text-gray-400 cursor-pointer hover:text-purple-500">
                      Already have an account? Login
                    </p>
                  </Link>
                </>
              )}

              {googleAuth && (
                <div className="flex flex-col gap-4">
                  <p className="text-white text-center">
                    Scan the QR code with Google Authenticator
                  </p>
                  <div className="m-auto">
                    <Image
                      src={googleAuthQR}
                      alt="QR code"
                      width={250}
                      height={250}
                    />
                  </div>
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
                    Return to signup
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

export default Signup;

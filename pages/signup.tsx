import { setCookie } from "cookies-next";
import { Formik } from "formik";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AuthServices } from "services/AuthServices";

const Signup: NextPage = () => {
  const [fail, setFail] = useState({ open: false, message: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generateKeys = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"]
    );
    const publicKeyJwk = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.publicKey
    );
    const privateKeyJwk = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.privateKey
    );

    return { publicKeyJwk, privateKeyJwk };
  };

  // const bufferABase64 = (buffer: any) =>
  //   btoa(String.fromCharCode(...new Uint8Array(buffer)));

  // const base64ABuffer = (buffer: any) =>
  //   Uint8Array.from(atob(buffer), (c) => c.charCodeAt(0));

  // const derivationBasedOnSecret = async (
  //   secret: string,
  //   sal: Uint8Array,
  //   iteraciones: number,
  //   longitud: number,
  //   hash: string,
  //   algoritmo = "AES-CBC"
  // ) => {
  //   const encoder = new TextEncoder();
  //   let keyMaterial = await window.crypto.subtle.importKey(
  //     "raw",
  //     encoder.encode(secret),
  //     { name: "PBKDF2" },
  //     false,
  //     ["deriveKey"]
  //   );
  //   return await window.crypto.subtle.deriveKey(
  //     {
  //       name: "PBKDF2",
  //       salt: encoder.encode(String(sal)),
  //       iterations: iteraciones,
  //       hash,
  //     },
  //     keyMaterial,
  //     { name: algoritmo, length: longitud },
  //     false,
  //     ["encrypt", "decrypt"]
  //   );
  // };

  // const encrypt = async (secret: string, text: string) => {
  //   const encoder = new TextEncoder();
  //   const sal = window.crypto.getRandomValues(new Uint8Array(16));
  //   const vectorInicializacion = window.crypto.getRandomValues(
  //     new Uint8Array(16)
  //   );
  //   const bufferTextoPlano = encoder.encode(text);
  //   const clave = await derivationBasedOnSecret(
  //     secret,
  //     sal,
  //     100000,
  //     256,
  //     "SHA-256"
  //   );
  //   const encrypted = await window.crypto.subtle.encrypt(
  //     { name: "AES-CBC", iv: vectorInicializacion },
  //     clave,
  //     bufferTextoPlano
  //   );
  //   return bufferABase64([
  //     ...sal,
  //     ...vectorInicializacion,
  //     ...new Uint8Array(encrypted),
  //   ]);
  // };

  return (
    <>
      <Head>
        <title>Signup</title>
        <meta name="Signup" content="Signup" />
      </Head>
      <main className="bg-[#1E1F24] h-screen 2xl:h-[50vh] 2xl:max-w-[50%] outline outline-gray-800 mx-auto 2xl:my-56 flex flex-col gap-14 justify-center">
        <h1 className="text-white text-5xl text-center">Chat UI</h1>
        <Formik
          initialValues={{
            username: "",
            password: "",
            phoneNumber: "",
          }}
          validate={(values) => {
            const errors = {
              username: "",
              password: "",
              phoneNumber: "",
            };

            if (!values.username) {
              errors.username = "Username is required";
            }

            if (!values.password) {
              errors.password = "Password is required";
            }

            if (!values.phoneNumber) {
              errors.phoneNumber = "Phone number is required";
            }

            return errors.password || errors.username ? errors : {};
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const { publicKeyJwk, privateKeyJwk } = await generateKeys();
              console.log(privateKeyJwk);

              const response = await AuthServices.signup(
                values.username,
                values.password,
                values.phoneNumber,
                JSON.stringify(publicKeyJwk),
                "123"
              );

              const data = await response.json();

              setSubmitting(false);

              if (response.status === 200) {
                setCookie("token", data.token);
                router.push("/");
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

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                className="bg-transparent m-auto text-white p-2 rounded-full text-center border border-white focus:border-purple-400 outline-none placeholder-gray-400 "
              />

              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                value={values.phoneNumber}
                className="bg-transparent m-auto text-white p-2 rounded-full text-center border border-white focus:border-purple-400 outline-none placeholder-gray-400 "
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="border border-purple-500 m-auto px-8 hover:px-12 hover:bg-purple-500 hover:text-[#1E1F24] transition-all text-white p-2 rounded text-center"
              >
                Sign up
              </button>

              <Link href="/login">
                <p className="m-auto text-gray-400 cursor-pointer hover:text-purple-500">
                  Already have an account? Login
                </p>
              </Link>
            </form>
          )}
        </Formik>
      </main>
    </>
  );
};

export default Signup;

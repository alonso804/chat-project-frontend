import Input from "containers/Input";
import { Formik } from "formik";
import { NextPage } from "next";
import { useState } from "react";
import { AuthServices } from "services/AuthServices";

const Login: NextPage = () => {
  const [fail, setFail] = useState({ open: false, message: "" });
  const [loading, setLoading] = useState(false);

  return (
    <>
      <main className="bg-[#1E1F24] h-screen 2xl:h-[50vh] 2xl:max-w-[50%] outline outline-gray-800 mx-auto 2xl:my-96 flex flex-col gap-14 justify-center">
        <h1 className="text-white text-5xl text-center">Chat UI</h1>
        <Formik
          initialValues={{
            /*
             *username: "alonso804",
             *password: "1234",
             */
            username: "",
            password: "",
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
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            AuthServices.login(values.username, values.password)
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                console.log(error);
              });

            setSubmitting(false);
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
                value={values.username}
                autoFocus
                onChange={handleChange}
                onBlur={handleBlur}
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="border border-purple-500 m-auto px-8 hover:px-12 hover:bg-purple-500 hover:text-[#1E1F24] transition-all text-white p-2 rounded text-center"
              >
                Login
              </button>
            </form>
          )}
        </Formik>
      </main>
    </>
  );
};

export default Login;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthService from "@/Services/auth.service";
import { login as AuthLogin } from "@/Store/auth.store";
import { Helmet } from "react-helmet";
import GoogleAuth from "@/Components/Auth/GoogleLoginButton";

function Login() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (data) => {
    setLoading(true);
    setError("");

    try {
      const res = await AuthService.login(data);

      if (res && res.data) {
        const { user, accessToken, refreshToken } = res.data;

        if (user && accessToken && refreshToken) {
          dispatch(
            AuthLogin({
              user,
              accessToken,
              refreshToken,
            })
          );
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          navigate("/dashboard");
        } else {
          console.error("Missing fields in response:", res.data);
          setError("Login failed. Missing data in response.");
        }
      }
    } catch (error) {
      console.error("Login failed with error:", error);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Actionote - Login</title>
        <meta name="description" content="Login to your Actionote account" />
        <meta property="og:title" content="Actionote - Login" />
        <meta
          property="og:description"
          content="Login to your Actionote account"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://actionote.com/login" />
        <meta
          property="og:image"
          content="https://actionote.com/assets/actionote-logo.webp"
        />
        <meta property="og:site_name" content="Actionote" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Actionote - Login" />
      </Helmet>
      <main className="w-full h-screen flex flex-col overflow-y-hidden justify-center items-center dark:bg-[#1d1d1d] dark:text-white">
      <h3 className="text-[18vh] rotate-90 lg:rotate-0 lg:text-[18em] leading-none absolute z-10 -right-8 lg:right-0 lg:w-screen lg:bottom-12  font-extralight text-center text-[#39a2ff30]">
          ACTOINOTE
        </h3>
        <h3 className="text-8xl z-20 font-normal text-left mt-2 text-[#39a2ff] drop-shadow-xl p-3">
          Welcome Back
        </h3>

        <p className=" text-center z-20  font-greatvibes text-xl ">
        We're happy to see you again. Please log in to continue.
        </p>
        <div className="form-left z-20 w-full h-screen flex justify-center items-start mt-12">
          <div className="w-11/12 lg:w-1/3 h-fit border bg-white shadow-gray-100 dark:shadow-gray-600 shadow-md dark:bg-[#1d1d1d] px-4 pt-10 pb-12 lg:px-16">
            <p className="text-2xl text-center font-bold dark:text-[#f2f3f4] font-greatvibes tracking-widest mb-10">
              Sign In
            </p>

            <form
              onSubmit={handleSubmit(login)}
              className="w-full h-fit flex flex-col"
            >
              <label htmlFor="email" className="mb-[1px]">
                Email:
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-[#ececec] text-black dark:text-white dark:bg-[#2b2b2b] outline-none px-4 h-8 rounded-2xl mb-4"
              />
              <label htmlFor="password" className="mb-[1px]">
                Password:
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Enter password"
                className="bg-[#ececec] text-black dark:text-white dark:bg-[#2b2b2b] outline-none px-4 h-8 rounded-2xl mb-4"
              />
              {error && <p className="text-red-500 text-center">{error}</p>}
              <button
                type="submit"
                className="bg-[#39a2ff] text-[#2b2b2b] font-bold py-2 px-4 mt-4 rounded-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
            <p className="text-center text-sm mt-2">
              Don't have an account?{" "}
              <Link className="text-[#39a2ff] font-bold" to="/register">
                Sign Up
              </Link>
            </p>
            <div className="w-full">
              <p className="text-center py-2">-or-</p>
            <GoogleAuth/>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;

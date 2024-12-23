import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthService from "@/Services/auth.service";
import { login as AuthLogin } from "@/Store/auth.store";
import { Helmet } from "react-helmet";

function Login() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (data) => {
    setLoading(true);
    setError("");
    console.log("Form data:", data);
  
    try {
      const res = await AuthService.login(data);
      console.log("Response from login API:", res.data);
  
      if (res && res.data) {
        const { user, accessToken, refreshToken } = res.data; // Access user inside res.data
  
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
          content="https://actionote.com/assets/actionote-logo.png"
        />
        <meta property="og:site_name" content="Actionote" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Actionote - Login" />
      </Helmet>
      <main className="w-full h-screen flex flex-col justify-center items-center dark:bg-[#2b2b2b] dark:text-white pt-10 gap-2">
        <h3 className=" text-4xl font-bold text-center text-[#39a2ff]">
          ACTOINOTE
        </h3>
        <h3 className=" text-4xl font-bold text-center">Welcome Back</h3>
        <p className=" text-center  font-greatvibes text-xl ">
          Please log in to your account
        </p>
        <div className="form-left w-full h-screen flex justify-center items-start mt-12">
          <div className="w-11/12 lg:w-1/3 h-fit rounded-xl border border-[#2b2b2b] dark:border-none dark:bg-[#3b3b3b] pb-5  px-4 lg:px-16">
            <p className="text-2xl text-center font-bold font-greatvibes tracking-widest my-4">
              Log In
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
                className="bg-[#ececec] text-black dark:text-white dark:bg-[#2b2b2b] outline-none px-2 h-8 rounded-lg mb-4"
              />
              <label htmlFor="password" className="mb-[1px]">
                Password:
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Enter password"
                className="bg-[#ececec] text-black dark:text-white dark:bg-[#2b2b2b] outline-none px-2 h-8 rounded-lg mb-4"
              />
              {error && <p className="text-red-500 text-center">{error}</p>}
              <button
                type="submit"
                className="bg-[#39a2ff] text-[#2b2b2b] font-bold py-2 px-4 mt-4 rounded-md"
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
            {/* <div
            onClick={googleLogin}
            className="w-full h-fit flex items-center justify-start gap-3 bg-red-400 py-1 px-4 rounded-md cursor-pointer"
          >
            <div className="logoHolder w-10 h-10 bg-black"></div>
            <h1 className="text-xl text-center font-semibold">Log in with Google</h1>
          </div> */}
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;

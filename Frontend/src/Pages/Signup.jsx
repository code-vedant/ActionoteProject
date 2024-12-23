import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthService from "@/Services/auth.service";
import { login as AuthLogin } from "@/Store/auth.store";
import { Helmet } from "react-helmet";

function Signup() {
  const avatarRef = useRef();
  const [avatar, setAvatar] = useState(null);
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleClick = () => {
    avatarRef.current.click();
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const signup = async (data) => {
    if (!agreeTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    {
      avatar && formData.append("avatar", avatar);
    }

    try {
      const res = await AuthService.signup(formData);
      if (res) {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        console.log(res.data);
        dispatch(
          AuthLogin({
            user: res.data.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          })
        );
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Helmet>
      <title>Actionote - Signup</title>
      <meta
        name="description"
        content="Create a free account and start planning your next action-oriented project today."
      />
      <meta
        name="keywords"
        content="actionote, signup, project planning, action-oriented, account"
      />
      <meta property="og:title" content="Actionote - Signup" />
      <meta property="og:description" content="Create a free account and start planning your next action-oriented project today." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://actionote.com/signup" />
      <meta property="og:image" content="https://actionote.com/assets/actionote-logo.png" />
      <meta property="og:site_name" content="Actionote" />
    </Helmet>
      <main className="w-full h-screen flex flex-col justify-center items-center dark:bg-[#2b2b2b] dark:text-white">
        <h3 className="text-3xl lg:text-4xl text-[#39a2ff] font-bold text-center mt-4">
          ACTIONOTE
        </h3>

        <h3 className="text-3xl lg:text-4xl font-bold text-center mt-4">
          Create your free account
        </h3>
        <p className=" text-center font-greatvibes text-xl">
          Start planning your next action-oriented project today
        </p>
        <div className="form-left w-full h-screen flex items-start justify-center pt-10 lg:pt-5">
          <div className="w-11/12 lg:w-1/3 h-fit lg:h-[75vh] rounded-xl border border-[#2b2b2b] dark:border-none dark:bg-[#3b3b3b] px-4 pb-5 lg:px-16">
            <p className="text-2xl text-center font-greatvibes tracking-widest my-4 ">
              Enter your details.
            </p>

            <form
              onSubmit={handleSubmit(signup)}
              className="w-full  h-fit flex flex-col"
            >
              <div className="flex items-center justify-center w-full h-fit">
                {avatar && (
                  <img
                    src={URL.createObjectURL(avatar)}
                    className=" w-16 h-16 rounded-full"
                    onClick={handleClick}
                    alt="Avatar Preview"
                  />
                )}
                {!avatar && (
                  <div
                    onClick={handleClick}
                    className="w-16 h-16 flex items-center font-greatvibes tracking-wider border rounded-full border-[#2b2b2b] justify-center"
                  >
                    Upload
                  </div>
                )}
              </div>
              <input
                type="file"
                onChange={handleUpload}
                ref={avatarRef}
                className="hidden"
              />
              <label htmlFor="fullName" className="mb-[1px]">
                Full Name:
              </label>
              <input
                {...register("fullName")}
                id="fullName"
                type="text"
                placeholder="Enter your name"
                className=" bg-[#ececec] text-black dark:text-white dark:bg-[#2b2b2b] outline-none px-2 h-8 rounded-lg mb-4"
              />
              <label htmlFor="email" className="mb-[1px]">
                Email:
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="Enter your email"
                className=" bg-[#ececec] text-black dark:text-white dark:bg-[#2b2b2b] outline-none px-2 h-8 rounded-lg mb-4"
              />
              <label htmlFor="password" className="mb-[1px]">
                Password:
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Enter password"
                className=" bg-[#ececec] text-black dark:text-white dark:bg-[#2b2b2b] outline-none px-2 h-8 rounded-lg mb-4"
              />
              <label htmlFor="confirmPassword" className="mb-[1px]">
                Confirm Password:
              </label>
              <input
                {...register("confirmPassword")}
                id="confirmPassword"
                placeholder="Confirm password"
                type="password"
                className=" bg-[#ececec] text-black dark:text-white dark:bg-[#2b2b2b] outline-none px-2 h-8 rounded-lg"
              />
              <div className="flex items-center justify-center gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                  className="text-md"
                />
                <label className="text-md">
                  I agree to the terms&conditions and policy.
                </label>
              </div>
              <button
                type="submit"
                className="bg-sky-blue text-[#2b2b2b] font-bold py-2 px-4 mt-4 rounded-md"
              >
                Sign Up
              </button>
            </form>
            <p className="text-center text-sm mt-2">
              Already have an account?{" "}
              <Link className="text-sky-blue font-bold" to="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
        {/* <div className="form-right w-full h-screen flex items-center justify-start pl-11">
        <div className="w-2/3 h-[75vh] rounded-xl flex flex-col items-start justify-center gap-7 pl-2 pr-32">
          <div onClick={googleLogin} className="w-full h-fit flex items-center justify-start gap-3 bg-red-400 py-1 px-4 rounded-md">
            <div className="logoHolder w-10 h-10 bg-black "></div>
            <h1 className="text-xl text-center font-semibold">
              Sign up with Google
            </h1>
          </div>
          <div className="w-full h-fit flex items-center justify-start gap-3 bg-red-400 py-1 px-4 rounded-md">
            <div className="logoHolder w-10 h-10 bg-black "></div>
            <h1 className="text-xl text-center font-semibold">
              Sign up with Google
            </h1>
          </div>
          <div className="w-full h-fit flex items-center justify-start gap-3 bg-red-400 py-1 px-4 rounded-md">
            <div className="logoHolder w-10 h-10 bg-black "></div>
            <h1 className="text-xl text-center font-semibold">
              Sign up with Google
            </h1>
          </div>
          <div className="w-full h-fit flex items-center justify-start gap-3 bg-red-400 py-1 px-4 rounded-md">
            <div className="logoHolder w-10 h-10 bg-black "></div>
            <h1 className="text-xl text-center font-semibold">
              Sign up with Google
            </h1>
          </div>
        </div>
      </div> */}
      </main>
    </>
  );
}

export default Signup;

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthService from "@/Services/auth.service";
import { login as AuthLogin } from "@/Store/auth.store";
import { Helmet } from "react-helmet";

function Signup() {
  const avatarRef = useRef();
  const [avatar, setAvatar] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
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
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await AuthService.signup(formData);
      console.log(res);

      if (res) {
        sessionStorage.setItem("accessToken", res.data.accessToken);
        sessionStorage.setItem("refreshToken", res.data.refreshToken);
        dispatch(
          AuthLogin({
            user: res.data.user,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
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
        <meta
          property="og:description"
          content="Create a free account and start planning your next action-oriented project today."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://actionote.com/signup" />
        <meta
          property="og:image"
          content="https://actionote.com/assets/actionote-logo.png"
        />
        <meta property="og:site_name" content="Actionote" />
      </Helmet>
      <main className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center dark:bg-[#1d1d1d] dark:text-white">
        <h3 className="text-[18vh] rotate-90 lg:rotate-0 lg:text-[18em] leading-none absolute z-10 -right-8 lg:right-0 lg:w-screen lg:bottom-12  font-extralight text-center text-[#39a2ff30]">
          ACTOINOTE
        </h3>
        <h3 className="text-7xl z-20 lg:text-8xl font-light text-center mt-4">
          Create your <span className="text-[#39a2ff]">free</span> account
        </h3>

        <div className="form-left z-20 w-full h-screen flex items-start justify-center pt-10 lg:pt-5">
          <div className="w-11/12 lg:w-1/3 h-fit lg:h-[75vh] border bg-white shadow-gray-100 dark:shadow-gray-600 shadow-md dark:bg-[#1d1d1d] px-4 pb-5 lg:px-16">
            <p className="text-2xl text-center font-greatvibes tracking-widest my-4">
              Let's create your account.
            </p>

            <form
              onSubmit={handleSubmit(signup)}
              className="w-full h-fit flex flex-col"
            >
              <div className="flex items-center justify-center w-full h-fit">
                {avatar && (
                  <img
                    src={URL.createObjectURL(avatar)}
                    className="w-16 h-16 rounded-full"
                    onClick={handleClick}
                    alt="Avatar Preview"
                  />
                )}
                {!avatar && (
                  <div
                    onClick={handleClick}
                    className="w-16 h-16 flex items-center font-greatvibes tracking-wider border rounded-full bg-[#ececec] dark:bg-[#2b2b2b] justify-center"
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
                {...register("fullName", { required: "Full Name is required" })}
                id="fullName"
                type="text"
                placeholder="Enter your name"
                className="bg-[#ececec] text-black dark:text-white dark:bg-[#2b2b2b] outline-none px-4 h-8 rounded-2xl mb-4"
              />
              {errors.fullName && (
                <p className="text-red-500">{errors.fullName.message}</p>
              )}

              <label htmlFor="email" className="mb-[1px]">
                Email:
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-[#ececec] text-black dark:text-white dark:bg-[#2b2b2b] outline-none px-4 h-8 rounded-2xl mb-4"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}

              <label htmlFor="password" className="mb-[1px]">
                Password:
              </label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                id="password"
                type="password"
                placeholder="Enter password"
                className="bg-[#ececec] text-black dark:text-white dark:bg-[#2b2b2b] outline-none px-4 h-8 rounded-2xl mb-4"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}

              <label htmlFor="confirmPassword" className="mb-[1px]">
                Confirm Password:
              </label>
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                id="confirmPassword"
                placeholder="Confirm password"
                type="password"
                className="bg-[#ececec] text-black dark:text-white dark:bg-[#2b2b2b] outline-none px-4 h-8 rounded-2xl"
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}

              <div className="flex items-center justify-center gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                  className="text-md"
                />
                <label className="text-md">
                  I agree to the terms & conditions and policy.
                </label>
              </div>
              {error && (
                <p className="text-red-500 text-center mt-2">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#39a2ff] text-white font-bold py-2 px-4 mt-4 rounded-full ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-indigo-700"
                }`}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
            <p className="text-center text-sm mt-2">
              Already have an account?{" "}
              <Link className="text-[#39a2ff] font-bold" to="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default Signup;

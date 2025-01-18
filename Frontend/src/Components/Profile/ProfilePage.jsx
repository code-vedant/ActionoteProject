import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import AuthService from "@/Services/auth.service";
import { login } from "@/Store/auth.store";

const ProfilePage = () => {
  const { theme } = useTheme();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [avatar, setAvatar] = useState(user.avatar);
  const avatarRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm();

  const handleClick = () => {
    avatarRef.current.click();
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("avatar", file);
        const response = await AuthService.updateAvatar(formData, accessToken);
        setAvatar(response.data.avatar);
        dispatch(login({ user: { ...user, avatar: response.data.avatar }, accessToken }));
        setMessage("Avatar updated successfully.");
      } catch (error) {
        setMessage("Failed to update avatar. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await AuthService.updateProfile(data, accessToken);
      dispatch(login({ user: response.data, accessToken }));
      setMessage("Profile updated successfully.");
      reset(data);
    } catch (error) {
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setLoading(true);
    setPasswordMessage("");
    try {
      await AuthService.changePassword(data, accessToken);
      setPasswordMessage("Password changed successfully.");
      resetPassword();
    } catch (error) {
      setPasswordMessage("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full min-h-screen ${theme === "dark" ? "bg-[#1c1c1c] text-white" : "bg-[#ffffff] text-black"} lg:px-40`}>
      <h1 className="text-7xl font-light text-[#39a2ff] mb-2">Profile</h1>
      <div className="flex flex-col items-center mb-2">
        {avatar ? (
          <img
            src={avatar}
            className="w-24 h-24 rounded-full"
            onClick={handleClick}
            alt="Avatar"
          />
        ) : (
          <img
            src={user.avatar}
            className="w-24 h-24 rounded-full"
            onClick={handleClick}
            alt="Avatar"
          />
        )}
        <input
          type="file"
          onChange={handleUpload}
          ref={avatarRef}
          className="hidden"
        />
        <button
          onClick={handleClick}
          className="mt-2 px-4 py-2 bg-[#39a2ff] text-white rounded-full hover:bg-blue-600"
        >
          Change Avatar
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 lg:px-40">
        <div>
          <label className="block text-lg">Name:</label>
          <input
            type="text"
            defaultValue={user.fullName}
            className={`w-full px-2 py-1 border ${theme === "dark" ? "bg-[#282828] border-[#444] text-white" : "border-gray-300"} rounded-full`}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-lg">Email:</label>
          <input
            type="email"
            defaultValue={user.email}
            className={`w-full px-2 py-1 border ${theme === "dark" ? "bg-[#282828] border-[#444] text-white" : "border-gray-300"} rounded-full`}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-6 py-2 rounded-full ${loading ? "opacity-50 cursor-not-allowed" : ""} ${theme === "dark" ? "bg-[#39a2ff] text-white" : "bg-[#39a2ff] text-white"} hover:bg-blue-600`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
      {message && <p className="mt-4">{message}</p>}

      <h2 className="text-3xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4 lg:px-40">
        <div>
          <label className="block text-lg">Current Password:</label>
          <input
            type="password"
            className={`w-full px-2 py-1 border ${theme === "dark" ? "bg-[#282828] border-[#444] text-white" : "border-gray-300"} rounded-full`}
            {...registerPassword("currentPassword", { required: "Current password is required" })}
          />
          {passwordErrors.currentPassword && <p className="text-red-500">{passwordErrors.currentPassword.message}</p>}
        </div>

        <div>
          <label className="block text-lg">New Password:</label>
          <input
            type="password"
            className={`w-full px-2 py-1 border ${theme === "dark" ? "bg-[#282828] border-[#444] text-white" : "border-gray-300"} rounded-full`}
            {...registerPassword("newPassword", { required: "New password is required" })}
          />
          {passwordErrors.newPassword && <p className="text-red-500">{passwordErrors.newPassword.message}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-6 py-2 rounded-full ${loading ? "opacity-50 cursor-not-allowed" : ""} ${theme === "dark" ? "bg-[#39a2ff] text-white" : "bg-[#39a2ff] text-white"} hover:bg-blue-600`}
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
      {passwordMessage && <p className="mt-4">{passwordMessage}</p>}
    </div>
  );
};

export default ProfilePage;

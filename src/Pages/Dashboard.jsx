import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import logoblue from "../assets/Icons/logoblue.png";
import SideBar from "@/Components/SideBar";
import shiba from "../assets/Icons/shiba.jpg";
import exit from "../assets/Icons/exit.png";
import TagsService from "@/Services/tags.service";
import { setTags } from "@/Store/tags.store";
import userIcon from "../assets/Icons/user.png";
import tag from "../assets/Icons/tag.png";
import { ScreenProvider } from "@/context/ScreenContext";

function Dashboard() {
  const [viewSidebar, setViewSidebar] = useState(false);
  const [viewBox, setViewBox] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  let lastScrollY = 0;

  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // Handle Navbar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsNavbarVisible(false); // Hide navbar on scroll down
      } else {
        setIsNavbarVisible(true); // Show navbar on scroll up
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle sidebar visibility
  const handleSidebarToggle = () => setViewSidebar((prev) => !prev);

  // Handle user profile hover and click interactions
  const handleUserMenuToggle = () => {
    if (isClicked) {
      setIsClicked(false);
      setViewBox(false);
    } else {
      setIsClicked(true);
      setViewBox(true);
    }
  };

  const fetchUsertags = async () => {
    try {
      const res = await TagsService.getUserTags(accessToken);
      dispatch(setTags(res.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsertags();
  }, [accessToken]);

  const motivators = [
    "You've got this!",
    "Keep shining bright!",
    "Believe in yourself!",
    "Make today amazing!",
  ];

  function getRandomMotivator() {
    return motivators[Math.floor(Math.random() * motivators.length)];
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Actionote</title>
        <meta name="description" content="Your personal digital space" />
      </Helmet>
    <ScreenProvider>
    <main className="w-full h-fit min-h-screen bg-[#f0f4fa] dark:bg-[#1a1a1a] dark:text-white overflow-hidden">
        {/* Navbar Section */}
        <section
          className={`navbar fixed z-50 bg-inherit w-full h-16 flex items-center justify-between px-1 transform duration-200 ${
            isNavbarVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {/* Sidebar Toggle Button */}
          <div className="sideBarIcon h-12 w-12">
            <SideBar
              viewSidebar={viewSidebar}
              handleview={handleSidebarToggle}
            />
          </div>

          {/* Branding Section */}
          <div
            className={`branding h-12 w-72 md:w-full flex items-center justify-center md:justify-start gap-1 transform duration-300 ${
              viewSidebar ? "md:pl-44" : ""
            }`}
          >
            <div className="logo w-12 h-12 flex items-center justify-center">
              <img className="w-3/4 h-3/4" src={logoblue} alt="Logo" />
            </div>
            <h1 className="text-3xl text-center font-semibold">Actionote</h1>
          </div>

          {/* User Profile Section */}
          <div className="userMenu relative h-12 w-12 mr-2">
            <div
              className="flex flex-col items-center justify-center object-cover rounded-full w-10 h-10 bg-slate-50 transform transition-all duration-200"
              onMouseEnter={() => !isClicked && setViewBox(true)}
              onMouseLeave={() => !isClicked && setViewBox(false)}
              onClick={handleUserMenuToggle}
            >
              {user ? (
                <img src={user?.avatar} alt="User Avatar" className="w-full h-full rounded-full" />
              ) : (
                <img
                  src={shiba}
                  alt="User Avatar"
                  className="w-full h-full rounded-full"
                />
              )}
            </div>

            {/* User Menu Dropdown */}
            {viewBox && (
              <div className="userTab absolute bg-[#f7f8fa] dark:bg-[#1d1d1d] shadow-lg z-50 rounded-lg h-56 right-1 top-12 w-72 p-2">
                <div className="w-full h-1/6 flex items-center justify-between px-2">
                  <h2>{getRandomMotivator()}</h2>
                  <div
                    className="closeBtn w-5 h-5"
                    onClick={handleUserMenuToggle}
                  >
                    <img src={exit} alt="Close" />
                  </div>
                </div>
                <div className="userText relative w-full h-5/6 grid grid-cols-1 grid-rows-2 gap-2">
                  <div className="box px-2 py-auto">
                    <h1 className="w-full text-3xl font-normal">
                      Hello {user?.fullName}
                    </h1>
                    <h2 className="w-full text-xl font-light">{user?.email}</h2>
                  </div>
                  <div className="box relative w-full h-full grid grid-cols-2 grid-rows-1 gap-2">
                    <Link
                      to={"/dashboard/profile"}
                      className="box border-[2px] border-[#39a2ff] flex flex-col items-center justify-center"
                    >
                      <img src={userIcon} className="aspect-auto h-1/2" alt="" />
                      <p className="w-full text-xl font-light text-center">Profile</p>
                    </Link>
                    <Link
                      to={"/dashboard/tags"}
                      className="box border-[2px] border-[#39a2ff]  flex flex-col items-center justify-center"
                    >
                      <img src={tag} className="aspect-auto h-1/2" alt="" />
                      <p className="w-full text-xl font-light text-center">Tags</p>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Main Content Section */}
        <section
          className={`main mt-16 h-full w-full transform duration-300 ${
            viewSidebar ? "md:pl-56" : ""
          }`}
        >
          <Outlet />
        </section>
      </main>
    </ScreenProvider>
      
    </>
  );
}

export default Dashboard;

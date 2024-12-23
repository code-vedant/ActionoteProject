import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import logoblue from "../assets/Icons/logoblue.png";
import SideBar from "@/Components/SideBar";
import shiba from '../assets/Icons/shiba.jpg';
import exit from '../assets/Icons/exit.png';

function Dashboard() {
  const [viewSidebar, setViewSidebar] = useState(false);
  const [viewBox, setViewBox] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Accessing user data and access token from Redux store
  const { user, accessToken } = useSelector((state) => state.auth);

  // Toggle sidebar visibility
  const handleSidebarToggle = () => setViewSidebar(prev => !prev);

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

  return (
    <>
      <Helmet>
        <title>Dashboard | Actionote</title>
        <meta name="description" content="Your personal digital space" />
      </Helmet>

      <main className="w-full h-fit min-h-screen bg-[#f0f4fa] dark:bg-[#1a1a1a] dark:text-white overflow-hidden">
        <section className="headerSection  w-full h-16 flex items-center justify-between px-1">
          {/* Sidebar Toggle Button */}
          <div className="sideBarIcon h-12 w-12">
            <SideBar viewSidebar={viewSidebar} handleview={handleSidebarToggle} />
          </div>

          {/* Branding Section */}
          <div className={`branding h-12 w-72 md:w-full flex items-center justify-center md:justify-start gap-1 transform duration-300 ${viewSidebar ? "md:pl-44" : ""}`}>
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
            >{user ? <img src={user?.avatar} /> : <img src={shiba} alt="User Avatar" className="w-full h-full rounded-full" />}
              
            </div>

            {/* User Menu Dropdown */}
            {viewBox && (
              <div className="userTab absolute bg-[#f7f8fa] dark:bg-[#1d1d1d] shadow-lg z-50 rounded-lg h-56 right-1 top-12 w-72">
                <div className="w-full flex items-center justify-between px-2">
                  <h2>Hi {user ? user.name : 'User'}</h2>
                  <div className="closeBtn w-5 h-5" onClick={handleUserMenuToggle}>
                    <img src={exit} alt="Close" />
                  </div>
                </div>
                <div className="userText">Profile</div>
              </div>
            )}
          </div>
        </section>

        {/* Main Content Section */}
        <section className={`main h-full w-full transform duration-300 ${viewSidebar ? "md:pl-56" : ""}`}>
          <Outlet />
        </section>
      </main>
    </>
  );
}

export default Dashboard;
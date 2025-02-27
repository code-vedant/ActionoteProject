import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import LogoutBtn from "./LogoutBtn";

import calendarblueint from "../assets/Icons/calendarblueint.webp";
import timerblue from "../assets/Icons/timerblue.webp";
import todoblue from "../assets/Icons/todoblue.webp";
import notesblue from "../assets/Icons/notesblue.webp";
import diaryblueint from "../assets/Icons/diaryblueint.webp";
import drawingblueint from "../assets/Icons/drawingblueint.webp";

function SideBar({ viewSidebar, handleview }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const list = [
    { title: "Home", icon: calendarblueint, route: "/dashboard" },
    { title: "To-Do Lists", icon: todoblue, route: "/dashboard/todo" },
    { title: "Calendar", icon: calendarblueint, route: "/dashboard/calendar" },
    { title: "Diary", icon: diaryblueint, route: "/dashboard/diary" },
    { title: "Notes", icon: notesblue, route: "/dashboard/notes" },
    { title: "Pomodoro", icon: timerblue, route: "/dashboard/pomodoro" },
    { title: "Draw", icon: drawingblueint, route: "/dashboard/draw" },
  ];

  const { theme, handleThemeSwitch } = useTheme();

  return (
    <div className="w-full h-screen">
      <button
        className="relative w-12 h-12 z-20 outline-none focus:ring-0"
        onClick={handleview}
      >
        <div className="relative flex overflow-hidden items-center justify-center rounded-full w-full h-full transform transition-all duration-200">
          <div className="flex flex-col justify-between w-1/2 h-1/2 transform transition-all duration-300 origin-center overflow-hidden">
            {/* Top bar */}
            <div
              className={`bg-charcoal-gray dark:bg-white h-[2px] w-7 transform transition-all duration-300 origin-left ${
                viewSidebar ? "rotate-45" : "rotate-0"
              }`}
            ></div>
            {/* Middle bar */}
            <div
              className={`bg-charcoal-gray dark:bg-white h-[2px] w-1/2 rounded transform transition-all duration-300 ${
                viewSidebar ? "-translate-x-10 opacity-0" : "opacity-100"
              }`}
            ></div>
            {/* Bottom bar */}
            <div
              className={`bg-charcoal-gray dark:bg-white h-[2px] w-7 transform transition-all duration-300 origin-left ${
                viewSidebar ? "-rotate-45" : "rotate-0"
              }`}
            ></div>
          </div>
        </div>
      </button>
      <div
        className={`fixed top-0 left-0 h-screen w-[85vw] md:w-56 bg-[#ffffff] dark:bg-[#2a2a2a] pt-16 dark:text-white z-10 transform duration-300 ${
          viewSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full h-screen pb-16 flex flex-col justify-start gap-3 items-center pt-5">
          {list.map((item, index) => (
            <Link
              className="w-full h-fit flex justify-center"
              key={item.title}
              to={item.route}
              onClick={() => setActiveIndex(index)}
            >
              <div
                className={`w-11/12 h-10 flex justify-starat items-center gap-3 px-5 rounded-full ${
                  activeIndex === index
                    ? "bg-[#e5e6e8] dark:bg-[#393939]"
                    : "bg-[#f7f8fa] dark:bg-[#1d1d1d]"
                }`}
              >
                <div className="imgHolder w-8 h-8 flex justify-center items-center">
                  <img className="w-4/5 h-4/5" src={item.icon} alt={item.title} />
                </div>
                <h1 className="text-2xl font-light">{item.title}</h1>
              </div>
            </Link>
          ))}
          <div className="utils w-full h-full flex flex-col justify-end items-center gap-4 pb-4">
            <button
              onClick={handleThemeSwitch}
              className="w-11/12 h-10 rounded-full border-[1px] border-[#39a2ff] text-xl font-light transition duration-200 ease-in-out transform hover:bg-[#39a2ff] hover:shadow-sm"
              aria-label="Toggle theme"
            >
              Theme
            </button>
            <div className="w-full text-center">
              <LogoutBtn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;

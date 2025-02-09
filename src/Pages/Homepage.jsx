import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logoblue from "../assets/Icons/logoblue.webp";
import todoblue from "../assets/Icons/todoblue.webp";
import calendarblue from "../assets/Icons/calendarblue.webp";
import trackerblue from "../assets/Icons/trackerblue.webp";
import timerblue from "../assets/Icons/timerblue.webp";
import noteblue from "../assets/Icons/noteblue.webp";
import diaryblue from "../assets/Icons/diaryblue.webp";
import drawingblue from "../assets/Icons/drawingblue.webp";
import { useTheme } from "@/context/ThemeContext";
import LoadingScreen from "@/Components/LoadingScreen";
import circle1blue from "../assets/Icons/circle1blue.webp";
import circle2blue from "../assets/Icons/circle2blue.webp";
import circle3blue from "../assets/Icons/circle3blue.webp";
import circle4blue from "../assets/Icons/circle4blue.webp";
import productivityblue from "../assets/Icons/productivityblue.webp";
import communityblue from "../assets/Icons/communityblue.webp";
import workbalanceblue from "../assets/Icons/workbalanceblue.webp";
import githubIcon from "../assets/Icons/githubIcon.webp";
import linkedinIcon from "../assets/Icons/linkedinIcon.webp";
import instagramIcon from "../assets/Icons/instagramIcon.webp";
import xIcon from "../assets/Icons/xIcon.webp";
import light from "../assets/Icons/light.svg";
import moon from "../assets/Icons/moon.svg";
export default function Homepage() {
  const { theme, handleThemeSwitch } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const featureRef = useRef();
  const aboutRef = useRef();
  const connectRef = useRef();

  const toggleVisibility = () => {
    if (window.scrollY > 600) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [isVisible]);

  const handleScroll = (elem) => {
    window.scrollTo({ top: elem.current.offsetTop, behavior: "smooth" });
  };

  const cards = [
    {
      icon: todoblue,
      title: "To-Do Lists",
      description:
        "Create and organize tasks with daily and monthly lists. Prioritize your work and get things done efficiently.",
    },
    {
      icon: calendarblue,
      title: "Calendar Management",
      description:
        "Plan your day, week, or month with our easy-to-use calendar. Assign tasks and keep track of deadlines.",
    },
    {
      icon: timerblue,
      title: "Pomodoro Clock",
      description:
        "Focus on your tasks with the Pomodoro technique. Break your work into intervals and enhance your concentration.",
    },
    {
      icon: trackerblue,
      title: "Progress Tracking",
      description:
        "Monitor your task completion and see how you're progressing toward your goals.",
    },
    {
      icon: noteblue,
      title: "Notes",
      description:
        "Quickly jot down ideas, meeting highlights, or important points and keep them organized.",
    },
    {
      icon: diaryblue,
      title: "Diary",
      description:
        "Reflect on your day and track your personal growth with daily journaling.",
    },
    {
      icon: drawingblue,
      title: "Drawing",
      description:
        "Sketch out ideas, designs, or just doodle to boost your creativity.",
    },
  ];

  return (
    <>
      <LoadingScreen />
      <div className="w-full scrollbar-hide h-fit min-h-screen flex flex-col justify-start pt-4 items-start overflow-hidden">
        {/* Theme Toggle Button */}
        <button
          onClick={handleThemeSwitch}
          className="absolute right-3 top-4 rounded-full bg-gray-200 dark:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-110 shadow-md"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <div className="w-10 h-10 flex justify-center items-center rounded-full">
              <img src={light} alt="" className="rounded-full w-full h-full" />
            </div>
          ) : (
            <div className="w-10 h-10 flex justify-center items-center rounded-full">
              <img src={moon} alt="" className="rounded-full  w-full h-full" />
            </div>
          )}
        </button>

        <div className="page1 scrollbar-hide w-full px-2 lg:px-20 h-screen flex flex-col items-start justify-start">
          <nav className="w-full h-fit grid grid-cols-[30%_42%_28%]  lg:grid-cols-[10%_75%_15%]">
            <Link to="/" className="flex items-center justify-start">
              <div className="logo-img-container flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6">
                <img src={logoblue} alt="" />
              </div>
              <h3 className="font-bold text-xl lg:text-2xl">Actionote</h3>
            </Link>

            <ul className="hidden lg:flex justify-center items-center gap-2 lg:gap-16 ">
              <li
                onClick={() => handleScroll(featureRef)}
                className="cursor-pointer"
              >
                Features
              </li>
              <li
                onClick={() => handleScroll(aboutRef)}
                className="cursor-pointer"
              >
                About
              </li>
              <li
                onClick={() => handleScroll(connectRef)}
                className="cursor-pointer"
              >
                Connect
              </li>
            </ul>
            <div className="authBtns flex w-full h-fit items-center justify-end">
              <Link to="/login">
                <button className="loginBtn underline underline-offset-4 lg:no-underline font-bold mr-2">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="signupBt lg:bg-sky-blue underline underline-offset-4 lg:no-underline font-bold px-3 py-2 rounded-md lg:text-[#1b1b1b]">
                  Join Now
                </button>
              </Link>
            </div>
          </nav>
          <div className="hero-container flex flex-col justify-center items-center w-full h-fit pt-44">
            <h1 className="text-7xl lg:text-6xl font-bold">
              Turn Your Goals into Actions with Actionote!
            </h1>
            <h2 className="text-2xl mt-5 lg:mt-0">
              Manage your time, track tasks, and stay productive. All in one
              place.
            </h2>
          </div>
          <div className="actionBtns w-full flex justify-center items-center h-52">
            <Link to="/register">
              <button className="actionBtn font-bold px-3 py-2 rounded-md bg-sky-blue text-[#2b2b2b]">
                Get Started
              </button>
            </Link>
            <button
              onClick={() => handleScroll(featureRef)}
              className="actionBtn font-bold px-3 py-2 rounded-md"
            >
              Learn more
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div
          ref={featureRef}
          className="page2 scrollbar-hide px-2 lg:px-20 w-full min-h-screen"
        >
          <h1 className="font-bold text-7xl mt-7">
            Everything You Need to{" "}
            <span className="text-sky-blue">Stay Productive</span>
          </h1>
          <div className="card-holder w-full h-full grid grid-cols-1 lg:grid-cols-4 gap-10 p-4 mt-16">
            {cards.map((card) => (
              <div
                key={card.title}
                className="card bg-[#ffffff] shadow-md dark:bg-[#282828] rounded-xl h-fit lg:h-[60vh] p-4 lg:mb-10 text-black dark:text-white"
              >
                <h3 className="font-bold text-3xl lg:text-2xl">{card.title}</h3>
                <div className="card-img-container w-full h-[50%] mt-5 lg:mt-0 mb-5 flex justify-center items-center">
                  <img src={card.icon} alt={card.title} className="w-[60%]" />
                </div>
                <p className="text-xl">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
        {/* About Section */}
        <div
          ref={aboutRef}
          className="page3 scrollbar-hide px-4 lg:px-20 w-full min-h-screen lg:h-screen py-16 "
        >
          <h1 className="font-extrabold text-7xl text-center text-gray-800 dark:text-white mb-12">
            How <span className="text-[#39a2ff] -ml-3">Actionote</span> Works
          </h1>
          <div className="how-it-works-container w-full h-full flex flex-col justify-start items-center gap-12">
            {/* Step 1 */}
            <div className="step flex items-center gap-6 w-full max-w-5xl">
              <div className="icon w-20 h-20 flex-shrink-0">
                <img
                  src={circle1blue}
                  alt="Step 1"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text">
                <h3 className="font-semibold text-2xl text-gray-800 dark:text-white">
                  Join the Productivity Movement
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Create an account in seconds and gain access to a suite of
                  tools designed to streamline your tasks, goals, and habits.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="step flex items-center gap-6 w-full max-w-5xl flex-row-reverse">
              <div className="icon w-20 h-20 flex-shrink-0">
                <img
                  src={circle2blue}
                  alt="Step 2"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text">
                <h3 className="font-semibold text-2xl text-gray-800 dark:text-white">
                  Plan, Prioritize, and Execute
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Create personalized to-do lists, set monthly goals, and
                  organize tasks with an intuitive calendar system.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="step flex items-center gap-6 w-full max-w-5xl">
              <div className="icon w-20 h-20 flex-shrink-0">
                <img
                  src={circle3blue}
                  alt="Step 3"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text">
                <h3 className="font-semibold text-2xl text-gray-800 dark:text-white">
                  Stay in the Zone
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Use the integrated Pomodoro timer to enhance focus. Divide
                  your tasks into manageable intervals for maximum productivity.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="step flex items-center gap-6 w-full max-w-5xl flex-row-reverse">
              <div className="icon w-20 h-20 flex-shrink-0">
                <img
                  src={circle4blue}
                  alt="Step 4"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text">
                <h3 className="font-semibold text-2xl text-gray-800 dark:text-white">
                  Track, Reflect, and Achieve
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Monitor your progress with visual insights. Reflect on your
                  achievements and keep pushing forward.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/*Connect Section */}
        <div
          ref={connectRef}
          className="page4 px-2 lg:px-20 w-full min-h-screen py-16"
        >
          <h1 className="font-extrabold text-6xl md:text-7xl text-center text-gray-800 dark:text-white">
            Ready to Boost Your Productivity?
          </h1>
          <h2 className="font-bold text-3xl md:text-5xl text-center mt-7 lg:mt-16 text-gray-700 dark:text-gray-300">
            Join thousands transforming their work-life balance with{" "}
            <span className="text-[#39a2ff]">Actionote</span>.
          </h2>
          <div className="flex flex-col items-center justify-center mt-16 space-y-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="icon w-16 h-16">
                <img src={communityblue} alt="Community Icon" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Join a Thriving Community
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Connect with like-minded individuals, share tips, and achieve
                  your goals together.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="icon w-16 h-16">
                <img src={productivityblue} alt="Productivity Icon" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Streamline Your Daily Workflow
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Take control of your tasks with tools built for focus,
                  organization, and success.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="icon w-16 h-16">
                <img src={workbalanceblue} alt="Balance Icon" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Achieve Work-Life Balance
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Find harmony between work and personal life with customizable
                  features designed for you.
                </p>
              </div>
            </div>
            <Link
              to="/register"
              className="mt-10 px-8 py-4 bg-[#39a2ff] text-white text-xl font-bold rounded-lg hover:bg-blue-500"
            >
              Get Started Now
            </Link>
          </div>
        </div>
        <footer className="w-full bg-[#f2f3f4] dark:bg-[#282828] text-white py-8">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-6 md:flex-row md:space-y-0 md:justify-between px-6">
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-2xl font-bold text-[#39a2ff]">
                Stay Connected
              </h2>
              <p className="mt-2 text-lg text-gray-400">
                Follow on social media for updates and more!
              </p>
            </div>
            <div className="flex space-x-8">
              <a
                href="https://github.com/code-vedant"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#39a2ff]"
              >
                <img src={githubIcon} alt="Facebook" className="w-8 h-8" />
              </a>
              <a
                href="https://www.linkedin.com/in/vedant-uekey-052268291/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#39a2ff]"
              >
                <img src={linkedinIcon} alt="LinkedIn" className="w-8 h-8" />
              </a>
              <a
                href="https://x.com/Vedant_Uekey_24"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#39a2ff]"
              >
                <img src={xIcon} alt="Twitter" className="w-8 h-8" />
              </a>
              <a
                href="https://www.instagram.com/vedantuekey/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#39a2ff]"
              >
                <img src={instagramIcon} alt="Instagram" className="w-8 h-8" />
              </a>
            </div>
          </div>
          <div className="text-center text-gray-400 mt-6">
            <p>
              &copy; {new Date().getFullYear()} Actionote Made with ❤️ by Vedant
              Uekey
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

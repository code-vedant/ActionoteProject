import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import down from "../../assets/Icons/down.png";

const PomodoroTimer = () => {
  // State for the form fields and timer
  const [projectName, setProjectName] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [roundBreak, setRoundBreak] = useState(0);
  const [sessionBreak, setSessionBreak] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [currentRound, setCurrentRound] = useState(1);
  const [isBreak, setIsBreak] = useState(false);

  const handleFormChange = () => {
    setShowForm(!showForm);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMinutes(0);
    setSeconds(0);
    setCurrentRound(1);
    setIsBreak(false);
  };

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) return prevSeconds - 1;

          setMinutes((prevMinutes) => {
            if (prevMinutes > 0) return prevMinutes - 1;

            // Handle end of timer logic
            if (isBreak) {
              setIsBreak(false);
              return roundBreak;
            } else {
              setIsBreak(true);
              return sessionBreak;
            }
          });

          return 59;
        });

        if (minutes === 0 && seconds === 0 && currentRound >= rounds) {
          handleReset();
        } else if (minutes === 0 && seconds === 0) {
          setCurrentRound((prev) => prev + 1);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, isBreak, currentRound, rounds, roundBreak, sessionBreak]);

  return (
    <>
      <Helmet>
        <title>Pomodoro | Focus Sessions | Actionote</title>
        <meta name="description" content="focus sessions" />
        <meta name="keywords" content="focus, actionote, personal" />
      </Helmet>
      <section className="flex w-full scrollbar-hidden h-fit flex-col items-center justify-start gap-5 pt-10">
        <div className="w-[95vw] lg:w-[90vw] h-fit py-6 rounded-lg shadow-lg bg-white dark:bg-[#282828] dark:text-white">
          <header className="ml-5 mb-8">
            <h1 className="text-2xl font-bold">Actionote X Pomodo</h1>
          </header>

          <form className="text-center z-50 flex flex-col w-full justify-center items-center">
            <nav className="flex w-full justify-center items-center">
              <p className="mb-4">
                <span className="mr-2">I am Working on</span>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="session"
                  className="p-2 rounded bg-[#ececec] border-gray-400 border-b-2 dark:bg-[#363636] dark:text-white border-none focus:outline-none "
                />
                <span className="mx-2"> for duration of</span>
                <input
                  type="number"
                  value={minutes === 0 ? "" : minutes}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^[0-9]+$/.test(value)) {
                      setMinutes(value === "" ? 0 : parseInt(value, 10));
                    }
                  }}
                  placeholder="0"
                  className="w-16 p-2 rounded bg-[#ececec] dark:bg-[#363636] dark:text-white text-center border-none focus:outline-none"
                />
                <span className="ml-2">minutes.</span>
              </p>
              <div
                onClick={handleFormChange}
                className="cursor-pointer flex justify-center mb-4"
              >
                <img
                  src={down}
                  alt="toggle"
                  className={`w-6 h-6 mx-2 p-1 transform transition-transform duration-300 ${
                    showForm ? "-rotate-90" : "rotate-0"
                  }`}
                />
              </div>
            </nav>
            <div
              className={`w-full px-44 flex justify-center items-center gap-2 overflow-hidden transform transition-all duration-700 ease-in-out ${
                showForm ? "h-0" : "h-20"
              }`}
            >
              <label htmlFor="">Rounds Break:</label>
              <input
                type="number"
                value={roundBreak}
                onChange={(e) =>
                  setRoundBreak(parseInt(e.target.value, 10) || 0)
                }
                placeholder="0"
                className="w-16 p-2 rounded bg-[#ececec] dark:bg-[#363636] dark:text-white text-center border-none focus:outline-none "
              />
              <label htmlFor=""> &nbsp; Session Break:</label>
              <input
                type="number"
                value={sessionBreak}
                onChange={(e) =>
                  setSessionBreak(parseInt(e.target.value, 10) || 0)
                }
                placeholder="0"
                className="w-16 p-2 rounded bg-[#ececec] dark:bg-[#363636] dark:text-white text-center border-none focus:outline-none "
              />
              <label htmlFor=""> &nbsp;No. of rounds:</label>
              <input
                type="number"
                value={rounds}
                onChange={(e) => setRounds(parseInt(e.target.value, 10) || 0)}
                placeholder="0"
                className="w-16 p-2 rounded bg-[#ececec] dark:bg-[#363636] dark:text-white text-center border-none focus:outline-none "
              />
            </div>
          </form>
          {/*--------------------------- Clock -------------------------------------------------- */}
          <div className="flex select-none justify-center z-0 items-center gap-4">
            <div className=" text-[10em] lg:text-[18em] z-0 font-open leading-none pb-14 font-thin flex items-center">
              <span>{String(minutes).padStart(2, "0")}</span>
              <span className="mx-2 font-sans">:</span>
              <span>{String(seconds).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="text-center z-10 mt-4 flex justify-center w-full h-fit gap-20 px-10">
            <button
              onClick={handleStart}
              disabled={isRunning}
              className={`w-full p-2 rounded focus:ring-2 ${
                isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-sky-blue"
              } text-white text-lg font-bold`}
            >
              Start
            </button>
            <button
              onClick={handleReset}
              disabled={!isRunning}
              className={`w-full p-2 rounded focus:ring-2 ${
                !isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
              } text-white text-lg font-bold`}
            >
              Reset
            </button>
          </div>
        </div>
        {/* History */}
        <div className="w-[95vw] lg:w-[90vw] h-fit py-6 my-10 rounded-lg shadow-lg bg-white dark:bg-[#282828] dark:text-white">
          <h1 className="text-2xl font-bold">History</h1>
          <ul>
            <li>Session 1: {projectName}</li>
            <li>Session 2: {projectName}</li>
            <li>Session 3: {projectName}</li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default PomodoroTimer;

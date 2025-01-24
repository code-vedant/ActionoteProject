import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClockLoader from "react-spinners/ClockLoader";
import PopupHolder from "../Popups/PopupHolder.jsx";
import DiaryOld from "./DiaryOld.jsx";
import DiaryService from "@/Services/diary.service";
import { useSelector } from "react-redux";

const DiaryHome = () => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date()); // Default to the current date
  const [entry, setEntry] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [oldEntries, setOldEntries] = useState([]);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const formatDate = (date) => {
    const options = { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = date.toLocaleDateString("en-IN", options);
    const [day, month, year] = formattedDate.split("/");
    return `${year}-${month}-${day}`;
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await DiaryService.getDiaries(accessToken);
      setOldEntries(response.data);
    } catch (error) {
      console.error("Error fetching old entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayEntry = async () => {
    try {
      const response = await DiaryService.getTodayDiary(accessToken);
      setEntry(response.data.entry);
    } catch (error) {
      console.error("Error fetching today's entry:", error);
    }
  };

  useEffect(() => {
    fetchTodayEntry();
    fetchEntries();
  }, [date]);

  const handleTodaySave = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      if (!entry) {
        throw new Error("Entry cannot be empty.");
      }
      const formattedDate = formatDate(date);
      await DiaryService.saveDiary({ date: formattedDate, entry }, accessToken);
      setEntry(entry);
      alert("Diary entry saved successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Error saving today's entry.");
    }
  };

  const handleTodayDelete = async () => {
    try {
      setErrorMessage(null);
      const formattedDate = formatDate(date);
      await DiaryService.deleteDiary(formattedDate, accessToken);
      setEntry("");
    } catch (error) {
      setErrorMessage(error.message || "Error deleting today's entry.");
    }
  };

  const handleClear = () => setEntry("");

  return (
    <>
      <Helmet>
        <title>Diary | Your personal digital diary | Actionote</title>
        <meta name="description" content="Your personal digital diary" />
        <meta name="keywords" content="diary, actionote, personal" />
      </Helmet>
      <section className="w-full overflow-x-auto h-full flex flex-col justify-start items-start -mt-2 px-4">
        {/* Today diary Element */}
        <div className="new border-b flex flex-col justify-start items-center border-b-[#39a2ff] pb-4 lg:pl-5 w-full">
          <form
            onSubmit={handleTodaySave}
            className="w-[95vw] lg:w-[50vw] h-[92vh] scrollbar-hide bg-[#ffffff] p-2 dark:bg-[#1c1c1c] shadow-sm shadow-[#333] rounded-md flex flex-col justify-start items-center gap-3"
          >
            <div className="w-full text-center border-b-2 pb-1 border-b-[#1c1c1c]">
              <DatePicker
                selected={date}
                onChange={(selectedDate) => setDate(selectedDate || new Date())}
                dateFormat="dd/MM/yyyy"
                className="text-center bg-inherit font-semibold text-xl"
              />
            </div>

            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="What happened today?"
              className="w-full h-full min-h-[40vh] bg-inherit scrollbar-hide p-2 outline-none"
            />
            <div className="w-full h-12 gap-2 flex justify-end items-center">
              <button
                type="button"
                onClick={handleClear}
                className="w-fit px-4 h-full rounded-full bg-none border-[1px] border-black text-black dark:border-[#dcdcdc] dark:text-[#dcdcdc] transition duration-200 ease-in-out transform hover:bg-[#e0e0e0] hover:border-[#e0e0e0] hover:text-black dark:hover:text-black"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleTodayDelete}
                className="w-fit px-4 h-full rounded-full bg-none border-[1px] border-black text-black dark:border-[#dcdcdc] dark:text-[#dcdcdc] transition duration-200 ease-in-out transform hover:bg-[#e63946] hover:border-[#e63946] dark:hover:border-[#e63946] hover:text-white dark:hover:text-white"
              >
                Delete
              </button>
              <button
                type="submit"
                className="w-fit px-6 h-full font-semibold rounded-full border-[1px] border-[#39a3ff] bg-[#39a3ff] text-white transition duration-200 ease-in-out transform hover:bg-[#1e88e5] hover:border-[#1e88e5]"
              >
                Save
              </button>
            </div>
          </form>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>

        <div className="prevProjects w-full flex flex-col gap-3 lg:gap-10 justify-start items-center">
          {loading ? (
            <PopupHolder>
              <ClockLoader
                color="#39a2ff"
                size={100}
                speedMultiplier={4}
                className="fixed inset-0 z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </PopupHolder>
          ) : oldEntries.length > 0 ? (
            <>
              <h1 className="text-2xl font-bold w-full pl-5 text-[#39a2ff]">
                Old Entries
              </h1>
              {oldEntries.map((diary) => (
                <DiaryOld key={diary._id} diary={diary} />
              ))}
            </>
          ) : (
            <p>No diary entries found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default DiaryHome;

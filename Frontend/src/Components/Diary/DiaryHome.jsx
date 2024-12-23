import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DiaryService from "../../Services/diary.service.js";
import { addEntry, deleteEntry } from "../../Store/diary.store.js";
import ClockLoader from "react-spinners/ClockLoader";
import PopupHolder from "../Popups/PopupHolder.jsx";
import DiaryOld from "./DiaryOld.jsx";
import { Helmet } from "react-helmet";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DiaryHome = ({ accessToken }) => {
  const [loading, setLoading] = useState(true);
  const [todayEntry, setTodayEntry] = useState("");
  const [todayDiaryId, setTodayDiaryId] = useState(null);
  const [date, setDate] = useState(new Date());
  const [entry, setEntry] = useState("");
  const dispatch = useDispatch();
  const diaries = useSelector((state) => state.diary.entries);

  // Combined API call for today's entry and all diaries
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [todayRes, diariesRes] = await Promise.all([
        DiaryService.getTodayDiary(accessToken),
        DiaryService.getDiaries(accessToken),
      ]);

      // Set today's entry
      console.log(diariesRes.data);
      
      if (todayRes.data) {
        setTodayEntry(todayRes.data.entry || "");
        setTodayDiaryId(todayRes.data.id || null);
        setDate(new Date(todayRes.data.date || new Date()));
      }

      // Dispatch all diaries
      dispatch(addEntry(diariesRes.data));
    } catch (error) {
      console.error("Error fetching diary data:", error.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken, dispatch]);

  // Fetch data on component mount or when the access token changes
  useEffect(() => {
    if (accessToken) fetchData();
  }, [accessToken, fetchData]);

  // Handle save for today's entry
  const handleTodaySave = async (e) => {
    e.preventDefault();
    try {
      const res = todayDiaryId
        ? await DiaryService.updateDiary(accessToken, todayDiaryId, {
            entry,
            date: date.toISOString(),
          })
        : await DiaryService.createDiary(accessToken, {
            entry,
            date: date.toISOString(),
          });

      setTodayDiaryId(res.data.id);
      setTodayEntry(entry);
    } catch (error) {
      console.error("Error saving today's entry:", error.message);
    }
  };

  // Handle clear for today's entry
  const handleClear = () => {
    setEntry("");
  };

  // Handle delete for today's entry
  const handleTodayDelete = async () => {
    if (!todayDiaryId) return;
    try {
      await DiaryService.deleteDiary(accessToken, todayDiaryId);
      setTodayEntry("");
      setTodayDiaryId(null);
      setEntry("");
    } catch (error) {
      console.error("Error deleting today's entry:", error.message);
    }
  };

  // Handle delete for old entries
  const handleDelete = async (id) => {
    try {
      await DiaryService.deleteDiary(accessToken, id);
      dispatch(deleteEntry(id));
    } catch (error) {
      console.error("Error deleting diary entry:", error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Diary | Your personal digital diary | Actionote</title>
        <meta name="description" content="Your personal digital diary" />
        <meta name="keywords" content="diary, actionote, personal" />
      </Helmet>
      <section className="w-full overflow-x-auto h-full flex flex-col justify-start items-start -mt-2 px-4">
        <div className="new border-b flex flex-col justify-start items-center border-b-[#39a2ff] pb-4 lg:pl-5 w-full">
          <form
            onSubmit={handleTodaySave}
            className="w-[95vw] lg:w-[50vw] h-[92vh] scrollbar-hide bg-[#ffffff] p-2 dark:bg-[#1c1c1c] shadow-md shadow-[#333] rounded-md flex flex-col justify-start items-center gap-3"
          >
            {/* Date input */}
            <div className="w-full text-center border-b-2 pb-1 border-b-[#1c1c1c]">
              <DatePicker
                selected={date}
                onChange={(selectedDate) => setDate(selectedDate)}
                dateFormat="dd/MM/yyyy"
                className="text-center bg-inherit font-semibold text-xl"
              />
            </div>

            {/* Entry input */}
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Today was a reminder to be thankful. What good things happened, and how did they make me feel grateful and happy?"
              className="w-full h-full min-h-[40vh] bg-inherit scrollbar-hide p-2 outline-none"
            />
            <div className="w-full h-12 gap-2 flex justify-end items-center">
              <button
                type="button"
                onClick={handleClear}
                className="w-fit px-4 h-full rounded-md bg-red-500 text-white hover:bg-[#39a2ff]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleTodayDelete}
                className="w-fit px-4 h-full rounded-md bg-red-600 text-white hover:bg-[#39a2ff]"
              >
                Delete
              </button>
              <button
                type="submit"
                className="w-fit px-4 h-full rounded-md bg-[#39a3ff] text-white hover:bg-[#39a2ff]"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        {/* Old Entries Section */}
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
          ) : diaries.length > 0 ? (
            <>
              <h1 className="text-2xl font-bold w-full pl-5 text-[#39a2ff]">
                Old Entries
              </h1>
              {diaries.map((diary, index) => (
                <DiaryOld key={index} diary={diary} onDelete={handleDelete} />
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
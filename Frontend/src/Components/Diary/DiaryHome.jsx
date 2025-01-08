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
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const diaries = useSelector((state) => state.diary.entries);

  // Fetch diaries and today's entry
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const [todayRes, diariesRes] = await Promise.all([
        DiaryService.getTodayDiary(accessToken),
        DiaryService.getDiaries(accessToken),
      ]);

      if (todayRes) {
        setTodayEntry(todayRes.entry || "");
        setTodayDiaryId(todayRes.id || null);
        setDate(new Date(todayRes.date || new Date()));
        setEntry(todayRes.entry || ""); // Ensure entry reflects the current state
      }

      dispatch(addEntry(diariesRes));
    } catch (error) {
      setErrorMessage(error.message || "Failed to fetch diary data.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (accessToken) fetchData();
  }, [accessToken, fetchData]);

  const handleTodaySave = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      const res = todayDiaryId
        ? await DiaryService.updateDiary(accessToken, todayDiaryId, {
            entry,
            date: date.toISOString(),
          })
        : await DiaryService.saveDiary(accessToken, {
            entry,
            date: date.toISOString(),
          });

      setTodayDiaryId(res.id);
      setTodayEntry(entry);
    } catch (error) {
      setErrorMessage(error.message || "Error saving today's entry.");
    }
  };

  const handleTodayDelete = async () => {
    if (!todayDiaryId) return;
    try {
      setErrorMessage(null);
      await DiaryService.deleteDiary(todayDiaryId, accessToken);
      setTodayEntry("");
      setTodayDiaryId(null);
      setEntry("");
    } catch (error) {
      setErrorMessage(error.message || "Error deleting today's entry.");
    }
  };

  const handleDelete = async (id) => {
    try {
      setErrorMessage(null);
      await DiaryService.deleteDiary(id, accessToken);
      dispatch(deleteEntry(id));
    } catch (error) {
      setErrorMessage(error.message || "Error deleting diary entry.");
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
        <div className="new border-b flex flex-col justify-start items-center border-b-[#39a2ff] pb-4 lg:pl-5 w-full">
          <form
            onSubmit={handleTodaySave}
            className="w-[95vw] lg:w-[50vw] h-[92vh] scrollbar-hide bg-[#ffffff] p-2 dark:bg-[#1c1c1c] shadow-md shadow-[#333] rounded-md flex flex-col justify-start items-center gap-3"
          >
            <div className="w-full text-center border-b-2 pb-1 border-b-[#1c1c1c]">
              <DatePicker
                selected={date}
                onChange={(selectedDate) => setDate(selectedDate)}
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
          ) : diaries.length > 0 ? (
            <>
              <h1 className="text-2xl font-bold w-full pl-5 text-[#39a2ff]">
                Old Entries
              </h1>
              {diaries.map((diary) => (
                <DiaryOld key={diary.id} diary={diary} onDelete={handleDelete} />
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
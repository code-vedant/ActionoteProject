import React, { useEffect, useState } from "react";
import DiaryService from "@/Services/diary.service";
import DatePicker from "react-datepicker";
import dotsBlack from "../../assets/Icons/dotsBlack.png";
import dotsWhite from "../../assets/Icons/dotsWhite.png";
import { useTheme } from "@/context/ThemeContext";
import { useSelector } from "react-redux";

function DiaryOld({ diary ,handleDelete}) {
  const [entry, setEntry] = useState(diary.entry || "");
  const [date, setDate] = useState(new Date(diary.date));
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useTheme();
  const handleEdit = () => setIsEditing(true);

  const handleEditCall = async () => {
    if (!date || !entry) {
      alert("Please fill in both the date and your diary entry.");
      return;
    }
  
    const updatedDiary = { date, entry };
  
    try {
      await DiaryService.saveDiary(updatedDiary, accessToken);
      console.log("Diary updated successfully.");
  
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving diary:", error.message);
    }
  };


  return (
    <div className="w-[95vw] lg:w-[50vw] h-[95vh] relative p-4 bg-[#ffffff] dark:bg-[#1b1b1b] shadow-md shadow-[#333] rounded-md flex flex-col lg:ml-5 justify-start items-center gap-3 mb-5">
      {/* Date Picker */}
      <div className="w-full text-center border-b-2 pb-1 border-b-[#1c1c1c] dark:border-b-[#f7f8f9]">
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
          disabled={!isEditing}
          className="text-center bg-inherit font-semibold text-xl"
        />
      </div>

      {/* Text Area */}
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="So I did amazing today..."
        className="w-full h-full bg-inherit p-2 outline-none"
        disabled={!isEditing}
      />

      {/* Action Buttons */}
      <div className="w-full h-12 gap-2 flex justify-end items-center">
        {!isEditing && (
          <div className="w-fit h-fit absolute right-2 top-3 group">
            <img src={theme === "dark" ? dotsWhite : dotsBlack} alt="edit" className="h-6 cursor-pointer"  />
            <div className="dropMenu w-20 bg-white dark:bg-[#2c2c2c] absolute left-0 top-10 rounded-md shadow-xl z-50 opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300">
              <button
                className="block w-full py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="block w-full py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={handleDelete(diary.date)}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {isEditing && (
            <button
              type="button"
              onClick={handleEditCall}
              className="w-fit px-4 h-full rounded-md bg-[#39a3ff] text-white hover:bg-[#39a2ff]"
            >
              Save
            </button>
        )}
      </div>
    </div>
  );
}

export default DiaryOld;

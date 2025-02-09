import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import NotesService from "../../Services/notes.service";
import { useSelector } from "react-redux";
import plus from "../../assets/Icons/plus.webp";
import NotesBox from "./NotesBox";
import { Helmet } from "react-helmet";
import PopupHolder from "../Popups/PopupHolder";
import { ClockLoader } from "react-spinners";
import { encrypt } from "@/Binders/Encypt";

function NotesHome() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      const response = await NotesService.getAllNotes(accessToken);
      console.log(response.data);
      setNotesData(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchNotes();
    setLoading(false);
  }, [accessToken]);

  const bgColors = [
    "#b4d9ff",
    "#e1c8ff",
    "#c8ffd9",
    "#ffb3b3",
    "#fff0c7",
    "#ffd8b3",
    "#c1e0ff",
    "#e1f2d9",
    "#fff0b3",
    "#cceeff",
  ];

  const getRandomBgColor = () => {
    return bgColors[Math.floor(Math.random() * bgColors.length)];
  };

  const testNotes = [
    {
      title: "test note 1",
      content: "lorem ipsum dolor sit amet",
    },
    {
      title: "test note 2",
      content: "lorem ipsum dolor sit amet",
    },
    {
      title: "test note 3",
      content: "lorem ipsum dolor sit amet",
    },
    {
      title: "test note 4",
      content: "lorem ipsum dolor sit amet",
    },
    {
      title: "test note 5",
      content: "lorem ipsum dolor sit amet",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Note | Your digital notes space | Actionote</title>
        <meta name="description" content="Your personal digital notes" />
        <meta name="keywords" content="notes, records, actionote, personal" />
      </Helmet>
      {loading && (
        <PopupHolder>
          <ClockLoader color="#39a2ff" size={100} speedMultiplier={4} />
        </PopupHolder>
      )}
      <section className="w-full h-full relative px-10 py-4 flex flex-col justify-start items-start">
        <h1 className="text-8xl w-full border-b-[3px] border-[#39a2ff] font-light text-[#39a2ff]">
          All Notes
        </h1>
        <div className="w-full min-h-full p-2 lg:pl-14  flex flex-wrap justify-start items-start gap-4 lg:gap-8 lg:p-5">
          <div className="new group w-[95vw] h-[40vw] lg:w-[20vw] lg:h-[60vh] p-2 shadow-lg flex items-center justify-center bg-white dark:bg-[#f7f8f9] transition-transform duration-300 hover:bg-white hover:shadow-2xl hover:scale-105  rounded-lg">
            <Link
              to={"/dashboard/notes/new"}
              className="w-full h-full flex justify-center items-center bg-transparent"
            >
              <img
                src={plus}
                className="w-1/5 aspect-square transition-transform duration-500 group-hover:scale-110"
                alt="add"
              />
            </Link>
          </div>

          {notesData.map((note, index) => (
            <Link
              to={`/dashboard/notes/${encrypt(note?._id)}`}
              className="w-fit h-fit"
              key={note?._id || index}
            >
              <NotesBox note={note} bgColor={getRandomBgColor()} />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default NotesHome;

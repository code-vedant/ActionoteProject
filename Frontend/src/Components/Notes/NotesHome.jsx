import React, { useEffect, useState, useRef } from "react";
import pen from "../../assets/Icons/pen.png";
import { Link } from "react-router-dom";
import NotesService from "../../Services/notes.service"
import { useSelector } from "react-redux";
import plus from "../../assets/Icons/plus.png";
import NotesBox from "./NotesBox";
import { Helmet } from "react-helmet";
import PopupHolder from "../Popups/PopupHolder";

function NotesHome() {

  const accessToken = useSelector((state)=> state.auth.accessToken);
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
  }

  useEffect(() => {
    setLoading(true);
    fetchNotes();
    setLoading(false);
  }, [accessToken]);

  return (
    <>
    <Helmet>
    <title>Note | Your digital notes space | Actionote</title>
    <meta name="description" content="Your personal digital notes" />
    <meta name="keywords" content="notes, records, actionote, personal" />
  </Helmet>
    {loading && <PopupHolder>

    </PopupHolder>}
    <section className="w-full h-full relative px-10 py-4 flex flex-col justify-start items-start">
      <h1 className="text-4xl font-bold text-[#39a2ff]">
        Welcome to Actionote x Notes
      </h1>
      <div className="w-full min-h-full p-2 lg:pl-14  flex flex-wrap justify-start items-start gap-4 lg:gap-8 lg:p-5">
        <div className="new group w-[95vw] h-[40vw] lg:w-[20vw] lg:h-[60vh] p-2 shadow-lg flex items-center justify-center bg-white dark:bg-[#f7f8f9] hover:bg-white hover:shadow-2xl hover:scale-105 rounded-lg">
        <Link to={"/dashboard/notes/new"} className="w-full h-full flex justify-center items-center bg-transparent">

          <img
            src={plus}
            className="w-1/5 aspect-square transition-transform duration-300 group-hover:scale-150"
            alt="add"
          />
        </Link>
        </div>

        {notesData.map((note, index) => (
          <Link to={`/dashboard/notes/${note._id}`} className="w-fit h-fit">
          <NotesBox key={index} note={note}/>
          </Link>
        ))}
      </div>
    </section>
    </>
  );
}

export default NotesHome;

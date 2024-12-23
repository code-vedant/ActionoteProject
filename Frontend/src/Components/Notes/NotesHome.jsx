import React, { useEffect, useState, useRef } from "react";
import pen from "../../assets/Icons/pen.png";
import { Link } from "react-router-dom";
import NotesService from "../../Services/notes.service"; // Adjust the path as needed
import { useSelector } from "react-redux";
import plus from "../../assets/Icons/plus.png";
import NotesBox from "./NotesBox";
import { Helmet } from "react-helmet";

function NotesHome() {
  const notes = [
    {
      id: 1,
      title: "First Note",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel felis vel ipsum porttitor gravida. In hac habitasse platea dictumst. Sed vitae aliquet neque, vel tempor mi. Sed ac dolor non lectus convallis tristique vitae vel ex. Donec id lectus a turpis condimentum finibus.",
    },
    {
      id: 2,
      title: "Second Note",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel felis vel ipsum porttitor gravida. In hac habitasse platea dictumst. Sed vitae aliquet neque, vel tempor mi. Sed ac dolor non lectus convallis tristique vitae vel ex. Donec id lectus a turpis condimentum finibus.",
    },
    {
      id: 3,
      title: "",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel felis vel ipsum porttitor gravida. In hac habitasse platea dictumst. Sed vitae aliquet neque, vel tempor mi. Sed ac dolor non lectus convallis tristique vitae vel ex. Donec id lectus a turpis condimentum finibus.",
    },
    {
      id: 4,
      title: "Third Note",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel felis vel ipsum porttitor gravida. In hac habitasse platea dictumst. Sed vitae aliquet neque, vel tempor mi. Sed ac dolor non lectus convallis tristique vitae vel ex. Donec id lectus a turpis condimentum finibus.",
    },
    {
      id: 5,
      title: "",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel felis vel ipsum porttitor gravida. In hac habitasse platea dictumst. Sed vitae aliquet neque, vel tempor mi. Sed ac dolor non lectus convallis tristique vitae vel ex. Donec id lectus a turpis condimentum finibus.",
    }
  ];

  return (
    <>
    <Helmet>
    <title>Note | Your digital notes space | Actionote</title>
    <meta name="description" content="Your personal digital notes" />
    <meta name="keywords" content="notes, records, actionote, personal" />
  </Helmet>
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

        {notes.map((note, index) => (
          <Link to={"/dashboard/notes/:id"}>
          <NotesBox key={index} note={note}/>
          </Link>
        ))}
      </div>
    </section>
    </>
  );
}

export default NotesHome;

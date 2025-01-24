import React, { useState } from "react";
import { useForm } from "react-hook-form"; // Import useForm
import deleteRed from "../../assets/Icons/deleteRed.png";
import penWhite from "../../assets/Icons/penWhite.png";
import TagsService from "@/Services/tags.service";
import PopupHolder from "../Popups/PopupHolder";
import exit from "../../assets/Icons/exit.png"

function getTextColor(bgColor) {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 128 ? "#000000" : "#FFFFFF";
}

function EditTagUI({ tag, accessToken ,handleEditPopup }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedColor, setSelectedColor] = useState(tag.color || "#34d348");
  const colorOptions = [
    "#34d348",
    "#ff6347",
    "#f39c12",
    "#2980b9",
    "#8e44ad",
    "#16a085",
    "#e74c9c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#f1c40f",
    "#1abc9c",
  ];

  const editTag = async (data) => {
    try {
      const res = await TagsService.updateTag(tag._id, { ...data, color: selectedColor }, accessToken);
      handleEditPopup()
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(editTag)}
      className="absolute py-9 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[95vw] shadow-lg shadow-black dark:bg-[#1d1d1d] bg-white lg:w-[60vh] h-fit flex flex-col justify-start items-center gap-5"
    >
      <button className="fixed w-6 h-6 right-2 top-2" onClick={handleEditPopup}>
      <img src={exit} alt="" />
      </button>
      

      <input
        {...register("name", { required: "Tag name is required" })}
        defaultValue={tag.name}
        className="w-10/12 lg:w-10/12 text-xl px-5 py-2 rounded-full border-[1px] border-black text-black dark:bg-[#2d2d2d] dark:text-white"
        placeholder="Edit Tag"
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <div className="flex gap-4 w-full justify-center items-center flex-wrap">
        {colorOptions.map((color) => (
          <button
            key={color}
            onClick={(e) => {
              e.preventDefault();
              setSelectedColor(color);
            }}
            className={`w-8 h-8 rounded-full ${
              color === selectedColor ? "border-4 border-[#39a2ff]" : ""
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <button
        type="submit"
        className="text-xl bg-[#39a2ff] w-10/12  h-10 rounded-full font-light text-black dark:text-white"
      >
        Save Changes
      </button>
    </form>
  );
}

function TagPageTagBox({ tag, accessToken }) {
  const [editPopup, setEditPopup] = useState(false);

  const handleEditPopup = () => {
    setEditPopup(!editPopup);
  };

  const deleteTag = async () => {
    try {
      await TagsService.deleteTag(tag._id, accessToken);
      const res = await TagsService.getUserTags(accessToken);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>

          {editPopup && <PopupHolder>
            <EditTagUI tag={tag} accessToken={accessToken} handleEditPopup={handleEditPopup}/>
            </PopupHolder>}


      <div
        className={`w-full lg:w-fit h-fit px-5 py-2 gap-5 flex justify-between items-center rounded-3xl`}
        style={{ backgroundColor: tag?.color }}
      >
        <h2
          className="w-full text-2xl"
          style={{ color: getTextColor(tag?.color) }}
        >
          {tag?.name}
        </h2>
        <div className="w-fit h-fit flex gap-2">
          <button onClick={handleEditPopup} className="w-6 h-6">
            <img className="w-full h-full" src={penWhite} alt="Edit" />
          </button>
          <button onClick={deleteTag} className="w-6 h-6">
            <img className="w-full h-full" src={deleteRed} alt="Delete" />
          </button>
        </div>
      </div>
    </>
  );
}

export default TagPageTagBox;

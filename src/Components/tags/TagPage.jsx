import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import TagPageTagBox from "./TagPageTagBox";
import TagsService from "@/Services/tags.service";
import { useDispatch, useSelector } from "react-redux";
import { setTags as setTagsRedux } from "@/Store/tags.store";

function TagPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [tags, setTags] = useState([]);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [selectedColor, setSelectedColor] = useState("#34d348");
  const [error, setError] = useState("");
  const dispatch = useDispatch()


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

  const onSubmit = async (data) => {
    const newTag = { name: data.name, color: selectedColor };

    try {
      const res = await TagsService.createTag(newTag, accessToken);
      reset();
      setSelectedColor("#34d348");
      setError("");
      alert("Tag added successfully!");
    } catch (error) {
      console.error(error);
      setError("An error occurred while adding the tag. Please try again.");
    }
  };

  const fetchUsertags = async () => {
    try {
      const res = await TagsService.getUserTags(accessToken);
      setTags(res.data)
      dispatch(setTagsRedux(res.data))
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()=>{
    fetchUsertags()
  },[accessToken])

  return (
    <>
      <Helmet>
        <title>Tags | Actionote</title>
      </Helmet>
      <div className="w-full min-h-[90vh] flex flex-col justify-start items-center gap-10 px-5">
        <h1 className="w-full font-light text-7xl lg:text-9xl text-[#39a2ff] border-b-[6px] pb-6 pr-5 border-[#39a2ff]">
          Manage Your Tags
        </h1>
        {error && <p className="text-red-500">{error}</p>}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-fit flex flex-col justify-start items-center gap-5"
        >
          <input
            {...register("name", { required: "Tag name is required" })}
            className="w-11/12 lg:w-5/12 text-xl px-5 py-2 rounded-full border-[1px] border-black text-black"
            placeholder="Add Tag"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <div className="flex gap-4 w-full justify-center items-center flex-wrap">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission on color button click
                  setSelectedColor(color);
                }}
                className={`w-8 h-8 rounded-full ${
                  color === selectedColor ? "border-4 border-[#39a2ff]" : ""
                }`}
                style={{ backgroundColor: color }}
              ></button>
            ))}
          </div>
          <button
            type="submit"
            className="text-xl bg-[#39a2ff] w-11/12 lg:w-5/12 h-10 rounded-full font-light text-black dark:text-white"
          >
            Add Tag
          </button>
        </form>
        {tags.length !== 0 && (
          <div className="w-full h-fit">
            <h1 className="w-full font-normal text-4xl lg:text-4xl text-[#39a2ff] border-b-[3px] pb-2 pr-5 border-[#39a2ff]">
              Your Tags
            </h1>
            <div className="w-full h-fit flex justify-start items-start flex-wrap p-5 gap-6">
              {tags.map((tag, index) => (
                <TagPageTagBox key={index} tag={tag} accessToken={accessToken}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TagPage;

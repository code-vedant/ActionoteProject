import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import TinyRTE from "./RTE";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import NotesService from "@/Services/notes.service";
import { useTheme } from "@/context/ThemeContext";
import TagBar from "../tags/TagBar";
import { decrypt, encrypt } from "@/Binders/Encypt";
import PopupHolder from "../Popups/PopupHolder";
import { Helmet } from "react-helmet";
import { ClockLoader } from "react-spinners";

function NotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const tags = useSelector((state) => state.tags.tags);
  const { theme } = useTheme();
  const [prevData, setPrevData] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [messagePopup, setMessagePopup] = useState(false);
  const [tagsOptions, setTagsOptions] = useState([]);
  const [tagsValue, setTagsValue] = useState([]);

  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (!tags) return;
  
    const options = tags.map((tag, index) => {
      const tagId = tag?._id || `tag-id-${index}`;
      const tagName = tag?.name || `Unknown-${index}`;
  
      return {
        value: tagId,
        label: tagName,
        key: tagId,
      };
    });
  
    setTagsOptions(options);
  }, [tags]);

  useEffect(() => {
    const fetchNote = async () => {
      if (id !== "new") {
        try {
          setLoading(true); 
          const decryptedId = decrypt(id);
          const notes = await NotesService.getNoteById(decryptedId, accessToken);
          setPrevData(notes.data);
          reset({
            title: notes.data?.title || "",
            content: notes.data?.content || "",
            tags:
              notes.data?.tags.map((tag) => ({
                value: tag._id,
                label: tag.name,
                key: tag._id,
              })) || [],
          });
          setLoading(false);
        } catch (error) {
          console.error("Error fetching notes:", error.message);
          setLoading(false);
        }
      } else {
        reset({ title: "", content: "", tags: [] });
      }
    };

    fetchNote();
  }, [id, reset, accessToken]);

  const onSubmit = async (data) => {
    try {
      setLoading(true); 
      const formattedData = {
        ...data,
        tags: tagsValue.map((tag) => tag.value),
      };
      console.log("formattedData: ", formattedData);
      
      const response = await NotesService.saveNote(formattedData, accessToken);
      setLoading(false);
      setMessagePopup(true);
      navigate(`/dashboard/notes/${encrypt(response.data._id)}`);
    } catch (error) {
      console.error("Error saving note:", error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true); 
      const decryptedId = decrypt(id);
      await NotesService.deleteNote(decryptedId, accessToken);
      setLoading(false);
      navigate(-1);
    } catch (error) {
      console.error("Error deleting note:", error);
      setLoading(false);
    }
  };

  const updateNote = async () => {
    try {
      setLoading(true); 
      const formattedData = {
        ...prevData,
        tags: tagsValue.map((tag) => tag.value),
      };
      const decryptedId = decrypt(id);
      await NotesService.updateNote(decryptedId, formattedData, accessToken);
      setLoading(false);
      setMessagePopup(true);
    } catch (error) {
      console.error("Error updating note:", error);
      setLoading(false);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "#282828" : "#ffffff",
      borderColor: state.isFocused ? "#39a2ff" : "#e2e8f0",
      color: theme === "dark" ? "#fff" : "#000",
      borderRadius: "18px",
      padding: "3px",
      boxShadow: state.isFocused ? "0 0 0 2px #39a2ff" : "none",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "#282828" : "#ffffff",
      borderRadius: "5px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#39a2ff" : "transparent",
      color: state.isFocused ? "#fff" : theme === "dark" ? "#e2e8f0" : "#000",
      borderRadius: "18px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme === "dark" ? "#fff" : "#000",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "#3c3c3c" : "#ececec",
      borderRadius: "18px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: theme === "dark" ? "#ececec" : "#000",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: theme === "dark" ? "#ececec" : "#000",
      ":hover": {
        backgroundColor: theme === "dark" ? "#ff4d4d" : "#e11d48",
        color: "#fff",
      },
    }),
  };

  return (
    <>
    <Helmet>
        <title>{`${prevData?.title || prevData?.content} | Notes | Actionote`}</title>
        <meta name="description" content="write and save notes " />
        <meta name="keywords" content="notes, actionote, information" />
      </Helmet>
    <div className="w-full min-h-screen px-5 flex flex-col justify-start items-center">
      {loading && (
        <PopupHolder>
          <ClockLoader color="#39a2ff" size={100} speedMultiplier={4}/>
        </PopupHolder>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-3"
      >
        {loading ? (
           <PopupHolder>
           <ClockLoader color="#39a2ff" size={100} speedMultiplier={4}/>
         </PopupHolder>
        ) : (
          <>
            <input
              {...register("title")}
              className="text-3xl font-bold text-[#39a2ff] bg-inherit outline-none w-full sm:w-[90vw] lg:w-[60vw] border-b-2 border-[#39a2ff]"
              placeholder="Title of Note"
            />

            <div className="w-full h-full lg:px-40 flex justify-center items-center gap-3">
              <TagBar tags={prevData?.tags || []} />
              <Select
                {...register("tags")}
                isMulti
                options={tagsOptions}
                className="react-select-container z-50 w-full sm:w-[90vw] lg:w-[30vw]"
                classNamePrefix="react-select"
                styles={customStyles}
                onChange={(value) => {
                  setTagsValue(value);
                }}
              />
            </div>

            <TinyRTE
              {...register("content")}
              className="w-full sm:w-[90vw] lg:w-[60vw] lg:h-[90vw] mt-4"
              initialValue={prevData?.content}
              handleEditorChange={(content) => setValue("content", content)}
            />

            {id === "new" ? (
              <button
                type="submit"
                className="text-xl px-8 py-2 rounded-full text-white border-2 border-[#39a2ff] bg-[#39a2ff]"
              >
                Save
              </button>
            ) : (
              <div className="w-full flex justify-center items-center gap-5">
                <div
                  onClick={handleDelete}
                  className="text-xl px-8 py-2 rounded-full text-red-500 border-2 border-red-500 hover:text-white hover:bg-red-500"
                >
                  Delete
                </div>
                <div>
                  <button
                    type="button"
                    onClick={updateNote}
                    className="text-xl px-8 py-2 rounded-full text-white border-2 border-[#39a2ff] bg-[#39a2ff]"
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </form>
    </div>
    </>
  );
}

export default NotePage;
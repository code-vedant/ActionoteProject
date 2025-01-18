import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TinyRTE from "./RTE";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import NotesService from "@/Services/notes.service";
import { useTheme } from "@/context/ThemeContext";
import TagBar from "../tags/TagBar";
import { decrypt } from "@/Binders/Encypt";

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
  const [selectedTags, setSelectedTags] = useState([]);

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const decryptedId = decrypt(id);

  useEffect(() => {
    if (!prevData?.tags) return;
    const options = tags.map((tag) => ({
      value: tag._id,
      label: tag.name,
    }));
    setTagsOptions(options);

    // Set the selected tags only after tagsOptions are populated
    const selected = prevData.tags.map((tag) => ({
      value: tag._id,
      label: tag.name,
    }));
    setSelectedTags(selected);
  }, [tags, prevData]); // Watch for changes in tags and prevData

  useEffect(() => {
    const fetchNote = async () => {
      if (id !== "new") {
        try {
          const notes = await NotesService.getNoteById(decryptedId, accessToken);
          setPrevData(notes.data);
          reset({
            title: notes.data?.title || "",
            content: notes.data?.content || "",
            tags: notes.data?.tags.map((tag) => ({
              value: tag._id,
              label: tag.name,
            })) || [],
          });
        } catch (error) {
          console.error("Error fetching notes:", error.message);
        }
      } else {
        reset({ title: "", content: "", tags: [] });
      }
    };

    fetchNote();
  }, [decryptedId, reset, accessToken]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formattedData = {
        ...data,
        tags: data.tags.map((tag) => tag.value),
      };
      const response = await NotesService.saveNote(formattedData, accessToken);
      setLoading(false);
      setMessagePopup(true);
      navigate(`/dashboard/notes/${response.data._id}`);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await NotesService.deleteNote(decryptedId, accessToken);
      navigate(-1);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const updateNote = async () => {
    try {
      setLoading(true);
      const formattedData = {
        ...prevData,
        tags: prevData.tags.map((tag) => tag.value),
      };
      await NotesService.updateNote(id, formattedData, accessToken);
      setLoading(false);
      setMessagePopup(true);
    } catch (error) {
      console.error("Error updating note:", error);
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
    <div className="w-full min-h-screen px-5 flex flex-col justify-start items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-3">
        {/* Title Input */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="text-3xl font-bold text-[#39a2ff] bg-inherit outline-none w-full sm:w-[90vw] lg:w-[60vw] border-b-2 border-[#39a2ff]"
              placeholder="Title of Note"
              value={prevData?.title || ""}
            />
          )}
        />
        
        {/* Tag Selection */}
        <div className="w-full h-full lg:px-40 flex justify-center items-center gap-3">
          <TagBar tags={prevData?.tags || []} />
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={tagsOptions}
                value={selectedTags}  // Use selectedTags to control the value
                className="react-select-container z-50 w-full sm:w-[90vw] lg:w-[30vw]"
                classNamePrefix="react-select"
                styles={customStyles}
                onChange={(selected) => {
                  setValue("tags", selected);
                  setSelectedTags(selected);  // Update selectedTags on change
                }}
              />
            )}
          />
        </div>

        {/* Content Editor */}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TinyRTE
              {...field}
              className="w-full sm:w-[90vw] lg:w-[60vw] lg:h-[90vw] mt-4"
              initialValue={prevData?.content || ""}
              handleEditorChange={(content) => setValue("content", content)}
            />
          )}
        />

        {/* Submit/Update Buttons */}
        {id === "new" ? (
          <button type="submit" className="text-xl px-8 py-2 rounded-full text-white border-2 border-[#39a2ff] bg-[#39a2ff]">
            Save
          </button>
        ) : (
          <div className="w-full flex justify-center items-center gap-5">
            <div onClick={handleDelete} className="text-xl px-8 py-2 rounded-full text-red-500 border-2 border-red-500 hover:text-white hover:bg-red-500">
              Delete
            </div>
            <div>
              <button type="button" onClick={updateNote} className="text-xl px-8 py-2 rounded-full text-white border-2 border-[#39a2ff] bg-[#39a2ff]">
                Update
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default NotePage;

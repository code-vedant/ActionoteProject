import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import TodoService from "../../Services/todo.service.js";
import { useTheme } from "@/context/ThemeContext.jsx";
import { useSelector } from "react-redux";

const AddTodoForm = ({ accessToken, handleTodoPopup }) => {
  const today = new Date();
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      content: "",
      status: false,
      priority: "medium",
      dueDate: today,
      tags: [],
      description: "",
    },
  });

  const tags = useSelector((state) => state.tags.tags);
  const tagsOptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.name,
  }));

  const [selectedDate, setSelectedDate] = useState(today);

  const statusOptions = [
    { value: false, label: "Pending" },
    { value: true, label: "Completed" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const { theme } = useTheme();

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

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      tags: data.tags.map((tag) => tag.value),
      dueDate: selectedDate.toISOString().split("T")[0],
    };

    try {
      await TodoService.createTodo(formattedData, accessToken);
      reset();
      handleTodoPopup();
    } catch (error) {
      console.error("Failed to add the todo", error);
    }
  };

  useEffect(() => {
    setValue("dueDate", selectedDate);
  }, [selectedDate, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[90vw] lg:w-[40vw] bg-[#ffffff] dark:bg-[#282828] p-4 rounded-lg shadow-md flex flex-col space-y-4"
    >
      <h2 className="text-xl font-semibold text-center text-gray-600 dark:text-white">
        Add New Todo
      </h2>

      {/* Content */}
      <div className="flex flex-col">
        <label
          htmlFor="content"
          className="text-gray-600 dark:text-white mb-1"
        >
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          {...register("content", { required: "Content is required" })}
          className="w-full px-3 py-2 border rounded-2xl border-gray-300 dark:bg-[#363636] dark:text-white"
        />
        {errors.content && (
          <span className="text-red-500 text-sm">{errors.content.message}</span>
        )}
      </div>

      {/* Status */}
      <div className="flex flex-col">
        <label className="text-gray-600 dark:text-white">Status</label>
        <Select
          options={statusOptions}
          styles={customStyles}
          defaultValue={statusOptions[0]}
          onChange={(selected) => setValue("status", selected.value)}
        />
      </div>

      {/* Priority */}
      <div className="flex flex-col">
        <label className="text-gray-600 dark:text-white">Priority</label>
        <Select
          options={priorityOptions}
          styles={customStyles}
          defaultValue={priorityOptions[1]}
          onChange={(selected) => setValue("priority", selected.value)}
        />
      </div>

      {/* Due Date */}
      <div className="flex flex-col">
        <label className="text-gray-600 dark:text-white">Due Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="w-full px-3 py-2 border rounded-2xl border-gray-300 dark:bg-[#363636] dark:text-white"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-col">
        <label className="text-gray-600 dark:text-white">Tags</label>
        <Select
          isMulti
          name="tags"
          options={tagsOptions}
          styles={customStyles}
          onChange={(selected) => setValue("tags", selected)}
        />
      </div>
      {/* Description */}
      <div className="flex flex-col">
        <label
          htmlFor="description"
          className="text-gray-600 dark:text-white mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          className="w-full px-3 py-2 border rounded-2xl border-gray-300 dark:bg-[#363636] dark:text-white"
        />
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-between gap-4">
        <button
          type="button"
          className="w-full py-2 border border-black dark:border-white text-black dark:text-white rounded-full hover:bg-red-400 hover:border-red-400 hover:text-white"
          onClick={handleTodoPopup}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`w-full py-2 bg-[#39a2ff] text-white rounded-full ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Todo"}
        </button>
      </div>
    </form>
  );
};

export default AddTodoForm;

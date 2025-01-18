import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import TodoService from "@/Services/todo.service";
import { useTheme } from "@/context/ThemeContext";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";

function AddTodoTab() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const accessToken = useSelector((state) => state.auth.accessToken);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      content: "",
      status: { value: false, label: "Pending" },
      priority: { value: "medium", label: "Medium" },
      dueDate: selectedDate,
      tags: [],
      description: "",
    },
  });

  const tags = useSelector((state) => state.tags.tags);
  const tagsOptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.name,
  }));

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
      status: data.status.value,
      priority: data.priority.value,
      tags: data.tags.map((tag) => tag.value),
      dueDate: selectedDate.toISOString().split("T")[0],
    };

    try {
      await TodoService.createTodo(formattedData, accessToken);
      reset();
    } catch (error) {
      console.error("Failed to add the todo", error);
    }
  };

  return (
    <div className="w-full h-full p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* Content */}
        <div>
          <label className="block text-gray-600 dark:text-white">
            Task Title:
          </label>
          <input
            type="text"
            placeholder="Enter task"
            className="w-full px-3 py-2 border border-gray-300 dark:bg-[#282828] rounded-2xl"
            {...register("content", { required: "Task content is required" })}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        {/* Status (React-Select) */}
        <div>
          <label className="block text-gray-600 dark:text-white">
            Status:
          </label>
          <Select
            options={statusOptions}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customStyles}
            onChange={(selected) => setValue("status", selected)}
          />
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
        </div>

        {/* Priority (React-Select) */}
        <div>
          <label className="block text-gray-600 dark:text-white">
            Priority:
          </label>
          <Select
            options={priorityOptions}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customStyles}
            onChange={(selected) => setValue("priority", selected)}
          />
          {errors.priority && (
            <p className="text-red-500 text-sm">{errors.priority.message}</p>
          )}
        </div>

        {/* Due Date */}
        <div className="w-full">
          <label className="block text-gray-600 dark:text-white">
            Due Date:
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
            className="w-full px-3 py-2 border border-gray-300 dark:bg-[#282828] rounded-2xl"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-gray-600 dark:text-white">Tags:</label>
          <Select
            isMulti
            options={tagsOptions}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customStyles}
            onChange={(selected) => setValue("tags", selected)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-600 dark:text-white">
            Description:
          </label>
          <textarea
            className="w-full px-3 py-2 border dark:bg-[#282828] border-gray-300 rounded-2xl"
            placeholder="Add more details about the task"
            {...register("description")}
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-2 bg-none border-[1px] border-black dark:border-white dark:text-white dark:hover:border-red-400 rounded-full text-black dark:hover:bg-red-400 hover:bg-red-400 hover:border-red-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`w-full py-2 bg-[#39a2ff] text-white rounded-full hover:bg-blue-600 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add ToDo"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTodoTab;

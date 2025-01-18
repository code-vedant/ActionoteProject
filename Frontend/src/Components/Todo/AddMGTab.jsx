import { useTheme } from "@/context/ThemeContext";
import MonthlyGoalService from "@/Services/monthlyGoal.service";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Select from "react-select";

function AddMGTab() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const tags = useSelector((state) => state.tags.tags);
  const tagsOptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.name,
  }));

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 7)
  );

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

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: false,
      month: new Date().toISOString().slice(0, 7),
      priority: "medium",
      tags: [],
    },
  });

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        tags: data.tags.map((tag) => tag.value),
      };
      console.log("Submitting data:", formattedData);
      await MonthlyGoalService.addGoal(formattedData, accessToken);
      reset();
    } catch (err) {
      console.error("Failed to add the goal. Please try again.", err);
    }
  };

  return (
    <div className="w-full h-full p-4 rounded-lg">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        <div className="flex flex-col">
          <label htmlFor="title" className="text-gray-600 dark:text-white">
            Add Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter title"
            className="w-full px-3 py-2 border border-gray-300 dark:bg-[#363636] rounded-2xl mt-2"
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-gray-600 dark:text-white">Status</label>
            <Select
              name="status"
              options={statusOptions}
              defaultValue={statusOptions[0]}
              styles={customStyles}
              onChange={(selected) => setValue("status", selected.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-gray-600 dark:text-white">Priority</label>
            <Select
              name="priority"
              options={priorityOptions}
              defaultValue={priorityOptions[0]}
              styles={customStyles}
              onChange={(selected) => setValue("priority", selected.value)}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 dark:text-white">Month</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM"
            showMonthYearPicker
            className="w-full px-3 py-2 border dark:bg-[#363636]  border-gray-300 rounded-2xl"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 dark:text-white">Tags:</label>
          <Select
            name="tags"
            isMulti
            options={tagsOptions}
            styles={customStyles}
            onChange={(selected) => setValue("tags", selected)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="text-gray-600 dark:text-white"
          >
            Description:
          </label>
          <textarea
            name="description"
            id="description"
            placeholder="Enter description"
            className="w-full px-3 py-2 border min-h-28 dark:bg-[#363636] border-gray-300 rounded-2xl"
            {...register("description")}
          ></textarea>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="w-full py-2 bg-none border-[1px] border-black dark:border-white dark:text-white dark:hover:border-red-400 rounded-full text-black dark:hover:bg-red-400 hover:bg-red-400 hover:border-red-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full py-2 bg-[#39a2ff] text-white rounded-full hover:bg-blue-600"
          >
            Add Goal
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMGTab;

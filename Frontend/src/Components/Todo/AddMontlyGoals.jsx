import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useTheme } from "@/context/ThemeContext";
import MonthlyGoalService from "../../Services/monthlyGoal.service"; 
import { useSelector } from "react-redux";

const AddMonthlyGoalForm = ({ accessToken, handleMntPopup }) => {
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

  const tags = useSelector((state) => state.tags.tags);
  const tagsOptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.name,
  }));

  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [error, setError] = useState(null);

  const statusOptions = [
    { value: false, label: "Pending" },
    { value: true, label: "Completed" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

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
    setLoading(true);
    setError(null);

    try {
      const payload = { ...data, tags: data.tags.map((tag) => tag.value) };
      await MonthlyGoalService.addGoal(payload, accessToken);
      reset();
      handleMntPopup();
    } catch (err) {
      setError("Failed to add the goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue("month", selectedMonth.toISOString().slice(0, 7));
  }, [selectedMonth, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[90vw] lg:w-[40vw] bg-[#ffffff] dark:bg-[#282828] p-4 rounded-lg shadow-md flex flex-col space-y-4"
    >
      <h2 className="text-xl font-semibold text-center text-gray-600 dark:text-white">
        Add Monthly Goal
      </h2>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex flex-col">
        <label htmlFor="title" className="text-gray-600 dark:text-white">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          placeholder="Enter title"
          className="w-full px-3 py-2 border rounded-2xl border-gray-300 dark:bg-[#363636] dark:text-white"
          {...register("title", { required: "Title is required" })}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="description" className="text-gray-600 dark:text-white">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Enter description"
          className="w-full px-3 py-2 border min-h-[100px] rounded-2xl border-gray-300 dark:bg-[#363636] dark:text-white"
          {...register("description")}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-600 dark:text-white">Status</label>
        <Select
          options={statusOptions}
          styles={customStyles}
          defaultValue={statusOptions[0]}
          onChange={(selected) => setValue("status", selected.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-600 dark:text-white">Priority</label>
        <Select
          options={priorityOptions}
          styles={customStyles}
          defaultValue={priorityOptions[1]}
          onChange={(selected) => setValue("priority", selected.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-600 dark:text-white">Month</label>
        <DatePicker
          selected={selectedMonth}
          onChange={(date) => setSelectedMonth(date)}
          dateFormat="yyyy-MM"
          showMonthYearPicker
          className="w-full px-3 py-2 border rounded-2xl border-gray-300 dark:bg-[#363636] dark:text-white"
        />
      </div>
      <div className="w-full mb-4">
        <label className="block text-gray-600 dark:text-white mb-1">Tags</label>
        <Select
          isMulti
          name="tags"
          options={tagsOptions}
          styles={customStyles}
          onChange={(selected) => setValue("tags", selected)}
        />
      </div>

      <div className="flex justify-between gap-4">
        <button
          type="button"
          className="w-full py-2 border border-black dark:border-white text-black dark:text-white rounded-full hover:bg-red-400 hover:border-red-400 hover:text-white"
          onClick={handleMntPopup}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full py-2 bg-[#39a2ff] text-white rounded-full hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Goal"}
        </button>
      </div>
    </form>
  );
};

export default AddMonthlyGoalForm;

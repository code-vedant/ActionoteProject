import React, { useEffect, useState } from "react";
import MonthlyGoalService from "../../Services/monthlyGoal.service.js"; // Adjust path as necessary

const AddMonthlyGoalForm = ({
  accessToken,
  handleMntPopup,
}) => {

  console.log(accessToken);
  
  // Initialize the form data with the current month in YYYY-MM format
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: false,
    month: new Date().toISOString().slice(0, 7), // Get the current month in YYYY-MM format
    priority: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        handleMntPopup();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleMntPopup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newGoal = await MonthlyGoalService.addGoal(formData, accessToken);
      setFormData({
        title: "",
        description: "",
        status: "pending",
        month: new Date().toISOString().slice(0, 7), // Reset to current month
        priority: "medium",
      });
    } catch (err) {
      setError("Failed to add the goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[90vw] lg:w-[40vw] bg-[#ffffff] dark:bg-[#282828] p-2 rounded-lg shadow-md flex flex-col justify-start items-start"
    >
      <h2 className="text-xl font-semibold text-center w-full text-gray-600 dark:text-white">
        Add Monthly Goal
      </h2>

      {error && <div className="w-full text-red-500 text-sm my-2">{error}</div>}

      <div className="w-full">
        <label
          htmlFor="title"
          className="text-gray-600 dark:text-white mb-1 block"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full bg-[#ececec] dark:bg-[#363636] dark:text-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="w-full">
        <label
          htmlFor="description"
          className="text-gray-600 dark:text-white mb-1 block"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-[#ececec] dark:bg-[#363636] dark:text-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="w-full">
        <label
          htmlFor="status"
          className="text-gray-600 dark:text-white mb-1 block"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full bg-[#ececec] dark:bg-[#363636] dark:text-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="w-full">
        <label
          htmlFor="month"
          className="text-gray-600 dark:text-white mb-1 block"
        >
          Month <span className="text-red-500">*</span>
        </label>
        <input
          type="month"
          id="month"
          name="month"
          value={formData.month}
          onChange={handleChange}
          required
          className="w-full bg-[#ececec] dark:bg-[#363636] dark:text-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="w-full">
        <label
          htmlFor="priority"
          className="text-gray-600 dark:text-white mb-1 block"
        >
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full bg-[#ececec] dark:bg-[#363636] dark:text-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex w-full justify-between items-center py-2 gap-2 mt-5">
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#39a2ff] text-white py-2 px-4 rounded-md shadow  focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Adding..." : "Add Goal"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={handleMntPopup}
          className={`w-full bg-[#e64040] text-white py-2 px-4 rounded-md shadow  focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Canceling.." : "Cancel"}
        </button>
      </div>
    </form>
  );
};

export default AddMonthlyGoalForm;
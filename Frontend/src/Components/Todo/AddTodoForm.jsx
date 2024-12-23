import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import TodoService from "../../Services/todo.service.js"; // Adjust the path as necessary

const AddTodoForm = ({ accessToken, handleTodoPopup }) => {
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      content: "",
      status: false,
      priority: "medium",
      dueDate: today,
      tags: "",
      recurring: false,
      description: "",
    },
  });

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        handleTodoPopup();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleTodoPopup]);

  const onSubmit = async (data) => {
    // Process tags as an array
    const formattedData = {
      ...data,
      tags: data.tags.split(",").map((tag) => tag.trim()),
    };

    try {
      await TodoService.createTodo(formattedData, accessToken);
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Failed to add the todo", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[90vw] lg:w-[40vw] bg-[#ffffff] dark:bg-[#282828] p-2 rounded-lg shadow-md flex flex-col justify-start items-start"
    >
      <h2 className="text-xl text-center w-full font-semibold text-sky-blue">
        Add New Todo
      </h2>

      {/* Content */}
      <div className="w-full">
        <label
          htmlFor="content"
          className="block dark:text-white text-gray-600 mb-1 w-full"
        >
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          {...register("content", { required: "Content is required" })}
          className="w-full bg-[#ececec] dark:text-white border-gray-300 dark:bg-[#363636] rounded-md shadow-sm"
        />
        {errors.content && (
          <span className="text-red-500 text-sm">{errors.content.message}</span>
        )}
      </div>

      {/* Status and Priority */}
      <div className="w-full flex gap-2 justify-start items-end">
        {/* Status */}
        <div className="w-full">
          <label
            htmlFor="status"
            className="block dark:text-white text-gray-600 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="w-full bg-[#ececec] dark:text-white border-gray-300 dark:bg-[#363636] py-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="w-full">
          <label
            htmlFor="priority"
            className="block dark:text-white text-gray-600 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            {...register("priority")}
            className="w-full bg-[#ececec] dark:text-white border-gray-300 rounded-md py-1 dark:bg-[#363636] shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Due Date and Recurring */}
      <div className="w-full flex gap-2 justify-start items-end">
        {/* Due Date */}
        <div className="w-full">
          <label
            htmlFor="dueDate"
            className="block dark:text-white text-gray-600 mb-1"
          >
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            defaultValue={today}
            {...register("dueDate")}
            className="w-fit bg-[#ececec] dark:text-white border-gray-300 dark:bg-[#363636] rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Recurring */}
        <div className="flex items-center w-full">
          <input
            type="checkbox"
            id="recurring"
            {...register("recurring")}
            className="h-4 w-4 bg-[#ececec] text-indigo-600 dark:text-white dark:bg-[#363636] border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="recurring"
            className="ml-2 dark:text-white text-gray-600"
          >
            Recurring
          </label>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label
          htmlFor="tags"
          className="block dark:text-white text-gray-600 mb-1"
        >
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          {...register("tags")}
          className="w-full bg-[#ececec] dark:text-white border-gray-300 dark:bg-[#363636] rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <label
          htmlFor="description"
          className="block dark:text-white text-gray-600 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          className="w-full bg-[#ececec] border-gray-300 dark:bg-[#363636] dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex w-full justify-between items-center py-2 gap-2 mt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-[#39a2ff] text-white py-2 px-4 rounded-md shadow ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Adding..." : "Add Todo"}
        </button>
        <button
          type="button"
          onClick={handleTodoPopup}
          disabled={isSubmitting}
          className="w-full bg-[#e64040] text-white py-2 px-4 rounded-md shadow"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTodoForm;

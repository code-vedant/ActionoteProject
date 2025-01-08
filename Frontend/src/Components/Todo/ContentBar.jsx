// ContentBar.js
import React, { useState } from "react";
import TagBar from "../tags/TagBar";
import penBlue from "../../assets/Icons/penBlue.png";
import deleteRed from "../../assets/Icons/deleteRed.png";
import check from "../../assets/Icons/check.png";
import checkbox from "../../assets/Icons/checkbox.png";
import TodoService from "../../Services/todo.service"; // Ensure correct path to the service

function ContentBarTask({ task,accessToken}) {

  
  const [isChecked, setIsChecked] = useState(task.status);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    handleTaskCompletion();
  };

  const handleTaskCompletion = async () => {
    try {
      await TodoService.updateTodoStatus(task._id, { status: !isChecked }, accessToken);
      
    } catch (error) {
      console.error("Failed to update task completion", error);
    }
  };

  const handleEdit = async () => {
    try {
      const updatedTaskData = {
        ...task,
        status: isChecked ? "completed" : "pending",
      };
      await TodoService.editTodo(task._id, updatedTaskData, accessToken);
      onEdit(updatedTaskData); // Notify parent component with updated task
    } catch (error) {
      console.error("Failed to edit task", error);
    }
  };

  const handleDelete = async () => {
    try {
      await TodoService.deleteTodo(task._id, accessToken);
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <div className="grid grid-cols-[10%,70%,20%] items-center bg-[#f2f3f4] dark:bg-[#363636] rounded-lg shadow-sm px-2 py-1 w-full">
      <div className="w-full h-full flex justify-center items-center aspect-square">
        <img
          src={isChecked ? check : checkbox}
          alt={isChecked ? "Task completed" : "Task not completed"}
          onClick={handleCheckboxChange}
          className="w-10/12 lg:w-3/6 lg:h-3/6 cursor-pointer"
        />
      </div>

      <div className="w-full h-full flex flex-col justify-start items-center px-2">
        <h4 className={`text-gray-600 dark:text-white truncate font-semibold w-full ${isChecked ? "line-through text-gray-400" : ""}`}>
          {task.content}
        </h4>
        <div className="w-full h-4 mt-1">
          <TagBar tags={task.tags} />
        </div>
      </div>

      <div className="btns flex w-full h-full items-center justify-end space-x-2">
        <button onClick={handleEdit} className="text-white w-8 h-8 hover:scale-125 flex justify-center items-center transition-transform">
          <img src={penBlue} className="w-4/5 h-4/5" alt="Edit" />
        </button>

        <button onClick={handleDelete} className="text-white w-8 h-8 hover:scale-125 flex justify-center items-center transition-transform">
          <img src={deleteRed} className="w-4/5 h-4/5" alt="Delete" />
        </button>
      </div>
    </div>
  );
}

export default ContentBarTask;
// ContentBar.js
import React, { useMemo, useState } from "react";
import TagBar from "../tags/TagBar";
import penBlue from "../../assets/Icons/penBlue.png";
import deleteRed from "../../assets/Icons/deleteRed.png";
import check from "../../assets/Icons/check.png";
import checkbox from "../../assets/Icons/checkbox.png";
import TodoService from "../../Services/todo.service"; // Ensure correct path to the service
import { useTheme } from "@/context/ThemeContext";

function ContentBarTask({ task,accessToken}) {

    const {theme}  = useTheme()
  
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

  const bgColor = useMemo(() => {
      const bgColors = [
        "#FFDEE9", 
        "#B5FFFC", 
        "#FFD5E5", 
        "#C3F3FF", 
        "#FFFAE3",
        "#E3F6FD",
        "#D1FFD7",
        "#FFF4D2",
        "#FBE4FF", 
        "#FFEBE9",
      ];
      return bgColors[Math.floor(Math.random() * bgColors.length)];
    }, []);

    const bgColorDark = useMemo(() => {
      const bgColors = [
        "#1C1C1C", // Slightly darker than #282828
        "#202020", // Neutral dark gray
        "#242424", // Off-black with a soft tone
        "#2E2E2E", // Dark slate gray, distinct from #282828
        "#333333", // Classic dark gray with enough contrast
        "#3A3A3A", // Medium-dark gray for slight variation
        "#1A1A1A", // Deep black-gray
        "#191919", // Rich off-black
        "#303030", // Neutral medium dark gray
        "#373737", // Slightly warm dark gray
      ];
      return bgColors[Math.floor(Math.random() * bgColors.length)];
    }, []);
    

  return (
    <div className="grid grid-cols-[10%,70%,20%] items-center rounded-lg shadow-sm px-2 py-1 w-full"
    style={{backgroundColor: theme === "dark" ?bgColorDark : bgColor}}
    >
      <div className="w-full h-full flex justify-center items-center aspect-square">
        <img
          src={isChecked ? check : checkbox}
          alt={isChecked ? "Task completed" : "Task not completed"}
          onClick={handleCheckboxChange}
          className="w-10/12 lg:w-3/6 lg:h-3/6 cursor-pointer"
        />
      </div>

      <div className="w-full h-full flex flex-col justify-start items-center px-2">
        <h4 className={`text-gray-800 dark:text-white truncate font-semibold w-full ${isChecked ? "line-through text-gray-400" : ""}`}>
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
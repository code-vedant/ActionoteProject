import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PopupHolder from "../Popups/PopupHolder";
import AddTodoForm from "./AddTodoForm";
import AddMonthlyGoalForm from "./AddMontlyGoals";
import ContentBarTask from "./ContentBar";
import ContentBarMG from "./ContentBarMG";
import { Helmet } from "react-helmet";
import MonthlyGoalService from "@/Services/monthlyGoal.service";
import TodoService from "@/Services/todo.service";
import { addTodo } from "@/Store/todo.store";

const TodoPage = () => {
  // Function to format current date into "YYYY-MM"
  const getYearMonth = (date) => {
    const year = date.getFullYear();  // Get the year (e.g., 2024)
    const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Get the month and ensure it's 2 digits (e.g., 11 for November)
    return `${year}-${month}`;  // Combine them in YYYY-MM format
  };

  const [tasks, setTasks] = useState([]); // Tasks state
  const [goals, setGoals] = useState([]); // Monthly goals state
  const [loading, setLoading] = useState(false);
  const [todoPopup, setTodoPopup] = useState(false); // Todo popup visibility state
  const [mntPopup, setMntPopup] = useState(false); // Goal popup visibility state
  const accessToken = useSelector((state) => state.auth.accessToken); // Access token from Redux
  const dispatch = useDispatch();

  const [currentDate, setCurrentDate] = useState(new Date()); // Current date for tasks
  const [month, setMonth] = useState(getYearMonth(new Date())); // Set the initial month in the format "YYYY-MM"

  // Function to fetch tasks for the current date
  const fetchTodo = async () => {
    try {
      const todo = await TodoService.getTodosByDate(currentDate, accessToken);
      if (todo.data && todo.data[currentDate.toISOString().split('T')[0]]) {
        setTasks(todo.data[currentDate.toISOString().split('T')[0]]);
        dispatch(addTodo(todo.data));
      } else {
        console.error('No tasks found');
      }
    } catch (error) {
      console.error('Error fetching todos:', error.response);
    }
  };

  // Function to fetch monthly goals based on the selected month
  const fetchGoals = async () => {
    try {
      const response = await MonthlyGoalService.getGoalsByMonth(month, accessToken);
      if (response.data && Array.isArray(response.data)) {
        setGoals(response.data);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  // Function to change the current month
  const changeMonth = (increment) => {
    const newDate = new Date(month + "-01");  // Add a day to ensure the date object is valid
    newDate.setMonth(newDate.getMonth() + increment);  // Increment or decrement the month
    setMonth(getYearMonth(newDate));  // Update the state with the new month
  };

  // Call fetchTodo and fetchGoals whenever the `month` or `currentDate` changes
  useEffect(() => {
    fetchTodo();
    fetchGoals();
  }, [accessToken, currentDate, month]); // Run when accessToken, currentDate or month changes

  // Toggle task popup visibility
  const handleTodoPopup = () => {
    setTodoPopup(!todoPopup);
  };

  // Toggle goal popup visibility
  const handleMntPopup = () => {
    setMntPopup(!mntPopup);
  };

  return (
    <>
      <Helmet>
        <title>Your Todo | Monthly Goals | Actionote</title>
        <meta name="description" content="Your daily to-do list, monthly goals, and more!" />
      </Helmet>

      <div className="h-full w-full flex flex-col justify-start items-start">
        {/* Popup for adding Todo */}
        {todoPopup && (
          <PopupHolder>
            <AddTodoForm accessToken={accessToken} handleTodoPopup={handleTodoPopup} />
          </PopupHolder>
        )}

        {/* Popup for adding Monthly Goal */}
        {mntPopup && (
          <PopupHolder>
            <AddMonthlyGoalForm accessToken={accessToken} handleMntPopup={handleMntPopup} />
          </PopupHolder>
        )}

        {/* Buttons to add Todo or Goal */}
        <div className="w-full py-5 lg:py-0 px-5 lg:px-52 flex justify-between items-center h-[5%]">
          <button onClick={handleTodoPopup} className="px-5 py-1 bg-[#39a2ff] text-white rounded-md shadow">
            Add Todo
          </button>
          <button onClick={handleMntPopup} className="px-5 py-1 bg-[#39a2ff] text-white rounded-md shadow">
            Add Goal
          </button>
        </div>

        <div className="h-[95%] w-full flex flex-col lg:flex-row justify-start items-start gap-2 lg:gap-5 py-5 px-5 lg:px-52">
          {/* Today's To-Do Section */}
          <div className="w-full lg:w-3/5 h-[40vh] lg:h-[80vh] flex justify-start items-center gap-2 flex-col bg-[#fffefe] dark:bg-[#282828] shadow-2xl drop-shadow-md rounded-lg p-4">
            <div className="topTools h-[10%] mb-4 w-full lg:h-[5%] relative flex justify-between items-center">
              <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))} className="px-2 py-1 bg-[#39a2ff] text-white rounded-md shadow">
                {"<"}
              </button>
              <h2 className="text-2xl h-full flex justify-center items-center font-bold text-[#39a2ff]">
                To-Do
              </h2>
              <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))} className="px-2 py-1 bg-[#39a2ff] text-white rounded-md shadow">
                {">"}
              </button>
            </div>

            <div className="flex flex-col w-full h-[90%] lg:h-[95%] justify-start items-start gap-1">
              {tasks.map((task) => (
                <ContentBarTask task={task} key={task._id} accessToken={accessToken} />
              ))}
            </div>
          </div>

          {/* Monthly Goals Section */}
          <div className="w-full lg:w-3/5 h-[40vh] lg:h-[80vh] flex justify-start items-center gap-2 flex-col bg-[#fffefe] dark:bg-[#282828] shadow-2xl drop-shadow-md rounded-lg p-4">
            <div className="topTools h-[10%] mb-4 w-full lg:h-[5%] relative flex justify-between items-center">
              <button onClick={() => changeMonth(-1)} className="px-2 py-1 bg-[#39a2ff] text-white rounded-md shadow">
                {"<"}
              </button>
              <h2 className="text-2xl h-full flex justify-center items-center font-bold text-[#39a2ff]">
                {month} Goals
              </h2>
              <button onClick={() => changeMonth(1)} className="px-2 py-1 bg-[#39a2ff] text-white rounded-md shadow">
                {">"}
              </button>
            </div>

            <div className="flex flex-col w-full h-[90%] lg:h-[95%] justify-start items-start gap-1">
              {goals.map((goal) => (
                <ContentBarMG task={goal} key={goal.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoPage;
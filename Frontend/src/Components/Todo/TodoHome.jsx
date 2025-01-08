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
  const getYearMonth = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  };

  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todoPopup, setTodoPopup] = useState(false);
  const [mntPopup, setMntPopup] = useState(false);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();

  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
  const [month, setMonth] = useState(getYearMonth(new Date()));

  const fetchTodo = async () => {
    setLoading(true); // Start loading indicator
    try {
      const todo = await TodoService.getTodosByDate(currentDate, accessToken); // Fetch data for the current date
      console.log(todo); // Debugging: Check the raw response
  
      if (todo?.data && todo.data[currentDate]) {
        const tasksForToday = todo.data[currentDate]; // Extract tasks for the specific date
        setTasks(tasksForToday); // Update the state with the extracted tasks
        dispatch(addTodo(tasksForToday)); // Dispatch to Redux store
      } else {
        console.error("No tasks found for today");
        setTasks([]); // Clear the tasks state if no tasks found
      }
    } catch (error) {
      console.error("Error fetching todos:", error?.response || error.message || error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };
  

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

  const changeMonth = (increment) => {
    const newDate = new Date(month + "-01");
    newDate.setMonth(newDate.getMonth() + increment);
    setMonth(getYearMonth(newDate));
  };

  const changeDate = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + increment);
    setCurrentDate(newDate.toISOString().split("T")[0]);
  };

  const formatMonth = (dateString) => {
    const date = new Date(dateString + "-01");
    const options = { year: "numeric", month: "long" }; 
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    fetchTodo();
  }, [ currentDate]);

  useEffect(() => {
    fetchGoals();
  }, [month]);

  const handleTodoPopup = () => setTodoPopup(!todoPopup);

  const handleMntPopup = () => setMntPopup(!mntPopup);

  return (
    <>
      <Helmet>
        <title>Your Todo | Monthly Goals | Actionote</title>
        <meta name="description" content="Your daily to-do list, monthly goals, and more!" />
      </Helmet>

      <div className="h-full w-full flex flex-col justify-start items-start">
        {todoPopup && (
          <PopupHolder>
            <AddTodoForm accessToken={accessToken} handleTodoPopup={handleTodoPopup} />
          </PopupHolder>
        )}
        {mntPopup && (
          <PopupHolder>
            <AddMonthlyGoalForm accessToken={accessToken} handleMntPopup={handleMntPopup} />
          </PopupHolder>
        )}

        <div className="w-full py-5 lg:py-0 px-5 lg:px-52 flex justify-between items-center h-[5%]">
          <button onClick={handleTodoPopup} className="px-5 py-1 bg-[#39a2ff] text-white rounded-md shadow">
            Add Todo
          </button>
          <button onClick={handleMntPopup} className="px-5 py-1 bg-[#39a2ff] text-white rounded-md shadow">
            Add Goal
          </button>
        </div>

        <div className="h-[95%] w-full flex flex-col lg:flex-row justify-start items-start gap-2 lg:gap-5 py-5 px-5 lg:px-52">
          <div className="w-full lg:w-3/5 h-[40vh] lg:h-[80vh] flex flex-col bg-[#fffefe] dark:bg-[#282828] shadow-2xl rounded-lg p-4">
            <div className="topTools h-[10%] mb-4 w-full lg:h-[5%] flex justify-between items-center">
              <button onClick={() => changeDate(-1)} className="px-2 py-1 bg-[#39a2ff] text-white rounded-md shadow">
                {"<"}
              </button>
              <h2 className="text-2xl font-bold text-[#39a2ff]">
                {new Date(currentDate).toLocaleDateString()}
              </h2>
              <button onClick={() => changeDate(1)} className="px-2 py-1 bg-[#39a2ff] text-white rounded-md shadow">
                {">"}
              </button>
            </div>
            <div className="flex flex-col w-full h-[90%] justify-start gap-1">
              {loading ? (
                <p className="text-xl font-bold text-[#39a2ff]">Loading tasks...</p>
              ) : ( tasks.length === 0 ? <p className="text-xl font-bold text-[#39a3ff] w-full text-center">No task for the day.. </p> :
                tasks.map((task) => <ContentBarTask task={task} key={task._id} accessToken={accessToken} />)
              )}
            </div>
          </div>

          <div className="w-full lg:w-3/5 h-[40vh] lg:h-[80vh] flex flex-col bg-[#fffefe] dark:bg-[#282828] shadow-2xl rounded-lg p-4">
            <div className="topTools h-[10%] mb-4 w-full lg:h-[5%] flex justify-between items-center">
              <button onClick={() => changeMonth(-1)} className="px-2 py-1 bg-[#39a2ff] text-white rounded-md shadow">
                {"<"}
              </button>
              <h2 className="text-2xl font-bold text-[#39a2ff]">{formatMonth(month)} Goals</h2>
              <button onClick={() => changeMonth(1)} className="px-2 py-1 bg-[#39a2ff] text-white rounded-md shadow">
                {">"}
              </button>
            </div>
            <div className="flex flex-col w-full h-[90%] justify-start gap-1">
              {goals.map((goal) => (
                <ContentBarMG task={goal} key={goal.id} accessToken={accessToken}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoPage;

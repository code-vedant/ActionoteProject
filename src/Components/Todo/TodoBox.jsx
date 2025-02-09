import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentBarTask from "./ContentBar";
import TodoService from "@/Services/todo.service";
import down from "../../assets/Icons/down.webp";

const useFetchTodo = (currentDate, accessToken) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodo = async () => {
    setLoading(true);
    setError(null);
    try {
      const todo = await TodoService.getTodosByDate(currentDate, accessToken);
      
      if (todo?.data && todo.data[currentDate]) {
        const tasksForToday = todo.data[currentDate];
        setTasks(tasksForToday);
      } else {
        setTasks([]);
      }
    } catch (err) {
      setError("Connection Error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, [currentDate]);

  return { tasks, loading, error };
};

function TodoBox() {
  const getYearMonth = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  };

  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
  const [month, setMonth] = useState(getYearMonth(new Date()));
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();

  const { tasks, loading, error } = useFetchTodo(currentDate, accessToken);

  const changeDate = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + increment);
    setCurrentDate(newDate.toISOString().split("T")[0]);
  };

  return (
    <div className="w-full lg:w-8/12 h-[40vh] lg:h-[85vh] flex flex-col bg-[#fffefe] dark:bg-[#282828] shadow-lg p-4">
      <div className="topTools h-[10%] mb-4 w-full lg:h-[5%] flex justify-between items-center">
        <button
          onClick={() => changeDate(-1)}
          className="px-2 aspect-square font-normal border-[1px] w-8 h-8 border-[#39a2ff] flex justify-center items-center rounded-full"
        >
          <img src={down} className="w-4/5 h-2/5 rotate-90" alt="" />
        </button>
        <h2 className="text-2xl font-bold text-[#39a2ff]">
          {new Date(currentDate).toLocaleDateString()}
        </h2>
        <button
          onClick={() => changeDate(1)}
          className="px-2 aspect-square font-normal border-[1px] w-8 h-8 border-[#39a2ff] flex justify-center items-center rounded-full"
        >
          <img src={down} className="w-4/5 h-2/5 -rotate-90" alt="" />
        </button>
      </div>
      <div className="flex flex-col w-full h-[90%] justify-start gap-1">
        {loading ? (
          <p className="text-xl font-normal w-full text-center text-[#39a2ff]">
            Loading tasks...
          </p>
        ) : error ? (
          <p className="text-xl font-normal text-[#FF6B6B] w-full text-center">
            {error}
          </p>
        ) : tasks.length === 0 ? (
          <p className="text-xl font-normal text-[#FF6B6B] w-full text-center">
            No task for the day..
          </p>
        ) : (
          tasks.map((task) => (
            <ContentBarTask task={task} key={task._id} accessToken={accessToken} />
          ))
        )}
      </div>
    </div>
  );
}

export default TodoBox;
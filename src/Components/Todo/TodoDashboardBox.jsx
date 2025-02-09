import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ContentBarTask from "./ContentBar";
import { Link } from "react-router-dom";

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

  const testTask = [
    {
      "_id": "task1",
      "content": "Complete React assignment",
      "status": false,
      "tags": ["React", "Homework"]
    },
    {
      "_id": "task2",
      "content": "Prepare for Math quiz",
      "status": true,
      "tags": ["Math", "Study"]
    },
    {
      "_id": "task3",
      "content": "Fix bug in authentication module",
      "status": false,
      "tags": ["Coding", "Backend"]
    },
    {
      "_id": "task4",
      "content": "Read about GraphQL",
      "status": false,
      "tags": ["Learning", "GraphQL"]
    },
    {
      "_id": "task5",
      "content": "Design UI for dashboard",
      "status": true,
      "tags": ["Design", "UI/UX"]
    },
    {
      "_id": "task6",
      "content": "Refactor API endpoints",
      "status": false,
      "tags": ["Backend", "Optimization"]
    },
    {
      "_id": "task7",
      "content": "Write blog on JavaScript closures",
      "status": false,
      "tags": ["Blog", "JavaScript"]
    },
    {
      "_id": "task8",
      "content": "Attend team stand-up meeting",
      "status": true,
      "tags": ["Meeting", "Work"]
    },
    {
      "_id": "task9",
      "content": "Test new feature implementation",
      "status": false,
      "tags": ["Testing", "Feature"]
    },
    {
      "_id": "task10",
      "content": "Plan weekend project",
      "status": false,
      "tags": ["Planning", "Project"]
    }
  ]
  
  

function TodoDashboardBox() {
    const getYearMonth = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      return `${year}-${month}`;
    };
  
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
    const [month, setMonth] = useState(getYearMonth(new Date()));
    const accessToken = useSelector((state) => state.auth.accessToken);
  
    const { tasks, loading, error } = useFetchTodo(currentDate, accessToken);

  
    return (
      <div className="w-full h-full flex flex-col bg-[#fffefe] dark:bg-[#282828] shadow-lg p-4">
        <div className="topTools h-[10%] mb-4 w-full lg:h-[5%] flex justify-center items-center">
          <h2 className="text-2xl font-bold text-[#39a2ff]">
            {new Date(currentDate).toLocaleDateString()}
          </h2>
        </div>
        <div className="flex flex-col w-full h-[90%] justify-start gap-1 overflow-scroll">
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
            testTask.map((task) => (
              <ContentBarTask task={task} key={task._id} accessToken={accessToken} />
            ))
          )}
        </div>
        <Link to={"todo"} className="w-44 h-auto bg-sky-blue rounded-full px-3 text-white py-2 flex items-center justify-center mt-2">
          <h1>Manage Todos</h1>
        </Link>
      </div>
    );
  }
  
  export default TodoDashboardBox;
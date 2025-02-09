import TodoService from "@/Services/todo.service";
import MonthlyGoalService from "@/Services/monthlyGoal.service";
import { ResponsiveBar } from "@nivo/bar";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { useScreen } from "@/context/ScreenContext";
import { setTags } from "@/Store/tags.store";
import TagsService from "@/Services/tags.service";
import pen from "../assets/Icons/pen.webp";
import penWhite from "../assets/Icons/penWhite.webp";
import { Link } from "react-router-dom";
import TodoDashboardBox from "@/Components/Todo/TodoDashboardBox";
import axios from "axios";

const DashboardHome = () => {
  const [todoData, setTodoData] = useState([]);
  const [goalData, setGoalData] = useState([]);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsertags = async () => {
      try {
        const res = await TagsService.getUserTags(accessToken);
        dispatch(setTags(res.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsertags();
  }, [accessToken]);

  useEffect(() => {
    const fetchData = async (service, setData, dateFormat, key) => {
      const today = new Date();
      const summary = [];

      for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        key === "date" ? date.setDate(today.getDate() - i) : date.setMonth(today.getMonth() - i);
        const formattedDate = date.toISOString().split("T")[0].slice(0, dateFormat);

        try {
          const response = await service(formattedDate, accessToken);
          const items = response.data?.[formattedDate] || [];
          summary.push({
            [key]: formattedDate,
            total: items.length,
            completed: items.filter((item) => item.status === true).length,
          });
        } catch (error) {
          summary.push({ [key]: formattedDate, total: 0, completed: 0 });
        }
      }
      setData(summary);
    };

    fetchData(TodoService.getTodosByDate, setTodoData, 10, "date");
    fetchData(MonthlyGoalService.getGoalsByMonth, setGoalData, 7, "month");
  }, [accessToken]);

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const { screenWidth } = useScreen();
  const isMobile = screenWidth < 1024;

  const graphTheme = {
    axis: {
      ticks: { text: { fill: isDarkMode ? "#fff" : "#333" } },
      legend: { text: { fill: isDarkMode ? "#fff" : "#333" } },
    },
    legends: { text: { fill: isDarkMode ? "#fff" : "#333" } },
    tooltip: { container: { background: isDarkMode ? "#333" : "#fff", color: isDarkMode ? "#fff" : "#333" } },
  };

  const renderGraph = (title, data, keys, indexBy, legendX, legendY) => (
    <div className="w-full lg:w-[55vw] h-[40vh]">
      <h2 className="text-3xl font-light text-[#39a2ff]">{title}</h2>
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        layout="vertical"
        colors={({ id }) => (id.includes("Completed") ? "#2de1c2" : "#39a2ff")}
        axisBottom={{ legend: legendX, legendPosition: "middle", legendOffset: 32 }}
        axisLeft={{ legend: legendY, legendPosition: "middle", legendOffset: -40 }}
        enableGridY={false}
        legends={[{
          anchor: "top-right",
          direction: "column",
          translateX: isMobile ? -250 : 60,
          itemsSpacing: 0,
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: isMobile ? 8 : 16,
          symbolShape: "circle",
        }]}
        theme={graphTheme}
      />
    </div>
  );

  const [quote,setQuote] = useState("The worst man is the one who sees himself as the best.")


  const getQuote =async  () => {
    try {
      const response =await  axios.get("https://dummyjson.com/quotes/random");
        setQuote(response.data.quote);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };




  return (
    <div className="w-full h-[91vh] flex lg:flex-row flex-col shadow-lg px-2 lg:px-20 gap-8">
      <div className="flex flex-col gap-5 w-full">
        {renderGraph("Todo Statistics", todoData, ["total", "completed"], "date", "Date", "Todos")}
        {renderGraph("Monthly Goals Statistics", goalData, ["total", "completed"], "month", "Month", "Goals")}
      </div>
      <div className="flex flex-col justify-start w-full h-full">
        <div className="w-full hidden lg:block h-44 lg:h-96 px-2 py-2">
          <TodoDashboardBox />
        </div>
        <div className=" w-full h-fit py-2 hidden lg:flex items-center gap-4">
          {[{ link: "notes/new", label: "Add Note" }, { link: "draw/startedNewDrawing", label: "Let's Draw" }, { link: "diary", label: "Go to Diary" }, { link: "calendar", label: "Add Event" }].map(({ link, label }) => (
            <Link key={link} to={link} className="w-32 h-10 flex justify-center items-center bg-white shadow-md dark:bg-[#282828] rounded-full px-3 gap-2">
              <h1>{label}</h1>
            </Link>
          ))}
        </div>
        <div className="w-full h-14 lg:h-44 lg:mt-1 shadow-lg flex flex-col justify-center items-end gap-4 bg-white">
            <p className="w-full text-center h-full lg:px-5 flex justify-center items-center">
            {quote}
            </p>
            <button onClick={getQuote} className="font-light text-xs w-fit h-fit px-2">
              <h1>change quote</h1>
            </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

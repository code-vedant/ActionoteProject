import TodoService from "@/Services/todo.service";
import MonthlyGoalService from "@/Services/monthlyGoal.service";
import { ResponsiveBar } from "@nivo/bar";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { useScreen } from "@/context/ScreenContext";
import { setTags } from "@/Store/tags.store";

const DashboardHome = () => {
  const [todoData, setTodoData] = useState([]);
  const [goalData, setGoalData] = useState([]);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();

  const fetchUsertags = async () => {
    try {
      const res = await TagsService.getUserTags(accessToken);
      dispatch(setTags(res.data))
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsertags()
  }, [accessToken]);

  useEffect(() => {
    // Fetch Todo data
    const fetchTodoData = async () => {
      const today = new Date();
      const summary = [];

      for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split("T")[0];

        try {
          const response = await TodoService.getTodosByDate(
            formattedDate,
            accessToken
          );

          const todos = response.data?.[formattedDate] || [];

          if (Array.isArray(todos)) {
            const totalTodos = todos.length;
            const completedTodos = todos.filter(
              (todo) => todo.status === true
            ).length;

            summary.push({
              date: formattedDate,
              totalTodos,
              completedTodos,
            });
          } else {
            summary.push({
              date: formattedDate,
              totalTodos: 0,
              completedTodos: 0,
            });
          }
        } catch (error) {
          summary.push({
            date: formattedDate,
            totalTodos: 0,
            completedTodos: 0,
          });
        }
      }

      setTodoData(summary);
    };

    // Fetch Monthly Goals data
    const fetchGoalData = async () => {
      const today = new Date();
      const summary = [];

      for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i); // Go back month by month
        const formattedMonth = date.toISOString().split("T")[0].slice(0, 7); // e.g., '2025-01'

        try {
          const response = await MonthlyGoalService.getGoalsByMonth(
            formattedMonth,
            accessToken
          );

          const goals = response.data || [];

          if (Array.isArray(goals)) {
            const totalGoals = goals.length;
            const completedGoals = goals.filter(
              (goal) => goal.status === true
            ).length;

            summary.push({
              month: formattedMonth,
              totalGoals,
              completedGoals,
            });
          } else {
            summary.push({
              month: formattedMonth,
              totalGoals: 0,
              completedGoals: 0,
            });
          }
        } catch (error) {
          summary.push({
            month: formattedMonth,
            totalGoals: 0,
            completedGoals: 0,
          });
        }
      }

      setGoalData(summary);
    };

    fetchTodoData();
    fetchGoalData();
  }, [accessToken]);

  // Sort Todo Data and Goal Data
  const sortedTodoData = todoData.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const sortedGoalData = goalData.sort(
    (a, b) => new Date(a.month) - new Date(b.month)
  );

  const todoGraphData = sortedTodoData.map((entry) => ({
    date: entry.date,
    "Total Todos": entry.totalTodos,
    "Completed Todos": entry.completedTodos,
  }));

  const goalGraphData = sortedGoalData.map((entry) => ({
    month: entry.month,
    "Total Goals": entry.totalGoals,
    "Completed Goals": entry.completedGoals,
  }));

  const { theme } = useTheme();
  const isDarkMode = theme == "dark";
  const {screenWidth} = useScreen()
  const isMobile = screenWidth < 1024;

  const customTheme = {
    axis: {
      ticks: {
        text: {
          fill: isDarkMode ? "#ffffff" : "#333333",
        },
      },
      legend: {
        text: {
          fill: isDarkMode ? "#ffffff" : "#333333",
        },
      },
    },
    legends: {
      text: {
        fill: isDarkMode ? "#ffffff" : "#333333",
      },
    },
    tooltip: {
      container: {
        background: isDarkMode ? "#333333" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#333333",
      },
    },
  };

  

  return (
    <div className="w-full h-[91vh] flex flex-col shadow-lg px-2 lg:px-20 gap-8">
    <div className="w-[58vh] lg:w-[55vw] h-[20vh] lg:h-[40vh]">
      <h2 className="text-3xl font-light text-[#39a2ff]">Todo Statistics</h2>
      <ResponsiveBar
        data={todoGraphData}
        keys={["Total Todos", "Completed Todos"]}
        indexBy="date"
        margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        layout="vertical"
        colors={({ id }) =>
          id === "Completed Todos" ? "#2de1c2" : "#39a2ff"
        }
        axisBottom={{
          legend: "Date",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          legend: "Todos",
          legendPosition: "middle",
          legendOffset: -40,
        }}
          enableGridY={false}
        legends={[
          {
            anchor: "top-right",
            direction: "column",
            translateX: isMobile ? -250 : 60,
            translateY: isMobile ? -20 : 0,
            itemsSpacing: 0,
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            className: "lg:translate-x-[90px] lg:translate-y-0 sm:translate-x-0 sm:translate-y-[-20px]",
          },
        ]}
        theme={customTheme}
      />
    </div>
  
    <div className="w-[58vh] lg:w-[55vw] h-[20vh] lg:h-[40vh]">
      <h2 className="text-3xl font-light text-[#39a2ff]">Monthly Goals Statistics</h2>
      <ResponsiveBar
        data={goalGraphData}
        keys={["Total Goals", "Completed Goals"]}
        indexBy="month"
        margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        layout="vertical"
        colors={({ id }) =>
          id === "Completed Goals" ? "#2de1c2" : "#39a2ff"
        }
        axisBottom={{
          legend: "Month",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          legend: "Goals",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        enableGridY={false}
        legends={[
          {
            anchor: "top-right",
            direction: "column",
            translateX: isMobile ? -250 : 60,
            translateY: isMobile ? -20 : 0,
            itemsSpacing: 0,
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: isMobile ? 8 : 16,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            className: "lg:translate-x-[90px] lg:translate-y-0 sm:translate-x-0 sm:translate-y-[-20px]",
          },
        ]}
        theme={customTheme}
      />
    </div>
  </div>
  
  );
};

export default DashboardHome;

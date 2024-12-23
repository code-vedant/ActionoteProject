import DiaryService from "@/Services/diary.service";
import NotesService from "@/Services/notes.service";
import TodoService from "@/Services/todo.service";
import { addNote } from "@/Store/notes.store";
import { addTodo } from "@/Store/todo.store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DashboardHome = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();

  // Utility function to get today's date or an offset
  const getDateWithOffset = (offset = 0) => {
    const today = new Date();
    today.setDate(today.getDate() + offset);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
  };

  const date = getDateWithOffset();

  // Fetch and store todos in Redux
  const fetchAllEntities = async () => {
    try {
      // Fetch Notes
      const notes = await NotesService.getAllNotes(accessToken);
      console.log("Fetched Notes:", notes.data);
      if (Array.isArray(notes.data) && notes.data.length > 0) {
        dispatch(addNote(notes.data));
      } else {
        console.log("No notes found.");
      }
  
      // Fetch Monthly Goals (Example Service - You'll need to create the actual service method)
      const monthlyGoals = await GoalService.getAllGoals(accessToken);
      console.log("Fetched Monthly Goals:", monthlyGoals.data);
      if (Array.isArray(monthlyGoals.data) && monthlyGoals.data.length > 0) {
        dispatch(addMonthlyGoals(monthlyGoals.data));
      } else {
        console.log("No monthly goals found.");
      }
  
      // Fetch Draw (Example Service - You'll need to create the actual service method)
      const draw = await DrawService.getDraws(accessToken);
      console.log("Fetched Draws:", draw.data);
      if (Array.isArray(draw.data) && draw.data.length > 0) {
        dispatch(addDraw(draw.data));
      } else {
        console.log("No draw data found.");
      }
  
      // Fetch Flow (Example Service - You'll need to create the actual service method)
      const flow = await FlowService.getFlows(accessToken);
      console.log("Fetched Flow:", flow.data);
      if (Array.isArray(flow.data) && flow.data.length > 0) {
        dispatch(addFlow(flow.data));
      } else {
        console.log("No flow data found.");
      }
  
      // Fetch Diary (Example Service - You'll need to create the actual service method)
      const diary = await DiaryService.getDiaries(accessToken);
      console.log("Fetched Diary Entries:", diary.data);
      if (Array.isArray(diary.data) && diary.data.length > 0) {
        dispatch(addDiary(diary.data));
      } else {
        console.log("No diary entries found.");
      }
  
      // Fetch Tags (Example Service - You'll need to create the actual service method)
      // const tags = await Tag(accessToken);
      // console.log("Fetched Tags:", tags.data);
      // if (Array.isArray(tags.data) && tags.data.length > 0) {
      //   dispatch(addTags(tags.data));
      // } else {
      //   console.log("No tags found.");
      // }
  
      // Fetch Todos
      const todos = await TodoService.getTodosByDate(getDateWithOffset(), accessToken);
      console.log("Fetched Todos:", todos.data);
      if (Array.isArray(todos.data) && todos.data.length > 0) {
        todos.data.forEach((todo) => {
          dispatch(addTodo(todo));
        });
      } else {
        console.log("No todos found.");
      }
  
    } catch (error) {
      console.error("Error fetching entities:", error.message);
    }
  };
  
  useEffect(() => {
    fetchAllEntities()
  }, [accessToken]);

  // Sample data for the chart
  const data = [
    { name: "Week 1", value: 2 },
    { name: "Week 2", value: 4 },
    { name: "Week 3", value: 6 },
    { name: "Week 4", value: 8 },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Tasks Progress Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Tasks Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardHome;

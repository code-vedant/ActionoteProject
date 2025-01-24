import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarService from "@/Services/calendar.service";
import { useSelector } from "react-redux";
import "../../index.css";
import { useTheme } from "@/context/ThemeContext";

const localizer = momentLocalizer(moment);

function CustomToolbar({ label, onNavigate, onView, view }) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-2 pb-4 bg-white dark:bg-[#282828] shadow-md rounded-md space-y-2 lg:space-y-0">
  {/* Navigation Buttons */}
  <div className="flex flex-wrap space-x-2">
    <button
      className="px-3 lg:px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 rounded-lg hover:bg-blue-500 hover:text-white transition"
      onClick={() => onNavigate("TODAY")}
    >
      Today
    </button>
    <button
      className="px-3 lg:px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 rounded-lg hover:bg-blue-500 hover:text-white transition"
      onClick={() => onNavigate("PREV")}
    >
      Prev
    </button>
    <button
      className="px-3 lg:px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 rounded-lg hover:bg-blue-500 hover:text-white transition"
      onClick={() => onNavigate("NEXT")}
    >
      Next
    </button>
  </div>

  {/* Current Month/Year Label */}
  <div className="text-3xl font-semibold text-black dark:text-white text-center lg:text-left">
    {label}
  </div>

  {/* View Selector Buttons */}
  <div className="flex flex-wrap justify-end space-x-2">
    {["month", "week", "day", "agenda"].map((v) => (
      <button
        key={v}
        className={`px-3 lg:px-4 py-2 rounded-lg transition ${
          view === v
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
        } hover:bg-blue-500 hover:text-white`}
        onClick={() => onView(v)}
      >
        {v.charAt(0).toUpperCase() + v.slice(1)}
      </button>
    ))}
  </div>
</div>

  );
}

function CalendarComponent() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [apiEvents, setApiEvents] = useState([]);
  const { theme } = useTheme();

  // Fetch events from the API
  const fetchEvents = async () => {
    try {
      const response = await CalendarService.getEvents(accessToken);

      const formattedEvents = response.map((event) => ({
        id: event._id,
        title: event.title,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
      }));

      setApiEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [accessToken]);

  // Dynamic styles for weekdays and weekends
  const getDayStyle = (date) => {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const backgroundColor = isWeekend
      ? theme === "dark"
        ? "#1d1d1d"
        : "#f0f0f0"
      : theme === "dark"
      ? "#2d2d2d"
      : "#ffffff";

    return {
      backgroundColor,
      color: isWeekend ? "#9e9e9e" : theme === "dark" ? "#ffffff" : "#000000",
    };
  };

  return (
    <div className="p-2 w-full bg-white dark:bg-[#282828] h-full">
      <Calendar
        localizer={localizer}
        events={apiEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", width: "100%" }}
        onSelectEvent={(event) => alert(`Event: ${event.title}`)}
        views={["month", "week", "day", "agenda"]}
        defaultView="month"
        components={{
          toolbar: CustomToolbar, // Add the custom toolbar
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: "#39a2ff", // Your primary blue
            color: "#ffffff",
            borderRadius: "8px",
            padding: "4px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          },
        })}
        dayPropGetter={(date) => ({
          style: getDayStyle(date),
        })}
      />
    </div>
  );
}

export default CalendarComponent;

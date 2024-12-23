import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    description: "",
    location: "",
    allDay: false,
    recurrence: "",
    recurrenceEndDate: null,
    color: "#39a2ff",
    reminder: "",
    status: "Pending",
  });

  // Fetch Calendar Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/calendar");
        const fetchedEvents = response.data.data.map(event => ({
          ...event,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Handle Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Save Calendar Event
  const handleSave = async () => {
    try {
      const response = await axios.post("/api/calendar", form);
      const savedEvent = {
        ...response.data.data,
        start: new Date(response.data.data.startDate),
        end: new Date(response.data.data.endDate),
      };
      setEvents([...events, savedEvent]);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Calendar Management
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "75vh" }}
className="rbc-calendar dark:bg-gray-900 dark:text-gray-300 rounded-lg shadow-md"
          onSelectEvent={(event) => {
            setSelectedEvent(event);
            setForm(event);
            setShowModal(true);
          }}
          onSelectSlot={() => {
            setForm({
              title: "",
              startDate: new Date(),
              endDate: new Date(),
              description: "",
              location: "",
              allDay: false,
              recurrence: "",
              recurrenceEndDate: null,
              color: "#39a2ff",
              reminder: "",
              status: "Pending",
            });
            setShowModal(true);
          }}
          selectable
        />
      </div>

      {/* Modal for Adding/Editing Events */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[90vw] lg:w-[40vw]">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h2>

            <form className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-600 dark:text-white"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-600 dark:text-white"
                  htmlFor="startDate"
                >
                  Start Date
                </label>
                <DatePicker
                  selected={form.startDate}
                  onChange={(date) => setForm({ ...form, startDate: date })}
                  className="mt-1 w-full rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                  showTimeSelect
                  dateFormat="Pp"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-600 dark:text-white"
                  htmlFor="endDate"
                >
                  End Date
                </label>
                <DatePicker
                  selected={form.endDate}
                  onChange={(date) => setForm({ ...form, endDate: date })}
                  className="mt-1 w-full rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                  showTimeSelect
                  dateFormat="Pp"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;

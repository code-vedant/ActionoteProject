import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarService from "../../Services/calendar.service";
import { useSelector } from "react-redux";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    description: "",
    location: "",
    allDay: false,
    color: "#39a2ff",
    recurrence: "none",
    reminder: 30,
    status: "confirmed",
  });

  // Fetch Calendar Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await CalendarService.getEvents(accessToken);
        // Convert fetched events to match the format required by the calendar
        const formattedEvents = fetchedEvents.map((event) => ({
          ...event,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [accessToken]);

  // Handle Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Save Calendar Event
  const handleSave = async () => {
    try {
      const eventData = {
        ...form,
        startDate: form.startDate.toISOString(),
        endDate: form.endDate.toISOString(),    
      };
      const savedEvent = await CalendarService.saveEvent(eventData, accessToken);
      const newEvent = {
        ...savedEvent,
        start: new Date(savedEvent.startDate),
        end: new Date(savedEvent.endDate),
      };
      setEvents([...events, newEvent]);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Event Calendar
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "75vh" }}
          className="rbc-calendar dark:bg-gray-900 dark:text-gray-300 rounded-lg shadow-md"
          onSelectSlot={() => {
            setForm({
              title: "",
              startDate: new Date(),
              endDate: new Date(),
              description: "",
              location: "",
              allDay: false,
              color: "#39a2ff",
              recurrence: "none",
              reminder: 30,
              status: "confirmed",
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
              Add Event
            </h2>

            <form className="space-y-4">
              {/* Other form fields here */}

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

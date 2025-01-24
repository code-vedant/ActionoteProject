import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "/calendar";

const CalendarService = {
  getEvents: async (accessToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.data;
    } catch (error) {
      if (error.response) {
        console.error("Error fetching events:", error.response.data.message);
      } else {
        console.error("Error:", error.message);
      }
      throw error;
    }
  },

  saveEvent: async (eventData, accessToken) => {
    try {
      const response = await axios.post(`${BASE_URL}/`, eventData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error saving event:", error.response.data.message);
      } else {
        console.error("Error:", error.message);
      }
      throw error;
    }
  },

  editEvent: async (eventData, accessToken) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/${eventData.id}`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error editing event:", error.response.data.message);
      } else {
        console.error("Error:", error.message);
      }
      throw error;
    }
  },

  deleteEvent: async (eventId, accessToken) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${eventId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error deleting event:", error.response.data.message);
      } else {
        console.error("Error:", error.message);
      }
      throw error;
    }
  },
};

export default CalendarService;

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "/calendar";

const CalendarService = {
  // Fetch all calendar events for the logged-in user
  getEvents: async (accessToken) => {
    console.log(accessToken);
    
    try {
      const response = await axios.get(`${BASE_URL}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data.data);
      
      return response.data.data; 
    } catch (error) {
      if (error.response) {
        console.error("Error fetching events:", error.response.data.message);
      } else {
        console.error("Error:", error.message);
      }
      throw error; // Throw error to be handled by the calling component
    }
  },

  // Save a new event or update an existing event
  saveEvent: async (eventData,accessToken) => {
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
};

export default CalendarService;
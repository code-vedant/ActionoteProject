import axios from "axios";

const URL = import.meta.env.VITE_BASE_URL + "/diary";

const DiaryService = {
  // Method to get all diaries of a user
  getDiaries: async (accessToken) => {
    try {
      const response = await axios.get(`${URL}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching diaries:", error.response?.data || error.message || error);
      throw new Error(error.response?.data.message || "Error fetching diaries");
    }
  },

  // Method to get today's diary
  getTodayDiary: async (accessToken) => {
    try {
      const response = await axios.get(`${URL}/today`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching today diary:", error.response?.data || error.message || error);
      throw new Error(error.response?.data.message || "Error fetching today diary");
    }
  },

  // Method to get diary by date
  getDiaryByDate: async (date, accessToken) => {
    try {
      // Format date to YYYY-MM-DD if necessary (depending on how the backend expects it)
      const formattedDate = new Date(date).toISOString().split('T')[0]; // '2024-12-21'
      const response = await axios.get(`${URL}/${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching diary by date:", error.response?.data || error.message || error);
      throw new Error(error.response?.data.message || "Error fetching diary by date");
    }
  },

  // Method to save a diary
  saveDiary: async (data, accessToken) => {
    try {
      const response = await axios.post(`${URL}/save`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error saving diary:", error.response?.data || error.message || error);
      throw new Error(error.response?.data.message || "Error saving diary");
    }
  },

  // Method to delete a diary
  deleteDiary: async (date, accessToken) => {
    try {
      // Format date to YYYY-MM-DD if necessary
      const formattedDate = new Date(date).toISOString().split('T')[0]; // '2024-12-21'
      const response = await axios.delete(`${URL}/delete/${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting diary:", error.response?.data || error.message || error);
      throw new Error(error.response?.data.message || "Error deleting diary");
    }
  },
};

export default DiaryService;

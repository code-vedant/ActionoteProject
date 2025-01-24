import axios from "axios";

const URL = import.meta.env.VITE_BASE_URL + "/diary";

const DiaryService = {
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

  getDiaryByDate: async (date, accessToken) => {
    try {
      const response = await axios.get(`${URL}/bydate/${date}`, {
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

  deleteDiary: async (date, accessToken) => {
    try {
      const response = await axios.delete(`${URL}/delete/${date}`, {
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

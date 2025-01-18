import axios from "axios";

const URL = import.meta.env.VITE_BASE_URL + "/tags";

const TagsService = {
  createTag: async (data, accessToken) => {
    try {
      const response = await axios.post(`${URL}/create`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error message:", error);
      } else {
        console.error("Error:", error.message);
      }
    }
  },

  getUserTags: async (accessToken) => {
    try {
      const response = await axios.get(`${URL}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error message:", error.response.data.message);
      } else {
        console.error("Error:", error.message);
      }
    }
  },

  getTagById: async (tagId, accessToken) => {
    
    try {
      const response = await axios.get(`${URL}/${tagId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error message:", error.response.data.message);
      } else {
        console.error("Error:", error.message);
      }
    }
  },

  updateTag: async (tagId, data, accessToken) => {
    try {
      const response = await axios.put(`${URL}/${tagId}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error message:", error.response.data.message);
      } else {
        console.error("Error:", error.message);
      }
    }
  },

  deleteTag: async (tagId, accessToken) => {
    try {
      const response = await axios.delete(`${URL}/delete/${tagId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error message:", error.response.data.message);
      } else {
        console.error("Error:", error.message);
      }
    }
  },
};

export default TagsService;

import axios from "axios";

const URL = import.meta.env.VITE_BASE_URL + "/notes";

const handleApiError = (error) => {
  if (error.response) {
    // If there's a response from the server
    const errorMessage = error.response.data?.message || "An error occurred";
    console.error("Error from backend:", errorMessage);
    throw new Error(errorMessage);
  } else if (error.request) {
    // If no response was received
    console.error("No response received:", error.request);
    throw new Error("No response from server");
  } else {
    // Any other errors
    console.error("Request setup error:", error.message);
    throw new Error(error.message);
  }
};

const NotesService = {
  async getAllNotes(accessToken) {
    try {
      const response = await axios.get(`${URL}/user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("response: ", response.data);
      
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async saveNote(note, accessToken) {
    try {
      const response = await axios.post(`${URL}/save`, note, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async updateNote(noteId, updatedNote, accessToken) {
    try {
      const response = await axios.put(`${URL}/update/${noteId}`, updatedNote, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async deleteNote(noteId, accessToken) {
    try {
      const response = await axios.delete(`${URL}/delete/${noteId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async getNoteById(noteId, accessToken) {
    try {
      const response = await axios.get(`${URL}/${noteId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default NotesService;

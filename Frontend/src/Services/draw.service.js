import axios from "axios";

const URL = import.meta.env.VITE_BASE_URL + "/draw";

const DrawService = {
    // Method to save or update a drawing
    saveDrawing: async (data,accessToken) => {
        try {
            const response = await axios.post(`${URL}/save`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error("Error saving drawing: " + error.message);
        }
    },
    // Method to retrieve a drawing by ID
    getDrawingById: async (id, accessToken) => {
        try {
            const response = await axios.get(`${URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error("Error retrieving drawing: " + error.message);
        }
    },
    // Method to delete a drawing by ID
    deleteDrawingById: async (id, accessToken) => {
        try {
            const response = await axios.delete(`${URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error("Error deleting drawing: " + error.message);
        }
    },
    // Method to retrieve all drawings for a user
    getDrawingsForUser: async (userId, accessToken) => {
        try {
            const response = await axios.get(`${URL}/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error("Error retrieving drawings: " + error.message);
        }
    },
}

export default DrawService;
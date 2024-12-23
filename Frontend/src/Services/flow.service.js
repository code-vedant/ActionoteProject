import axios from "axios";

const URL = `${import.meta.env.VITE_BASE_URL}/flow`;  // Ensure the URL is correct for your environment

const FlowService = {
  // Method to fetch all flows
  fetchFlows: async (accessToken) => {
    try {
      const response = await axios.get(`${URL}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error fetching flows: " + error.message);
    }
  },

  // Method to save a new flow
  saveFlow: async (data, accessToken) => {
    try {
      const response = await axios.post(`${URL}/save`, data, {
        headers: {
          "Content-Type": "multipart/form-data",  // Set appropriate content type
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error saving flow: " + error.message);
    }
  },

  // Method to edit flow details
  editFlowDetails: async (flowId, data, accessToken) => {
    try {
      const response = await axios.post(`${URL}/edit/${flowId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",  // Set appropriate content type
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error editing flow details: " + error.message);
    }
  },

  // Method to delete a flow by ID
  deleteFlowById: async (id, accessToken) => {
    try {
      const response = await axios.delete(`${URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error deleting flow: " + error.message);
    }
  },

  // Method to retrieve a flow by ID
  fetchFlowById: async (id, accessToken) => {
    try {
      const response = await axios.get(`${URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error fetching flow by ID: " + error.message);
    }
  },

  // Method to retrieve all flow steps by flow ID
  fetchFlowSteps: async (flowId, accessToken) => {
    try {
      const response = await axios.get(`${URL}/steps/${flowId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error fetching flow steps: " + error.message);
    }
  },
};

export default FlowService;

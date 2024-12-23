import axios from "axios";

const URL = `${import.meta.env.VITE_BASE_URL}/monthly`;

const MonthlyGoalService = {
  /**
   * Add a new monthly goal.
   */
  addGoal: async (data, accessToken) => {
    try {
      const response = await axios.post(`${URL}/add`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding goal:", error);
      throw error;
    }
  },

  /**
   * Get all goals for a specific month.
   */
  getGoalsByMonth: async (month, accessToken) => {
    try {
      const response = await axios.get(`${URL}/by-month`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { month },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching goals:", error);
      throw error;
    }
  },

  /**
   * Update an existing monthly goal.
   */
  updateGoal: async (id, updates, accessToken) => {
    try {
      const response = await axios.put(`${URL}/update/${id}`, updates, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating goal:", error);
      throw error;
    }
  },

  /**
   * Delete a monthly goal.
   */
  deleteGoal: async (id, accessToken) => {
    try {
      const response = await axios.delete(`${URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting goal:", error);
      throw error;
    }
  },
};

export default MonthlyGoalService;
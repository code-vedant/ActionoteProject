import axios from "axios";

const URL = `${import.meta.env.VITE_BASE_URL}/todo`;

const TodoService = {
  getTodosByDate: async (date, accessToken) => {
    try {
      const response = await axios.get(`${URL}/by-date`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { date },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching todos by date:", error);
      throw error;
    }
  },
  createTodo: async (data, accessToken) => {
    console.log(accessToken);
    
    try {
      const response = await axios.post(`${URL}/add`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  },
  updateTodoStatus: async (id, data, accessToken) => {
    try {
      const response = await axios.patch(`${URL}/status/${id}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating todo status:", error);
      throw error;
    }
  },
  editTodo: async (id, data, accessToken) => {
    try {
      const response = await axios.put(`${URL}/edit/${id}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error editing todo:", error);
      throw error;
    }
  },
  deleteTodo: async (id, accessToken) => {
    try {
      const response = await axios.delete(`${URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  },
  getTodoById: async (id, accessToken) => {
    try {
      const response = await axios.get(`${URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching todo by ID:", error);
      throw error;
    }
  },
};

export default TodoService;

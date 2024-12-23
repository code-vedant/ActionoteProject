import axios from "axios";

const URL = import.meta.env.VITE_BASE_URL + "/user";

const AuthService = {
  signup: async (data) => {
    try {
      const response = await axios.post(`${URL}/register`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
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
  login: async ({email,password}) => {
    try {
      console.log(email, password);

      const response = await axios.post(`${URL}/login`, {email,password});
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error message:", error.response.data.message);
      } else {
        console.error("Error:", error.message);
      }
    }
  },
  logout: async (accessToken) => {
    try {
      const response = await axios.post(
        `${URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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

export default AuthService;

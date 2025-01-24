import axios from 'axios';

const URL = import.meta.env.VITE_BASE_URL +  "/pomodoro";

const PomodoService = {
  async createPomodoSession(data,accessToken) {
    try {
      const response = await axios.post(`${URL}/`,data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("response: ", response.data);
      
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
}

export {PomodoService}

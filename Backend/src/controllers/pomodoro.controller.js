import Pomodoro from '../models/pomodoro.models.js';

// Create a new Pomodoro session
export const createPomodoro = async (req, res) => {
  try {
    const { title, description, duration, shortBreak, longBreak, cycles } = req.body;
    const newPomodoro = new Pomodoro({
      user : req.user._id,
      title,
      description,
      duration,
      shortBreak,
      longBreak,
      cycles
    });
    const savedPomodoro = await newPomodoro.save();
    res.status(201).json(savedPomodoro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

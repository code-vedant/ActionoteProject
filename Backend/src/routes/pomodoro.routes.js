import express from 'express';
import { createPomodoro } from '../controllers/pomodoro.controller.js';

const router = express.Router();

// Route to create a new Pomodoro session
router.post('/', createPomodoro);

export default router;

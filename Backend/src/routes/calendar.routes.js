import { Router } from "express";
import {
  saveCalendarEvent,
  getUserCalendarEvents,
} from "../controllers/calendar.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Route to get all calendar events for the logged-in user
router.route("/").get(verifyJWT, getUserCalendarEvents);

// Route to save or update a calendar event
router.route("/").post(verifyJWT, saveCalendarEvent);

export default router;
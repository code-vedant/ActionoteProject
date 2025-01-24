import { Router } from "express";
import {
  saveCalendarEvent,
  getUserCalendarEvents,
  editCalendarEvent,
  deleteCalendarEvent,
} from "../controllers/calendar.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getUserCalendarEvents)
  .post(saveCalendarEvent); 

router
  .route("/:id")
  .put(editCalendarEvent)   
  .delete(deleteCalendarEvent);

export default router;

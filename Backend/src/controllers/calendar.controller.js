import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import CalendarEvent from "../models/calendar.models.js";

// Save a calendar event
const saveCalendarEvent = asyncHandler(async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, allDay, recurrence, recurrenceEndDate, color, reminder, status } = req.body;
    const userId = req.user._id; // Assuming the userId is available through authentication middleware.

    const newEvent = new CalendarEvent({
      title,
      description,
      startDate,
      endDate,
      userId,
      location,
      allDay,
      recurrence,
      recurrenceEndDate,
      color,
      reminder,
      status,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(new ApiResponse(201, savedEvent, "Event saved successfully."));
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json(new ApiError(500, "Failed to save event"));
  }
});

// Get all Calendar Events for a user
const getUserCalendarEvents = asyncHandler(async (req, res) => {
  const calendarEvents = await CalendarEvent.find({ userId: req.user._id }).sort({ startDate: 1 });

  return res.status(200).json(new ApiResponse(200, calendarEvents, "Calendar events retrieved successfully."));
});

export { saveCalendarEvent, getUserCalendarEvents };
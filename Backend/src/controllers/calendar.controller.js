import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import CalendarEvent from "../models/calendar.models.js";
import Todo from "../models/todo.models.js";

// Save or Update Calendar Event (and link with Todo)
const saveCalendarEvent = asyncHandler(async (req, res) => {
  const { eventId, title, description, startDate, endDate, location, allDay, recurrence, recurrenceEndDate, color, reminder, status } = req.body;

  if (!title || !startDate) {
    throw new ApiError(400, "Title and start date are required.");
  }

  let calendarEvent;

  if (eventId) {
    // Update existing event
    calendarEvent = await CalendarEvent.findByIdAndUpdate(
      eventId,
      { title, description, startDate, endDate, location, allDay, recurrence, recurrenceEndDate, color, reminder, status },
      { new: true, runValidators: true }
    );

    if (!calendarEvent) {
      throw new ApiError(404, "Calendar event not found.");
    }

    // Update linked Todo item
    await Todo.findOneAndUpdate(
      { _id: calendarEvent.todo },
      { title, description, dueDate: startDate }
    );
  } else {
    // Create a new calendar event
    calendarEvent = await CalendarEvent.create({
      title,
      description,
      startDate,
      endDate,
      location,
      allDay,
      recurrence,
      recurrenceEndDate,
      color,
      reminder,
      status,
      userId: req.user._id,
    });

    // Create a linked Todo item
    const todo = await Todo.create({
      title,
      description,
      dueDate: startDate,
      userId: req.user._id,
      calendarEvent: calendarEvent._id, // Link back to the calendar event
    });

    // Update the calendar event with the linked Todo ID
    calendarEvent.todo = todo._id;
    await calendarEvent.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, calendarEvent, "Calendar event saved successfully."));
});

// Get all Calendar Events for a user

const getUserCalendarEvents = asyncHandler(async (req, res) => {
  const calendarEvents = await CalendarEvent.find({ userId: req.user._id }).sort({ startDate: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, calendarEvents, "Calendar events retrieved successfully."));
});

export { saveCalendarEvent, getUserCalendarEvents };

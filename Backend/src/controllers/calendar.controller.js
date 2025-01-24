import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import CalendarEvent from "../models/calendar.models.js";

const saveCalendarEvent = asyncHandler(async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const userId = req.user._id;

    const newEvent = new CalendarEvent({
      title,
      description,
      startDate,
      endDate,
      userId,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(new ApiResponse(201, savedEvent, "Event saved successfully."));
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json(new ApiError(500, "Failed to save event"));
  }
});

const getUserCalendarEvents = asyncHandler(async (req, res) => {
  const calendarEvents = await CalendarEvent.find({ userId: req.user._id }).sort({ startDate: 1 });

  res.status(200).json(new ApiResponse(200, calendarEvents, "Calendar events retrieved successfully."));
});

const editCalendarEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate } = req.body;

  const updatedEvent = await CalendarEvent.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { title, description, startDate, endDate },
    { new: true, runValidators: true }
  );

  if (!updatedEvent) {
    throw new ApiError(404, "Event not found or you're not authorized to edit it.");
  }

  res.status(200).json(new ApiResponse(200, updatedEvent, "Event updated successfully."));
});

const deleteCalendarEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedEvent = await CalendarEvent.findOneAndDelete({ _id: id, userId: req.user._id });

  if (!deletedEvent) {
    throw new ApiError(404, "Event not found or you're not authorized to delete it.");
  }

  res.status(200).json(new ApiResponse(200, deletedEvent, "Event deleted successfully."));
});

export {
  saveCalendarEvent,
  getUserCalendarEvents,
  editCalendarEvent,
  deleteCalendarEvent,
};

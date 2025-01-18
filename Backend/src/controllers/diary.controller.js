import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Diary from "../models/diary.models.js";
import moment from 'moment-timezone';

// Helper to parse and convert date to UTC midnight in Asia/Kolkata
const parseDateInIST = (dateString) => {
  const istDate = moment.tz(dateString, 'YYYY-MM-DD', 'Asia/Kolkata').startOf('day').toDate(); // Midnight in IST
  return istDate;
};

// Save or update diary entry
const saveDiaryEntry = asyncHandler(async (req, res) => {
  const { date, entry } = req.body;

  if (!date) {
    throw new ApiError(400, "Date is required.");
  }

  // Convert the date to UTC midnight in Asia/Kolkata timezone
  const parsedDate = parseDateInIST(date);

  let diaryEntry = await Diary.findOne({ date: parsedDate, owner: req.user._id });

  if (diaryEntry) {
    diaryEntry.entry = entry || "";
    diaryEntry.updatedAt = new Date();
    await diaryEntry.save();
    return res
      .status(200)
      .json(new ApiResponse(200, diaryEntry, "Diary entry updated successfully."));
  } else {
    diaryEntry = await Diary.create({
      date: parsedDate,
      entry: entry || "",
      owner: req.user._id,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, diaryEntry, "Diary entry created successfully."));
  }
});

// Get diary entry by date
const getDiaryEntryByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;

  if (!date) {
    throw new ApiError(400, "Date is required.");
  }

  // Convert the date to UTC midnight in Asia/Kolkata timezone
  const parsedDate = parseDateInIST(date);

  const diaryEntry = await Diary.findOne({
    date: parsedDate,
    owner: req.user._id,
  });

  if (!diaryEntry) {
    return res
      .status(200)
      .json(new ApiResponse(200, { entry: "" }, "No entry found for this date."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, diaryEntry, "Diary entry retrieved successfully."));
});

// Delete diary entry by date
const deleteDiaryEntryByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;

  if (!date) {
    throw new ApiError(400, "Date is required.");
  }

  // Convert the date to UTC midnight in Asia/Kolkata timezone
  const parsedDate = parseDateInIST(date);

  const diaryEntry = await Diary.findOneAndDelete({
    date: parsedDate,
    owner: req.user._id,
  });

  if (!diaryEntry) {
    throw new ApiError(404, "No entry found for this date.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Diary entry deleted successfully."));
});

// Get today's diary entry
const getTodaysEntry = asyncHandler(async (req, res) => {
  const today = new Date();
  const istToday = moment.tz(today, 'Asia/Kolkata').startOf('day').toDate(); // Midnight in IST

  const diaryEntry = await Diary.findOne({
    owner: req.user._id,
    date: istToday,
  });

  if (!diaryEntry) {
    return res
      .status(200)
      .json(new ApiResponse(200, { entry: "" }, "No entry found for today."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, diaryEntry, "Today's diary entry retrieved successfully."));
});

// Get all diary entries except today
const getUserDiaryEntriesExceptToday = asyncHandler(async (req, res) => {
  const today = new Date();
  const istToday = moment.tz(today, 'Asia/Kolkata').startOf('day').toDate(); // Midnight in IST

  const diaryEntries = await Diary.find({
    owner: req.user._id,
    date: { $ne: istToday }, // Exclude today's date
  }).sort({ date: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, diaryEntries, "All diary entries except today's retrieved successfully."));
});

export {
  saveDiaryEntry,
  getDiaryEntryByDate,
  deleteDiaryEntryByDate,
  getTodaysEntry,
  getUserDiaryEntriesExceptToday,
};
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Diary from "../models/diary.models.js";

const saveDiaryEntry = asyncHandler(async (req, res) => {
  const { date, entry } = req.body;

  if (!date) {
    throw new ApiError(400, "Date is required.");
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj)) {
    throw new ApiError(400, "Invalid date format.");
  }

  dateObj.setHours(0, 0, 0, 0);

  let diaryEntry = await Diary.findOne({ date: dateObj, owner: req.user._id });

  if (diaryEntry) {
    diaryEntry.entry = entry || "";
    diaryEntry.updatedAt = new Date();
    await diaryEntry.save();
    return res
      .status(200)
      .json(new ApiResponse(200, diaryEntry, "Diary entry updated successfully."));
  } else {
    diaryEntry = await Diary.create({
      date: dateObj,
      entry: entry || "",
      owner: req.user._id,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, diaryEntry, "Diary entry created successfully."));
  }
});

const getDiaryEntryByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;

  if (!date) {
    throw new ApiError(400, "Date is required.");
  }

  // Parse date without time component for accurate matching
  const dateStart = new Date(date);
  const dateEnd = new Date(date);
  dateEnd.setHours(23, 59, 59, 999); // End of the day

  if (isNaN(dateStart)) {
    throw new ApiError(400, "Invalid date format. Please use 'YYYY-MM-DD'.");
  }

  const diaryEntry = await Diary.findOne({
    date: { $gte: dateStart, $lte: dateEnd },
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

const deleteDiaryEntryByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;

  if (!date) {
    throw new ApiError(400, "Date is required.");
  }

  // Parse date without time component for accurate matching
  const dateStart = new Date(date);
  const dateEnd = new Date(date);
  dateEnd.setHours(23, 59, 59, 999); // End of the day

  if (isNaN(dateStart)) {
    throw new ApiError(400, "Invalid date format. Please use 'YYYY-MM-DD'.");
  }

  const diaryEntry = await Diary.findOneAndDelete({
    date: { $gte: dateStart, $lte: dateEnd },
    owner: req.user._id,
  });

  if (!diaryEntry) {
    throw new ApiError(404, "No entry found for this date.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Diary entry deleted successfully."));
});

const getTodaysEntry = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diaryEntry = await Diary.findOne({
    owner: req.user._id,
    date: today,
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

const getUserDiaryEntries = asyncHandler(async (req, res) => {
  const diaryEntries = await Diary.find({ owner: req.user._id }).sort({ date: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, diaryEntries, "All diary entries retrieved successfully."));
});

const getAllExceptToday = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diaryEntries = await Diary.find({
    owner: req.user._id,
    date: { $ne: today },
  }).sort({ date: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, diaryEntries, "All diary entries except today's retrieved successfully."));
});

export { saveDiaryEntry, getDiaryEntryByDate, deleteDiaryEntryByDate, getTodaysEntry, getUserDiaryEntries, getAllExceptToday };
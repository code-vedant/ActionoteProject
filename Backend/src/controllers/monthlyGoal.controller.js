import MonthlyGoal from "../models/monthlyGoal.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addMonthlyGoal = asyncHandler(async (req, res) => {
  const { title, description, status, month, priority, tags } = req.body;

  if (!title || !month) {
    throw new ApiError(400, "Title and month are required.");
  }

  const goal = await MonthlyGoal.create({
    owner: req.user._id,
    title,
    description,
    status,
    month,
    priority,
    tags,
  });

  return res.status(201).json(new ApiResponse(200, goal, "Monthly goal added successfully."));
});

export const getGoalsByMonth = asyncHandler(async (req, res) => {
  const { month } = req.query;

  if (!month) {
    throw new ApiError(400, "Month query parameter is required.");
  }

  const goals = await MonthlyGoal.find({
    owner: req.user._id,
    month,
  });

  return res.status(200).json(new ApiResponse(200, goals, "Monthly goals retrieved successfully."));
});

export const updateMonthlyGoal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const goal = await MonthlyGoal.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    updates,
    { new: true }
  );

  if (!goal) {
    throw new ApiError(404, "Monthly goal not found.");
  }

  return res.status(200).json(new ApiResponse(200, goal, "Monthly goal updated successfully."));
});

export const deleteMonthlyGoal = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const goal = await MonthlyGoal.findOneAndDelete({
    _id: id,
    owner: req.user._id,
  });

  if (!goal) {
    throw new ApiError(404, "Monthly goal not found.");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Monthly goal deleted successfully."));
});

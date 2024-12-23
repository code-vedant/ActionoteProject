import MonthlyGoal from "../models/monthlyGoal.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Add a new monthly goal.
 */
export const addMonthlyGoal = asyncHandler(async (req, res) => {
  const { title, description, status, month, priority } = req.body;

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
  });

  res.status(201).json({
    success: true,
    data: goal,
    message: "Monthly goal added successfully.",
  });
});

/**
 * Get all monthly goals for a specific month.
 */
export const getGoalsByMonth = asyncHandler(async (req, res) => {
  const { month } = req.query;

  if (!month) {
    throw new ApiError(400, "Month query parameter is required.");
  }

  const goals = await MonthlyGoal.find({
    owner: req.user._id,
    month,
  });

  res.status(200).json({
    success: true,
    data: goals,
  });
});

/**
 * Update a monthly goal.
 */
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

  res.status(200).json({
    success: true,
    data: goal,
    message: "Monthly goal updated successfully.",
  });
});

/**
 * Delete a monthly goal.
 */
export const deleteMonthlyGoal = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const goal = await MonthlyGoal.findOneAndDelete({
    _id: id,
    owner: req.user._id,
  });

  if (!goal) {
    throw new ApiError(404, "Monthly goal not found.");
  }

  res.status(200).json({
    success: true,
    message: "Monthly goal deleted successfully.",
  });
});

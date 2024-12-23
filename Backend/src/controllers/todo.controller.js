import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Todo from "../models/todo.models.js";

// Add a new To-Do
const addTodo = asyncHandler(async (req, res) => {
  const { content, priority, dueDate, tags, description, recurring } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required to create a To-Do.");
  }

  const todo = await Todo.create({
    owner: req.user._id,
    content,
    priority,
    dueDate,
    tags,
    description,
    recurring,
    status: false, // Defaults to "pending"
  });

  res
    .status(201)
    .json(new ApiResponse(201, todo, "To-Do created successfully."));
});

// Get all To-Dos by date
const getTodosByDate = asyncHandler(async (req, res) => {
  // Fetch the date query parameter
  const { date } = req.query;

  if (!date) {
    throw new ApiError(400, "Date query parameter is required.");
  }

  // Parse the date and define the start and end of the day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Find todos that belong to the logged-in user and match the date range
  const todos = await Todo.find({
    owner: req.user._id,
    dueDate: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ dueDate: 1 }); // Sorting by dueDate if needed

  // Group todos by their due date
  const groupedTodos = todos.reduce((grouped, todo) => {
    const todoDate = todo.dueDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    if (!grouped[todoDate]) {
      grouped[todoDate] = [];
    }
    grouped[todoDate].push(todo);
    return grouped;
  }, {});

  // Return grouped todos by date
  res.status(200).json(new ApiResponse(200, groupedTodos, "To-Dos retrieved successfully."));
});

// Update To-Do status
const updateTodoStatus = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { status } = req.body;

  if (typeof status !== "boolean") {
    throw new ApiError(400, "Invalid status provided. Expected a boolean.");
  }

  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: todoId, owner: req.user._id },
    {
      status,
      completedAt: status ? new Date() : null, // Set completedAt only if status is true
    },
    { new: true }
  );

  if (!updatedTodo) {
    throw new ApiError(404, "To-Do not found.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedTodo, "To-Do status updated."));
});

// Edit a To-Do
const editTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { content, priority, dueDate, tags, description, recurring, status } = req.body;

  if (status !== undefined && typeof status !== "boolean") {
    throw new ApiError(400, "Invalid status provided. Expected a boolean.");
  }

  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: todoId, owner: req.user._id },
    {
      content,
      priority,
      dueDate,
      tags,
      description,
      recurring,
      status,
      completedAt: status ? new Date() : null, // Update completedAt if status changes
    },
    { new: true }
  );

  if (!updatedTodo) {
    throw new ApiError(404, "To-Do not found.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedTodo, "To-Do updated successfully."));
});

// Delete a To-Do
const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  const deletedTodo = await Todo.findOneAndDelete({
    _id: todoId,
    owner: req.user._id,
  });

  if (!deletedTodo) {
    throw new ApiError(404, "To-Do not found.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedTodo, "To-Do deleted successfully."));
});

export { addTodo, getTodosByDate, updateTodoStatus, editTodo, deleteTodo };
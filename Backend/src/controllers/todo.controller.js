import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Todo from "../models/todo.models.js";

const addTodo = asyncHandler(async (req, res) => {
  const { content, priority, dueDate, tags, description } = req.body;

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
    status: false,
  });

  res
    .status(201)
    .json(new ApiResponse(201, todo, "To-Do created successfully."));
});

const getTodosByDate = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    throw new ApiError(400, "Date query parameter is required.");
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const todos = await Todo.find({
    owner: req.user._id,
    dueDate: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ dueDate: 1 });

  const groupedTodos = todos.reduce((grouped, todo) => {
    const todoDate = todo.dueDate.toISOString().split('T')[0];
    if (!grouped[todoDate]) {
      grouped[todoDate] = [];
    }
    grouped[todoDate].push(todo);
    return grouped;
  }, {});

  res.status(200).json(new ApiResponse(200, groupedTodos, "To-Dos retrieved successfully."));
});

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
      completedAt: status ? new Date() : null,
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

const editTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { content, priority, dueDate, tags, description, status } = req.body;

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
      status,
      completedAt: status ? new Date() : null,
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
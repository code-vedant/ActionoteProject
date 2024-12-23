import { Router } from "express";
import {
  addTodo,
  getTodosByDate,
  updateTodoStatus,
  editTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Route to add a new to-do
router.post("/add", verifyJWT, addTodo);

// Route to get all to-dos for a specific date
router.get("/by-date", verifyJWT, getTodosByDate);

// Route to update the status of a specific to-do
router.patch("/status/:todoId", verifyJWT, updateTodoStatus);

// Route to edit a specific to-do
router.put("/edit/:todoId", verifyJWT, editTodo);

// Route to delete a specific to-do
router.delete("/delete/:todoId", verifyJWT, deleteTodo);

export default router;

import { Router } from "express";
import {
  addMonthlyGoal,
  getGoalsByMonth,
  updateMonthlyGoal,
  deleteMonthlyGoal,
} from "../controllers/monthlyGoal.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Route to add a new monthly goal
router.post("/add", verifyJWT, addMonthlyGoal);

// Route to get goals for a specific month
router.get("/by-month", verifyJWT, getGoalsByMonth);

// Route to update a monthly goal
router.put("/update/:id", verifyJWT, updateMonthlyGoal);

// Route to delete a monthly goal
router.delete("/delete/:id", verifyJWT, deleteMonthlyGoal);

export default router;

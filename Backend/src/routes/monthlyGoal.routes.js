import { Router } from "express";
import {
  addMonthlyGoal,
  getGoalsByMonth,
  updateMonthlyGoal,
  deleteMonthlyGoal,
} from "../controllers/monthlyGoal.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/add", verifyJWT, addMonthlyGoal);
router.get("/by-month", verifyJWT, getGoalsByMonth);
router.put("/update/:id", verifyJWT, updateMonthlyGoal);
router.delete("/delete/:id", verifyJWT, deleteMonthlyGoal);

export default router;

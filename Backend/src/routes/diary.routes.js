import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    saveDiaryEntry, getDiaryEntryByDate, deleteDiaryEntryByDate, getTodaysEntry, getUserDiaryEntriesExceptToday
} from "../controllers/diary.controller.js";

const diaryRouter = Router();

diaryRouter.route("/save").post(verifyJWT, saveDiaryEntry);

diaryRouter.route("/bydate/:date").get(verifyJWT, getDiaryEntryByDate);

diaryRouter.route("/delete/:date").delete(verifyJWT, deleteDiaryEntryByDate);

diaryRouter.route("/today").get(verifyJWT, getTodaysEntry);

diaryRouter.route("/user").get(verifyJWT, getUserDiaryEntriesExceptToday); 

export default diaryRouter;

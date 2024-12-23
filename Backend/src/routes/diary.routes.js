import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    saveDiaryEntry,
    getDiaryEntryByDate,
    deleteDiaryEntryByDate,
    getUserDiaryEntries,
    getAllExceptToday,
    getTodaysEntry
} from "../controllers/diary.controller.js";

const diaryRouter = Router();

diaryRouter.route("/save").post(verifyJWT, saveDiaryEntry);

diaryRouter.route("/bydate/:date").get(verifyJWT, getDiaryEntryByDate);

diaryRouter.route("/delete/:date").delete(verifyJWT, deleteDiaryEntryByDate);

diaryRouter.route("/today").get(verifyJWT, getTodaysEntry);

diaryRouter.route("/userall").get(verifyJWT, getUserDiaryEntries);

diaryRouter.route("/user").get(verifyJWT, getAllExceptToday); 

export default diaryRouter;

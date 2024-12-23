import { saveDrawing, getUserDrawings, getDrawingById, deleteDrawing } from '../controllers/draw.controller.js'
import { Router } from 'express'
import {verifyJWT} from '../middlewares/auth.middlewares.js'
import { upload } from '../middlewares/multer.middlewares.js'

const router = Router()
// Route to save or update a drawing
router.post("/save", verifyJWT, upload.none(), saveDrawing);

// Route to get all drawings for the authenticated user
router.get("/user", verifyJWT, getUserDrawings);

// Route to get a specific drawing by ID
router.get("/:drawId", verifyJWT, getDrawingById);

// Route to delete a specific drawing
router.delete("/:drawId", verifyJWT, deleteDrawing);

export default router;

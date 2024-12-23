import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createNote, getUserNotes, getNoteById, updateNote, deleteNote } from "../controllers/notes.controller.js";

const notesRouter = Router();

// Route to create a note
notesRouter.route("/save").post(verifyJWT, createNote);

// Route to  update a note
notesRouter.route("/update/:noteId").post(verifyJWT, updateNote);

// Route to delete a specific note by ID
notesRouter.route("/delete/:noteId").delete(verifyJWT, deleteNote);

// Route to get all notes for the authenticated user
notesRouter.route("/user").get(verifyJWT, getUserNotes);

// Route to get a specific note by ID
notesRouter.route("/:noteId").get(verifyJWT, getNoteById);

export default notesRouter;
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Note from "../models/notes.models.js"; // Replace with the path to your Notes model

// Create a new note
const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required.");
  }

  const note = await Note.create({
    title,
    content,
    tags: tags || [], // Store the tags, defaulting to an empty array
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully."));
});

// Update a note by ID
const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { title, content, tags } = req.body;

  const note = await Note.findById(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found.");
  }

  if (!note.owner.equals(req.user._id)) {
    throw new ApiError(403, "You do not have permission to update this note.");
  }

  if (title) note.title = title;
  if (content) note.content = content;
  if (tags !== undefined) note.tags = tags; // Update tags if provided

  await note.save();

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note updated successfully."));
});

// Get a specific note by ID
const getNoteById = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found.");
  }

  if (!note.owner.equals(req.user._id)) {
    throw new ApiError(403, "You do not have permission to view this note.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note retrieved successfully."));
});

// Delete a note by ID
const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found.");
  }

  if (!note.owner.equals(req.user._id)) {
    throw new ApiError(403, "You do not have permission to delete this note.");
  }

  await note.remove();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Note deleted successfully."));
});

// Get all notes for a user, optionally filtering by tags
const getUserNotes = asyncHandler(async (req, res) => {
  const { tag } = req.query;  // Optional tag filter

  const filter = { owner: req.user._id };

  if (tag) {
    filter.tags = tag;  // Filter by tag if provided
  }

  const notes = await Note.find(filter).sort({ updatedAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "User notes retrieved successfully."));
});


export { createNote, getUserNotes, getNoteById, updateNote, deleteNote };

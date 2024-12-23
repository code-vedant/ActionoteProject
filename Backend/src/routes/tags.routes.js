import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createTag,
  getUserTags,
  getTagById,
  updateTag,
  deleteTag,
} from "../controllers/tags.controller.js";

const router = Router();

// Create a new tag
router.post("/create", verifyJWT, createTag);

// Get all tags for the authenticated user
router.get("/user", verifyJWT, getUserTags);

// Get a single tag by ID
router.get("/:tagId", verifyJWT, getTagById);

// Update a tag
router.put("/:tagId", verifyJWT, updateTag);

// Delete a tag
router.delete("/:tagId", verifyJWT, deleteTag);

export default router;

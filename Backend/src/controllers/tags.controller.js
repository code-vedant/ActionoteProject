import Tag from "../models/tags.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new tag
const createTag = asyncHandler(async (req, res) => {
  const { name, description, color } = req.body;

  if (!name) {
    throw new ApiError(400, "Tag name is required.");
  }

  const existingTag = await Tag.findOne({ userId: req.user._id, name });
  if (existingTag) {
    throw new ApiError(400, "A tag with this name already exists.");
  }

  const tag = await Tag.create({
    name,
    description,
    color,
    userId: req.user._id,
  });

  return res.status(201).json(new ApiResponse(201, tag, "Tag created successfully."));
});

// Get all tags for the authenticated user
const getUserTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find({ userId: req.user._id }).sort({ usageCount: -1 });

  return res.status(200).json(new ApiResponse(200, tags, "Tags retrieved successfully."));
});

// Get a single tag by ID
const getTagById = asyncHandler(async (req, res) => {
  const { tagId } = req.params;

  const tag = await Tag.findOne({ _id: tagId, userId: req.user._id });
  if (!tag) {
    throw new ApiError(404, "Tag not found.");
  }

  return res.status(200).json(new ApiResponse(200, tag, "Tag retrieved successfully."));
});

// Update a tag
const updateTag = asyncHandler(async (req, res) => {
  const { tagId } = req.params;
  const { name, description, color } = req.body;

  const tag = await Tag.findOneAndUpdate(
    { _id: tagId, userId: req.user._id },
    { name, description, color },
    { new: true, runValidators: true }
  );

  if (!tag) {
    throw new ApiError(404, "Tag not found or you're not authorized.");
  }

  return res.status(200).json(new ApiResponse(200, tag, "Tag updated successfully."));
});

// Delete a tag
const deleteTag = asyncHandler(async (req, res) => {
  const { tagId } = req.params;

  const tag = await Tag.findOneAndDelete({ _id: tagId, userId: req.user._id });
  if (!tag) {
    throw new ApiError(404, "Tag not found or you're not authorized.");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Tag deleted successfully."));
});

export { createTag, getUserTags, getTagById, updateTag, deleteTag };

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Draw from "../models/draw.models.js";

// Helper function to process base64 drawing
const processBase64Drawing = (drawing) => {
  if (!drawing.startsWith("data:image")) {
    throw new ApiError(400, "Invalid drawing format.");
  }

  const matches = drawing.match(/^data:image\/([a-zA-Z]*);base64,([^"]*)/);
  if (!matches || matches.length !== 3) {
    throw new ApiError(400, "Invalid base64 image format.");
  }

  const imageData = matches[2];
  return Buffer.from(imageData, "base64");
};

// Save a new drawing
const saveDrawing = asyncHandler(async (req, res) => {
  const { drawing } = req.body;

  if (!drawing) {
    throw new ApiError(400, "Drawing is required.");
  }

  const imageBuffer = processBase64Drawing(drawing);

  const newDrawing = await Draw.create({
    drawing: imageBuffer.toString("base64"), // Save base64 string
    creator: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newDrawing, "Drawing created successfully."));
});

// Update an existing drawing
const updateDrawing = asyncHandler(async (req, res) => {
  const { drawId, drawing } = req.body;

  if (!drawId) {
    throw new ApiError(400, "Drawing ID is required for updating.");
  }

  if (!drawing) {
    throw new ApiError(400, "Drawing is required.");
  }

  const updateData = { updatedAt: new Date() };
  updateData.drawing = processBase64Drawing(drawing).toString("base64");

  const updatedDrawing = await Draw.findByIdAndUpdate(drawId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedDrawing) {
    throw new ApiError(404, "Drawing not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedDrawing, "Drawing updated successfully."));
});

// Get all drawings for a user
const getUserDrawings = asyncHandler(async (req, res) => {
  const drawings = await Draw.find({ creator: req.user._id }).sort({
    updatedAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, drawings, "User drawings retrieved successfully."));
});

// Get a specific drawing by ID
const getDrawingById = asyncHandler(async (req, res) => {
  const { drawId } = req.params;

  const drawing = await Draw.findById(drawId);
  if (!drawing) {
    throw new ApiError(404, "Drawing not found.");
  }

  if (!drawing.creator.equals(req.user._id)) {
    throw new ApiError(403, "You do not have permission to view this drawing.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, drawing, "Drawing retrieved successfully."));
});

// Delete a drawing
const deleteDrawing = asyncHandler(async (req, res) => {
  const { drawId } = req.params;

  const drawing = await Draw.findById(drawId);
  if (!drawing) {
    throw new ApiError(404, "Drawing not found.");
  }

  if (!drawing.creator.equals(req.user._id)) {
    throw new ApiError(403, "You do not have permission to delete this drawing.");
  }

  await drawing.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Drawing deleted successfully."));
});

export {
  saveDrawing,
  updateDrawing,
  getUserDrawings,
  getDrawingById,
  deleteDrawing,
};
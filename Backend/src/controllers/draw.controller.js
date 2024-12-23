import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Draw from "../models/draw.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Save a drawing (create or update)
const saveDrawing = asyncHandler(async (req, res) => {
  const { drawId, title, description, tags, drawing } = req.body;

  if (!title || !drawing) {
    throw new ApiError(400, "Title and drawing are required.");
  }

  let imageBuffer;

  if (drawing.startsWith("data:image")) {
    // Extract the base64 data
    const matches = drawing.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)/);

    if (matches && matches.length === 3) {
      const imageData = matches[2]; // Base64 string without the prefix
      imageBuffer = Buffer.from(imageData, 'base64');
    } else {
      throw new ApiError(400, "Invalid base64 image format.");
    }

    // Upload to Cloudinary
    try {
      const imageUrl = await uploadOnCloudinary(imageBuffer, `drawings/${title}`);
      
      let draw;
      if (drawId) {
        // Update existing drawing
        draw = await Draw.findByIdAndUpdate(
          drawId,
          {
            title,
            description,
            tags,
            drawing: imageUrl?.url || drawing,
            updatedAt: new Date(),
          },
          { new: true, runValidators: true }
        );
        if (!draw) {
          throw new ApiError(404, "Drawing not found.");
        }
      } else {
        // Create a new drawing
        draw = await Draw.create({
          title,
          description,
          tags,
          drawing: imageUrl?.url || drawing,
          creator: req.user._id,
        });
      }

      return res.status(200).json(new ApiResponse(200, draw, "Drawing saved successfully."));

    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new ApiError(500, "Error uploading drawing to Cloudinary.");
    }
  } else {
    throw new ApiError(400, "Invalid drawing format.");
  }
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

  await drawing.remove();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Drawing deleted successfully."));
});

export { saveDrawing, getUserDrawings, getDrawingById, deleteDrawing };

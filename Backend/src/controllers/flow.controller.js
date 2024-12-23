import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Flow from "../models/flow.models.js";

// Save (create or update) a flow
const saveFlow = asyncHandler(async (req, res) => {
  const { flowId, name, description, nodes, edges, tags } = req.body;

  if (!name || !nodes || !edges) {
    throw new ApiError(400, "Flow name, nodes, and edges are required.");
  }

  let flow;
  if (flowId) {
    flow = await Flow.findByIdAndUpdate(
      flowId,
      { name, description, nodes, edges, tags, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!flow) {
      throw new ApiError(404, "Flow not found.");
    }
  } else {
    flow = await Flow.create({
      name,
      description,
      nodes,
      edges,
      tags,
      creator: req.user._id,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, flow, "Flow saved successfully."));
});

// Edit flow details
const editFlowDetails = asyncHandler(async (req, res) => {
  const { flowId } = req.params;
  const { name, description, tags } = req.body;

  const flow = await Flow.findById(flowId);
  if (!flow) {
    throw new ApiError(404, "Flow not found.");
  }

  if (!flow.owner.equals(req.user._id)) {
    throw new ApiError(403, "You do not have permission to edit this flow.");
  }

  flow.name = name || flow.name;
  flow.description = description || flow.description;
  flow.tags = tags || flow.tags;
  flow.updatedAt = new Date();

  await flow.save();

  return res
    .status(200)
    .json(new ApiResponse(200, flow, "Flow details updated successfully."));
});

// Delete a flow (soft delete)
const deleteFlow = asyncHandler(async (req, res) => {
  const { flowId } = req.params;

  const flow = await Flow.findById(flowId);
  if (!flow) {
    throw new ApiError(404, "Flow not found.");
  }

  if (!flow.creator.equals(req.user._id)) {
    throw new ApiError(403, "You do not have permission to delete this flow.");
  }

  flow.deleted = true;
  await flow.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Flow deleted successfully."));
});

// Get flows for a user
const getUserFlows = asyncHandler(async (req, res) => {
  const flows = await Flow.find({
    creator: req.user._id,
    deleted: false,
  }).sort({ updatedAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, flows, "User flows retrieved successfully."));
});

// Get a flow by ID
const getFlowById = asyncHandler(async (req, res) => {
  const { flowId } = req.params;

  const flow = await Flow.findById(flowId);
  if (!flow || flow.deleted) {
    throw new ApiError(404, "Flow not found.");
  }

  if (!flow.creator.equals(req.user._id)) {
    throw new ApiError(403, "You do not have permission to view this flow.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, flow, "Flow retrieved successfully."));
});

export { saveFlow, editFlowDetails, deleteFlow, getUserFlows, getFlowById };

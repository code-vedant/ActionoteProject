import { saveFlow, editFlowDetails, deleteFlow, getUserFlows, getFlowById } from "../controllers/flow.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// Route to save or update a flow
router.route("/save").post(verifyJWT, upload.none(), saveFlow);

// Route to edit flow details
router.route("/edit/:flowId").put(verifyJWT, upload.none(), editFlowDetails);

// Route to delete a flow
router.route("/delete/:flowId").delete(verifyJWT, deleteFlow);

// Route to get all flows for the authenticated user
router.route("/user").get(verifyJWT, getUserFlows);

// Route to get a specific flow by ID
router.route("/:flowId").get(verifyJWT, getFlowById);

export default router;

import express from "express";
import {healthController} from "../controllers/health.controller.js";
import useAsync from "../utils/asyncHandler.js";
const healthRouter = express.Router();
healthRouter.get("/",useAsync( healthController));
export default healthRouter;
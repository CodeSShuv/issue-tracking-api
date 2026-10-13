import {Router} from "express";
import { createCommentController } from './../controllers/comment.controller.js';
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
const commentRouter = Router();
commentRouter.post("/:ticketId",authenticate,createCommentController);
// commentRouter.get("/all",authenticate,authorize(["ADMIN"]));
export default commentRouter ; 
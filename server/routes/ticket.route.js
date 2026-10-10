import {Router} from "express";
import {createTicketController} from "../controllers/ticket.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
const ticketRouter = Router();
ticketRouter.post("/create",authenticate, authorize(["User"]), createTicketController);
export default ticketRouter; 
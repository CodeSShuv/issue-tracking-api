import {Router} from "express";
import {createTicketController,updateTicketStatusOrPirorityController,viewAllTicketsController, viewMyTicketsController, viewTicketController} from "../controllers/ticket.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import useAsync from "../utils/asyncHandler.js";

const ticketRouter = Router();
ticketRouter.post("/create",authenticate, authorize(["USER"]),useAsync( createTicketController));
ticketRouter.get("/all", authenticate, authorize(["ADMIN"]),useAsync(viewAllTicketsController) );
ticketRouter.get("/mytickets", authenticate, authorize(["USER"]), useAsync(viewMyTicketsController));
ticketRouter.get("/:ticketId", authenticate, authorize([ "SUPPORT", "ADMIN"]), useAsync(viewTicketController));
ticketRouter.patch("/:ticketId", authenticate, authorize(['ADMIN', "SUPPORT"]), useAsync(updateTicketStatusOrPirorityController));
export default ticketRouter; 
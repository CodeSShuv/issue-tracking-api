import {Router} from "express";
import {createTicketController,updateTicketStatusOrPirorityController,viewAllTicketsController, viewMyTicketsController, viewTicketController} from "../controllers/ticket.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const ticketRouter = Router();
ticketRouter.post("/create",authenticate, authorize(["USER"]), createTicketController);
ticketRouter.get("/all", authenticate, authorize(["ADMIN"]),viewAllTicketsController );
ticketRouter.get("/mytickets", authenticate, authorize(["USER"]), viewMyTicketsController);
ticketRouter.get("/:ticketId", authenticate, authorize(["USER", "SUPPORT", "ADMIN"]), viewTicketController);
ticketRouter.get("/:ticketId", authenticate, authorize(['ADMIN', "SUPPORT"]), updateTicketStatusOrPirorityController);
export default ticketRouter; 
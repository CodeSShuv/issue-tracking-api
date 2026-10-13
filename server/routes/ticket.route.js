import {Router} from "express";
import {createTicketController,viewAllTicketsController, viewMyTicketsController} from "../controllers/ticket.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const ticketRouter = Router();
ticketRouter.post("/create",authenticate, authorize(["USER"]), createTicketController);
ticketRouter.get("/all", authenticate, authorize(["ADMIN"]),viewAllTicketsController );
ticketRouter.get("/mytickets", authenticate, authorize(["USER"]), viewMyTicketsController);
export default ticketRouter; 
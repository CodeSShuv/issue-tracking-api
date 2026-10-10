import { createTicket } from "../services/ticket.service.js";
import AppError from "../utils/appError.js";
export const createTicketController = async (req, res) => {
    const {title, description} = req.body;
    if(!title || !description){
        throw new AppError("Title and description are required", 400);
    }
    const ticket = await createTicket({title, description, userId: req.user.id});
    res.status(201).json({
        success:true,
        data:ticket
    });
}
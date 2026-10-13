import { createTicket, getAllTickets, getTicketsByUserId } from "../services/ticket.service.js";
import AppError from "../utils/appError.js";
export const createTicketController = async (req, res) => {
    const {title, description, department} = req.body;
    if(!title || !description || !department){
        throw new AppError("Title ,  description, department are required", 400);
    }
    
    const ticket = await createTicket({title, description, userId: req.user.id}, department);
    res.status(201).json({
        success:true,
        data:ticket
    });
}
export const updateMyTicketController = async(req,res)=>{
}
export const viewMyTicketsController = async(req,res)=>{
    let userId = req.user.id;
    const tickets = await getTicketsByUserId(userId);
    res.status(200).json({
        success:true,
        data:tickets
    });
}

export const viewAllTicketsController = async(req,res)=>{
    const tickets = await getAllTickets();
    res.status(200).json({
        success:true,
        data:tickets
    });
}
export const viewTicketController = async(req,res)=>{
    
}
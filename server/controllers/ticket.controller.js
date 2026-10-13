import { createTicket, getAllTickets, getTicketsByUserId, getTicketById, updateTicketStatusOrPriority } from "../services/ticket.service.js";
import AppError from "../utils/appError.js";
export const createTicketController = async (req, res) => {
    const { title, description, department } = req.body;
    if (!title || !description || !department) {
        throw new AppError("Title ,  description, department are required", 400);
    }

    const ticket = await createTicket({ title, description, userId: req.user.id }, department);
    res.status(201).json({
        success: true,
        data: ticket
    });
}
export const updateMyTicketController = async (req, res) => {
}
export const viewMyTicketsController = async (req, res) => {
    let userId = req.user.id;
    const tickets = await getTicketsByUserId(userId);
    res.status(200).json({
        success: true,
        data: tickets
    });
}

export const viewAllTicketsController = async (req, res) => {
    const tickets = await getAllTickets();
    res.status(200).json({
        success: true,
        data: tickets
    });
}
export const viewTicketController = async (req, res) => {
    const { ticketId } = req.params;
    let ticket = await getTicketById(ticketId);
    res.status(200).json({
        success: true,
        data: ticket
    });
}

export const updateTicketStatusOrPirorityController = async (req, res) => {
    const { ticketId } = req.params;
    const { status, priority } = req;
    let data = {};
    if (status === undefined && priority === undefined) throw new AppError("Status and prority cannot be undefined ", 401);
    if (status === undefined && priority) {
        data.priority = priority;
    }
    else if (status && priority) {
        data.priority = priority;
        data.status = status;
    } else {
        data.status = status;
    }

    await updateTicketStatusOrPriority(ticketId);
    res.send(201).json({
        success:true
    });
}
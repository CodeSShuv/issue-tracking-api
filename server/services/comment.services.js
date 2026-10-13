import prisma from './../lib/prisma.js';
import AppError from '../utils/appError.js';
export const createComment = async (ticketId, userId, content) => {
    let ticket = await prisma.ticket.findUnique({
        where: {
            id: ticketId
        }
    });
    if (!ticket) throw new AppError("Ticket not found", 404);
    let comment = await prisma.comment.create({
        data: {
            ticketId: ticketId,
            userId: userId,
            content: content
        }
    });
    return comment;

}
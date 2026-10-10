import prisma from "../lib/prisma.js";

export const createTicket = async (data) => {
    const ticket = await prisma.ticket.create({
        data: data,
        select: {

            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            departmentId: true,
            userId: true,
        }
    });
    return ticket;
}

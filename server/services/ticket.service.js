import prisma from "../lib/prisma.js";

export const createTicket = async (data, deparmentName) => {
    const departments = await prisma.department.findMany();
    let matchingDepartmentId = null;
    for(const department of departments){
        if(department.name.toLowerCase() === deparmentName.toLowerCase()){
                matchingDepartmentId = department.id;
                break;

        }
    }
    data.departmentId = matchingDepartmentId;
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
export const getAllTickets = async ()=>{
    const tickets = await prisma.ticket.findMany({
         select: { id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            departmentId: true,
            userId: true,}
    });
return tickets;
}
export const getTicketsByUserId = async(userId)=>{
    const tickets = await prisma.ticket.findMany({
        where:{userId:userId}
    });

  return tickets;
}

export const getTicketById = async (ticketId)=>{
    const ticket = await prisma.ticket.findUnique({
        where:{
            id: ticketId
        }
        
    });
    return ticket;
}

export const updateTicketStatusOrPriority  = async(ticketId,data)=>{
   return await prisma.ticket.update({
    where:{
        id:ticketId
    },
    data:data,
    select:{
        id:true,
        priority:true,
        status:true
    }
   });
}


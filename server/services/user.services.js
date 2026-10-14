import prisma from "../lib/prisma.js";
export const createUser = async (userData) => {
    const user = await prisma.user.create({
        data:userData,
    
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
    }});
    return user;
}
export const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            password: true
        }});
    return user;
}
export const getAllUsers = async ()=>{
    const users = await prisma.user.findMany({
        select:{
            id: true,
            name: true,
            email: true,
            role: true,
        }
    })
    return users;
}
export const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }});
    return user;
}
export const getUserByIdWithPassword = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            password: true,
        }
    });
    return user;
}
export const updateUser = async (id, userData) => {
    const user = await prisma.user.update({
        where: {
            id: id
        },
        data: userData,
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }});
    return user;
}

export const resetPassword = async(userId, newPassword)=>{
    const user = await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            password:newPassword
        }
    });
    return user;
}


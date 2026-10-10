import prisma from "../lib/prisma.js";
export const createDepartment = async (data) => {
    const department = await prisma.department.create({
        data: data,
        select: {
            id: true,
            name: true
        }
    });
    return department;
}
export const getAllDepartments = async () => {
    const departments = await prisma.department.findMany({
        select: {
            id: true,
            name: true
        }
    });
    return departments;
}

export const updateDepartment = async (id, data) => {
    const department = await prisma.department.update({
        where: {id: id},
        data: data,
        select: {
            id: true,
            name: true
        }

    });
    return department;
}
export const deleteDepartment = async (id) => {
    const department = await prisma.department.delete({
        where: {id: id},
        select: {
            id: true,
            name: true
        }
    });
    return department;
}

export const getDepartmentById = async (id) => {
    const department = await prisma.department.findUnique({
        where: {id: id},
        select: {
            id: true,
            name: true
        }
    });

    return department;
}

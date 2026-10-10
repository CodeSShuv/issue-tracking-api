import {createDepartment,getAllDepartments,updateDepartment,deleteDepartment,getDepartmentById} from "../services/department.services.js";
import AppError from "../utils/appError.js";
export const createDepartmentController = async (req, res) => {
    const {name} = req.body;
    if(!name){
       throw new AppError("Name is required", 400);
    }
    const department  = await createDepartment({name});
    res.status(201).json({
        success:true,
        data:department
    });
}

export const getAllDepartmentsController = async (req, res) => {
    const departments = await getAllDepartments();
    res.status(200).json({
        success:true,
        data:departments
    });
}

export const updateDepartmentController = async (req, res) => {
    const {id} = req.params;
    const {newName} = req.body;
    if(!newName){
        throw new AppError("Name is required", 400);
    }
    const department = await updateDepartment(id, {name: newName.trim()});
    res.status(200).json({
        success:true,
        data:department
    });
}


export const deleteDepartmentController = async (req, res) => {
    const {id} = req.params;
    const department = await deleteDepartment(id);
    res.status(200).json({
        success:true,
        data:department
    });
}

export const getDepartmentByIdController = async (req, res) => {
    const {id} = req.params;
    const department = await getDepartmentById(id);
    if(!department){
        throw new AppError("Department not found", 404);
    }
    res.status(200).json({
        success:true,
        data:department
    });
}

import {createUser, getUserByEmail,getUserById,getAllUsers, updateUser, getUserByIdWithPassword, resetPassword} from "../services/user.services.js";
import {generateAccessToken} from "../utils/jwt.js";
import bcrypt from "bcrypt";
import AppError from "../utils/appError.js";
import { env } from "prisma/config";
export const signupController = async (req, res) => {

        const {email, password, name} = req.body;
        let hashedPassword = await bcrypt.hash(password, 10);
        let userData = {
            email,
            password: hashedPassword,
            name        
        }
        const user = await createUser(userData);
        res.status(201).json({
            success:true,
            data:user
        });
  
}

export const loginController = async (req, res) => {
    const {email, password} = req.body;
    const user = await getUserByEmail(email);
    if(!user) throw new AppError("User not found", 404);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) throw new AppError("Invalid password", 401);
    const accessToken = generateAccessToken({id: user.id, email: user.email, role: user.role});
    res.status(200).json({
        success:true,
        data:{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken
        }
    });
}
       
export const profileController = async (req, res) => {
    const user = req.user;
    const userDate = await getUserById(user.id);
    if(!userDate) throw new AppError("User not found", 404);
    res.status(200).json({
        success:true,
        data:userDate
    });

}

export const getAllUsersController = async (req, res) => {
    console.log("getAllUsersController called");
    const users = await getAllUsers();
    if(!users) throw new AppError("No users found", 404);
    res.status(200).json({
        success:true,
        data:users
    });
}
export const updateProfileController = async (req, res) => {
    
    const {name, email} = req.body;
    const data = {};
    if(name == undefined && email == undefined) throw new AppError("No data to update", 400);

    if(name !== undefined) {
        if(typeof name !== "string" || name.trim() !== "") throw new AppError("Invalid name", 400);
        name =name.trim();
        data.name = name;
    }
    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        throw new AppError("A valid email is required", 400);
      }
        data.email = email.trim();
    }
   
    const user = await updateUser(req.user.id, data);
    res.status(200).json({
        success:true,
        data:user
    });
}

export const updatePasswordController = async (req, res) => {
    const {currentPassword, newPassword} = req.body;
    if(!currentPassword || !newPassword) throw new AppError("Old password and new password are required", 400);
    if(currentPassword === newPassword) throw new AppError("New password cannot be the same as old password", 400);
    if(newPassword.length < 6) throw new AppError("New password must be at least 6 characters long", 400);
    let user = await getUserByIdWithPassword(req.user.id);
    if(!user) throw new AppError("User not found", 404);
   
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if(!isMatch) throw new AppError("Invalid old password", 400);
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user = await updateUser(req.user.id, { password: hashedNewPassword });
    res.status(200).json({
        success:true,
        data:user
    });
}

export const resetUserPasswordController = async(req,res)=>{
    const {userId} = req.params;
    const newResetPassword = await bcrypt.hash(env.SECRETE_RESET_PASSWORD, 10);
    const user = await resetPassword(userId,newResetPassword);
    res.status(200).json({
        success:true,
        message:"User's password reset."
    });
}
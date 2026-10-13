import AppError from '../utils/appError.js';
import { createComment } from '../services/comment.services.js';
export const createCommentController = async (req,res)=>{
    const {content} = req.body;
    const {ticketId} =req.params;
    if(!content||!content.trim()){
        throw new AppError("Content cannot be empty ");
    }
    const comment = await createComment(ticketId, req.user.id, content);
    return res.status(201).json({
        success: true,
        message:"Comment added successfully ",
        data:comment
    });
}

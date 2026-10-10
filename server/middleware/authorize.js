import AppError from "../utils/appError.js";
const authorize = (allowedRoles ) =>{
    return (req,res,next )=>{
        if(!allowedRoles.includes(req.user.role)){
            return     next( new AppError("You are not authorized to access this resource", 403));
        }
        next();

    }
}

export default authorize;
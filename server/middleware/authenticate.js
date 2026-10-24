import {verifyAccessToken} from "../utils/jwt.js";
import AppError from "../utils/AppError.js";
const   authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("Unauthorized", 401));
    }

    const token = authHeader.split(" ")[1];
   const decoded =  verifyAccessToken(token, process.env.JWT_SECRET);
   if(!decoded) {
    return next(new AppError("Unauthorized", 401));
   }
   req.user = decoded;
   next();
}

export default authenticate;